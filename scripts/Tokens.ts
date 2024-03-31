import { viem } from "hardhat";
import { parseEther } from "viem";

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    const tokenContract = await viem.deployContract("MyToken");
    console.log(`Contract deployed at ${tokenContract.address}`);

    const totalSupply = await tokenContract.read.totalSupply();
    console.log({ totalSupply });

    // Fetch the role code
    const code = await tokenContract.read.MINTER_ROLE();
    
    // Grant role to account2
    const roleTx = await tokenContract.write.grantRole([
        code,
        account2.account.address,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: roleTx });
    
    // Mint Transaction. Switch between account2 and deployer and see
    const mintTx = await tokenContract.write.mint(
      [deployer.account.address, parseEther("10")],
      { account: account2.account }
    );
    await publicClient.waitForTransactionReceipt({ hash: mintTx });

    // Fetch token data with Promise.all()
    const [name, symbol, decimals, totalSupplyAfter] = await Promise.all([
      tokenContract.read.name(),
      tokenContract.read.symbol(),
      tokenContract.read.decimals(),
      tokenContract.read.totalSupply(),
    ]);
    console.log({ name, symbol, decimals, totalSupplyAfter });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});