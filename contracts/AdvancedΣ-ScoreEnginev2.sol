// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface ISigmaVault {
    function isHealthy(address user) external view returns (bool);
}

contract SigmaScore {
    address public vault;
    address public minter;
    address public dao;

    struct SigmaData {
        uint256 deposits;
        uint256 borrows;
        uint256 loopsCompleted;
        uint256 loopStartBlock;
        uint256 mintLoops;
        uint256 lpBoost; // DAO-set
        uint256 lastUpdatedBlock;
        uint256 daysHealthy; // Tracked over time
    }

    mapping(address => SigmaData) public scores;

    struct Weight {
        uint256 depositWeight;
        uint256 borrowWeight;
        uint256 loopWeight;
        uint256 mintWeight;
        uint256 lpWeight;
        uint256 healthyWeight;
    }

    Weight public weights;

    modifier onlyVault() {
        require(msg.sender == vault, "Not Vault");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not Minter");
        _;
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Not DAO");
        _;
    }

    constructor(address _vault, address _minter, address _dao) {
        vault = _vault;
        minter = _minter;
        dao = _dao;

        weights = Weight({
            depositWeight: 1,
            borrowWeight: 2,
            loopWeight: 5,
            mintWeight: 3,
            lpWeight: 10,
            healthyWeight: 1
        });
    }

    // Vault Hooks
    function recordDeposit(address user, uint256 amount) external onlyVault {
        _updateHealth(user);
        scores[user].deposits += amount;
    }

    function recordBorrow(address user, uint256 amount) external onlyVault {
        _updateHealth(user);
        scores[user].borrows += amount;
    }

    function recordLoopComplete(address user) external onlyVault {
        _updateHealth(user);
        scores[user].loopsCompleted += 1;
        scores[user].loopStartBlock = block.number;
    }

    // Minter Hook
    function recordMintLoop(address user) external onlyMinter {
        _updateHealth(user);
        scores[user].mintLoops += 1;
    }

    // DAO Hook
    function applyLPBoost(address user, uint256 boostPoints) external onlyDAO {
        scores[user].lpBoost += boostPoints;
    }

    // Health Logic
    function _updateHealth(address user) internal {
        SigmaData storage data = scores[user];
        if (data.lastUpdatedBlock == 0) {
            data.lastUpdatedBlock = block.number;
            return;
        }

        if (ISigmaVault(vault).isHealthy(user)) {
            uint256 blocksPassed = block.number - data.lastUpdatedBlock;
            uint256 days = blocksPassed / 28800; // Approx 1 day on PulseChain (3s blocks)
            data.daysHealthy += days;
        }

        data.lastUpdatedBlock = block.number;
    }

    function getSigmaScore(address user) external view returns (uint256) {
        SigmaData memory d = scores[user];
        return
            (d.deposits * weights.depositWeight) +
            (d.borrows * weights.borrowWeight) +
            (d.loopsCompleted * weights.loopWeight) +
            (d.mintLoops * weights.mintWeight) +
            (d.lpBoost * weights.lpWeight) +
            (d.daysHealthy * weights.healthyWeight);
    }

    // DAO can tune weights
    function setWeights(Weight calldata newWeights) external onlyDAO {
        weights = newWeights;
    }
}
