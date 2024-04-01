import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

// Lesson 9 - https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-09
async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    const tokenContract = await viem.deployContract("MyToken");
    console.log(`Contract deployed at ${tokenContract.address}`);

    const totalSupply = await tokenContract.read.totalSupply();
    console.log({ totalSupply });

    // Fetch the MINTER role code
    const code = await tokenContract.read.MINTER_ROLE();
    console.log('This is the code for MINTER_ROLE:', { code });
    
    // Grant role to account2
    const roleTx = await tokenContract.write.grantRole([
        code,
        account2.account.address,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: roleTx });
    
    // Mint Transaction. Switch between account2 and deployer and see
    const mintTx = await tokenContract.write.mint(
      [account2.account.address, parseEther("10")], // Mint to account2, 10 ETH
      { account: account2.account } // Called mintTx with this account (pay gas), only account2 works.
    );
    await publicClient.waitForTransactionReceipt({ hash: mintTx });

    // Fetch token data with Promise.all() - total supply should increase by 10
    const [name, symbol, decimals, totalSupplyAfter] = await Promise.all([
      tokenContract.read.name(),
      tokenContract.read.symbol(),
      tokenContract.read.decimals(),
      tokenContract.read.totalSupply(),
    ]);
    console.log({ name, symbol, decimals, totalSupplyAfter });

    // Sending a transaction
    const tx = await tokenContract.write.transfer([
      account1.account.address,
      parseEther("2"),
    ]);
    await publicClient.waitForTransactionReceipt({ hash: tx });

    // Read the balance of all 3 accounts
    const myBalance = await tokenContract.read.balanceOf([deployer.account.address]);
    console.log(`My Balance is ${formatEther(myBalance)} ${symbol}`);
    const acc1Balance = await tokenContract.read.balanceOf([account1.account.address]);
    console.log(`Account1 Balance is ${formatEther(acc1Balance)} ${symbol}`);
    const acc2Balance = await tokenContract.read.balanceOf([account2.account.address]);
    console.log(`Account2 Balance is ${formatEther(acc2Balance)} ${symbol}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});