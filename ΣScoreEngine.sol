// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SigmaScore {
    address public vault; // Lending Vault address
    address public minter; // ΣMinter
    address public ksvDAO;

    struct SigmaData {
        uint256 deposits;
        uint256 borrows;
        uint256 loops;
        uint256 avoidedLiquidationDays;
        uint256 minted;
        uint256 lpPairsContributed;
    }

    mapping(address => SigmaData) public scores;

    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not minter");
        _;
    }

    constructor(address _vault, address _minter, address _ksvDAO) {
        vault = _vault;
        minter = _minter;
        ksvDAO = _ksvDAO;
    }

    function recordDeposit(address user, uint256 amount) external onlyVault {
        scores[user].deposits += amount;
    }

    function recordBorrow(address user, uint256 amount) external onlyVault {
        scores[user].borrows += amount;
    }

    function recordRepayLoop(address user) external onlyVault {
        scores[user].loops += 1;
    }

    function recordMintLoop(address user) external onlyMinter {
        scores[user].minted += 1;
    }

    function recordLPBoost(address user, uint256 pairs) external {
        require(msg.sender == ksvDAO, "DAO only");
        scores[user].lpPairsContributed += pairs;
    }

    function getSigmaScore(address user) external view returns (uint256) {
        SigmaData memory s = scores[user];
        return
            (s.deposits) +
            (s.borrows * 2) +
            (s.loops * 5) +
            (s.avoidedLiquidationDays) +
            (s.minted * 3) +
            (s.lpPairsContributed * 10);
    }
}
