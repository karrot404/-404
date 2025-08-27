// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IERC404Mintable {
    function mint(address to, uint256 amount) external;
}

contract SigmaMinter {
    address public owner;
    mapping(address => bool) public whitelisted404s;
    mapping(address => uint256) public loopsCompleted;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Sigma");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function whitelistToken(address token) external onlyOwner {
        whitelisted404s[token] = true;
    }

    function mint404(address token, uint256 amount) external {
        require(whitelisted404s[token], "Not a Σ token");
        IERC404Mintable(token).mint(msg.sender, amount);
        loopsCompleted[msg.sender] += 1;
    }

    function getLoopState(address user) external view returns (uint256) {
        return loopsCompleted[user];
    }
}
