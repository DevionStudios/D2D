// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Fund {
    error Fund__AlreadyRegistered();
    address payable owner;
    IERC20 public token;

    mapping(address => uint8) private s_isAddressRegistered;
    uint256 private s_firstRegisterTokenRewardAmount;

    /**
     * @param tokenAddress is the address of the token contract
     * @param firstRegisterTokenRewardAmount is the amount of tokens that will be airdropped to the user when they register for the first time
     */
    constructor(address tokenAddress, uint256 firstRegisterTokenRewardAmount)
        payable
    {
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
        s_firstRegisterTokenRewardAmount = firstRegisterTokenRewardAmount;
    }

    /**
     * @dev Registers the user's address and airdrops tokens to them
     */
    function firstSignUpReward() public {
        if (s_isAddressRegistered[msg.sender] == 1)
            revert Fund__AlreadyRegistered();
        s_isAddressRegistered[msg.sender] = 1;
        token.approve(address(this), s_firstRegisterTokenRewardAmount);
        console.log(
            "available balance",
            token.allowance(address(this), address(this))
        );
        token.transferFrom(
            address(this),
            address(msg.sender),
            s_firstRegisterTokenRewardAmount
        );
    }
}
