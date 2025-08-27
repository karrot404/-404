// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IERC404 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IPulseXv2TWAP {
    function getTWAP(address token) external view returns (uint256);
}

contract Sigma404LendingVault {
    struct Position {
        uint256 deposited;
        uint256 borrowed;
    }

    address public owner;
    IPulseXv2TWAP public twapOracle;

    mapping(address => bool) public supportedTokens; // ERC-404 tokens only
    mapping(address => mapping(address => Position)) public positions; // user => token => position

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Sigma Mother");
        _;
    }

    constructor(address _twapOracle) {
        owner = msg.sender;
        twapOracle = IPulseXv2TWAP(_twapOracle);
    }

    function whitelistToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    function deposit(address token, uint256 amount) external {
        require(supportedTokens[token], "Unsupported 404");
        require(IERC404(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        positions[msg.sender][token].deposited += amount;
    }

    function borrow(address token, uint256 amount) external {
        require(supportedTokens[token], "Unsupported 404");

        uint256 collateralValue = getCollateralValue(msg.sender);
        uint256 totalDebt = getTotalDebtValue(msg.sender);
        uint256 newDebt = getTokenValue(token, amount);

        require(collateralValue >= totalDebt + newDebt, "Not enough collateral");

        positions[msg.sender][token].borrowed += amount;
        require(IERC404(token).transfer(msg.sender, amount), "Borrow transfer failed");
    }

    function repay(address token, uint256 amount) external {
        require(supportedTokens[token], "Unsupported 404");

        require(IERC404(token).transferFrom(msg.sender, address(this), amount), "Repay transfer failed");

        uint256 borrowed = positions[msg.sender][token].borrowed;
        positions[msg.sender][token].borrowed = borrowed > amount ? borrowed - amount : 0;
    }

    function getTokenValue(address token, uint256 amount) public view returns (uint256) {
        uint256 twap = twapOracle.getTWAP(token); // pulls 15m TWAP
        return (amount * twap) / 1e18;
    }

    function getCollateralValue(address user) public view returns (uint256 value) {
        for (uint i = 0; i < 1; i++) { /* placeholder for token loop */ }
        // In production, loop all supportedTokens & sum positions[user][token].deposited * TWAP
        return 0; // placeholder
    }

    function getTotalDebtValue(address user) public view returns (uint256 value) {
        for (uint i = 0; i < 1; i++) { /* placeholder for token loop */ }
        // Similar loop for borrowed amounts
        return 0; // placeholder
    }
}
