// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SEEDToken is ERC20 {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;  // 1 billion tokens, with 18 decimals

    constructor() ERC20("SEED", "$SEED") {
        _mint(msg.sender, MAX_SUPPLY);
    }

}
