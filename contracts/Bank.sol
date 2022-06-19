// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "./@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Bank {
    address owner;
    bytes32[] public whiteListedSymbols;
    mapping(bytes32 => address) public whiteListedTokens;
    //amount of tokens of the symbol given
    mapping(address => mapping(bytes32 => uint256)) public balances;

    constructor () {
        owner = msg.sender;
    }
    // allows owner to add tokens to whitelist array
    function whiteListToken (bytes32 symbol, address tokenAddress) external {
        require(msg.sender == owner, "This function is not Public");

        whiteListedSymbols.push(symbol);
        //each token has its own contract found at a address
        whiteListedTokens[symbol] = tokenAddress;
    }

    function getWhiteListedSymbols() external view returns(bytes32[] memory) {
        return whiteListedSymbols;
    }

    function getWhiteListedTokensAddress(bytes32 symbol) external view returns(address) {
        // in order to interact with each token we need to use its address
        return whiteListedTokens[symbol];
    }

    receive() external payable {
        balances[msg.sender]['Eth'] += msg.value;
    }

    function withdrawEther (uint amount) external {
        require(balances[msg.sender]['Eth'] >= amount, 'Insufficient Funds');

        balances[msg.sender]['Eth'] -= amount;
        payable(msg.sender).call{value:amount};
    }

    function depositTokens(uint amount, bytes32 symbol) external {
        balances[msg.sender][symbol] += amount;
        IERC20(whiteListedTokens[symbol]).transferFrom(msg.sender, address(this), amount);
    }

    function withdrawTokens (uint amount, bytes32 symbol) external {
        require(balances[msg.sender][symbol] >= amount, 'Insufficient Funds');


        balances[msg.sender][symbol] += amount;
        // requests erc20 contract to transfer funds to defined wallet
        IERC20(whiteListedTokens[symbol]).transfer(msg.sender,amount);
    }

    function getTokenBalance(bytes32 symbol) external view returns(uint256) {
        return balances[msg.sender][symbol];
    }
}