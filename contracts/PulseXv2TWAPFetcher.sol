// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IPair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 timestampLast);
    function token0() external view returns (address);
    function token1() external view returns (address);
}

contract PulseXTWAP {
    mapping(address => address) public tokenToPair;
    mapping(address => uint256) public lastPrice;

    function registerPair(address token, address pair) external {
        tokenToPair[token] = pair;
    }

    function getTWAP(address token) public view returns (uint256 price) {
        address pair = tokenToPair[token];
        require(pair != address(0), "Pair not registered");

        (uint112 r0, uint112 r1, ) = IPair(pair).getReserves();
        address token0 = IPair(pair).token0();
        address token1 = IPair(pair).token1();

        // Assume token0 is the 404 token, token1 is PLS (or a base asset)
        if (token0 == token) {
            price = (uint256(r1) * 1e18) / uint256(r0);
        } else {
            price = (uint256(r0) * 1e18) / uint256(r1);
        }

        return price;
    }
}
