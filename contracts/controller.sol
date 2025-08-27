// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SigmaController {
    address public owner;
    address public vault;

    struct TokenConfig {
        bool isActive;
        uint256 ltv; // Loan-To-Value ratio (e.g. 7500 = 75%)
        uint256 liquidationThreshold; // e.g. 8500 = 85%
        address interestModel; // Contract that calculates interest rate
    }

    mapping(address => TokenConfig) public tokenConfigs;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Sigma Mother");
        _;
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Not Vault");
        _;
    }

    constructor(address _vault) {
        owner = msg.sender;
        vault = _vault;
    }

    function setTokenConfig(
        address token,
        bool isActive,
        uint256 ltv,
        uint256 liquidationThreshold,
        address interestModel
    ) external onlyOwner {
        require(ltv <= liquidationThreshold, "Bad config");
        tokenConfigs[token] = TokenConfig({
            isActive: isActive,
            ltv: ltv,
            liquidationThreshold: liquidationThreshold,
            interestModel: interestModel
        });
    }

    function getLTV(address token) external view returns (uint256) {
        return tokenConfigs[token].ltv;
    }

    function getLiquidationThreshold(address token) external view returns (uint256) {
        return tokenConfigs[token].liquidationThreshold;
    }

    function getInterestModel(address token) external view returns (address) {
        return tokenConfigs[token].interestModel;
    }

    function isTokenEnabled(address token) external view returns (bool) {
        return tokenConfigs[token].isActive;
    }
}
