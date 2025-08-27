// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract KSVDAO {
    address public owner;

    address public vault;
    address public controller;
    address public score;
    address public minter;
    address public interestModel;
    address public liquidator;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not DAO Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function registerAll(
        address _vault,
        address _controller,
        address _score,
        address _minter,
        address _interest,
        address _liquidator
    ) external onlyOwner {
        vault = _vault;
        controller = _controller;
        score = _score;
        minter = _minter;
        interestModel = _interest;
        liquidator = _liquidator;
    }

    function callAsDAO(address target, bytes calldata data) external onlyOwner {
        (bool ok, ) = target.call(data);
        require(ok, "DAO call failed");
    }
}
