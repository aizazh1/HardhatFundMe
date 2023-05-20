// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConvertor.sol";

error FundMe__NotOwner();
error FundMe__FundFailed();
error FundMe__WithdrawFailed();

/**
 * @title A contract for crowd funding
 * @author Aizaz Hassan
 * @notice This contract is used to demo crowd funding to a project
 */
contract FundMe {
    using PriceConvertor for uint256;

    uint256 public constant MINIMUM_USD = 50;

    address private immutable i_owner;
    AggregatorV3Interface private immutable i_priceFeed;

    // storage variables - takes lots of gas!
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @notice This function is used to fund the project
     */
    function fund() public payable {
        if (msg.value.getConversionRate(i_priceFeed) <= (MINIMUM_USD * 1e18)) {
            revert FundMe__FundFailed();
        }
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    /**
     * @notice This function is used to get the minimum amount in Wei required to fund the project
     * @return minAmount The minimum amount required to fund the project
     */
    function getMinWeiRequired() public view returns (uint256) {
        uint256 ethPrice = PriceConvertor.getLatestPrice(i_priceFeed);
        uint256 minAmount = (MINIMUM_USD * 1e18) / (ethPrice / 1e18);
        return minAmount;
    }

    /**
     * @notice this function is used to withdraw the funds from the contract to the owner
     */
    function withdraw() public onlyOwner {
        // saving the funders in memory to save gas
        address[] memory funders = s_funders;
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!callSuccess) revert FundMe__WithdrawFailed();
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAmountFunded(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }
}
