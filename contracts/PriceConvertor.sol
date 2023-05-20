// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title A library for converting ETH to USD
 * @notice This library is used to convert ETH to USD
 */
library PriceConvertor {
    /**
     * @notice This function is used to get the latest price of ETH in USD
     * @param priceFeed The price feed contract
     * @return price The latest price of ETH in USD
     */
    function getLatestPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();

        return uint256(price * 1e10);
    }

    /**
     * @notice This function is used to convert ETH to USD
     * @param ethAmount The amount of ETH to convert
     * @param priceFeed The price feed contract
     * @return ethAmountInUsd The amount of ETH in USD
     */
    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getLatestPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
