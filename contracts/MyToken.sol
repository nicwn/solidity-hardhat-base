// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 10 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Only address with MINTER_ROLE can call mint function: (onlyRole or onlyOwner is from OpenZeppelin AccessControl)
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
