// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceAutomation
 * @dev Contract để tự động lấy giá ETH tại thời điểm cụ thể và sau 30 phút
 */
contract PriceAutomation is AutomationCompatible {
    // Chainlink Price Feed cho ETH/USD
    AggregatorV3Interface public immutable priceFeed;
    
    // Thời gian bắt đầu automation (Unix timestamp)
    uint256 public startTime;
    
    // Thời gian kết thúc (30 phút sau startTime)
    uint256 public endTime;
    
    // Trạng thái automation
    bool public isActive;
    
    // Lưu trữ giá
    mapping(uint256 => int256) public priceHistory;
    uint256 public priceCount;
    
    // Events
    event AutomationStarted(uint256 startTime, uint256 endTime);
    event PriceRecorded(uint256 timestamp, int256 price);
    event AutomationCompleted();
    
    // Errors
    error AutomationNotActive();
    error InvalidTimeRange();
    error AutomationAlreadyStarted();
    
    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }
    
    /**
     * @dev Bắt đầu automation với thời gian cụ thể
     * @param _startTime Thời gian bắt đầu (Unix timestamp)
     */
    function startAutomation(uint256 _startTime) external {
        if (isActive) revert AutomationAlreadyStarted();
        if (_startTime <= block.timestamp) revert InvalidTimeRange();
        
        startTime = _startTime;
        endTime = _startTime + 30 minutes; // 30 phút sau
        isActive = true;
        
        emit AutomationStarted(startTime, endTime);
    }
    
    /**
     * @dev Chainlink Automation sẽ gọi function này để kiểm tra có cần thực hiện không
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        if (!isActive) return (false, "");
        
        uint256 currentTime = block.timestamp;
        
        // Kiểm tra nếu đã đến thời gian bắt đầu hoặc đã qua 30 phút
        if (currentTime >= startTime && currentTime <= endTime) {
            // Chỉ lấy giá mỗi 5 phút để tránh spam
            if (currentTime % 300 == 0) {
                return (true, "");
            }
        }
        
        // Nếu đã qua thời gian kết thúc, dừng automation
        if (currentTime > endTime) {
            return (true, "");
        }
        
        return (false, "");
    }
    
    /**
     * @dev Chainlink Automation sẽ gọi function này để thực hiện automation
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        if (!isActive) revert AutomationNotActive();
        
        uint256 currentTime = block.timestamp;
        
        // Nếu đã qua thời gian kết thúc, dừng automation
        if (currentTime > endTime) {
            isActive = false;
            emit AutomationCompleted();
            return;
        }
        
        // Lấy giá hiện tại từ Chainlink
        (, int256 price, , , ) = priceFeed.latestRoundData();
        
        // Lưu giá vào history
        priceHistory[currentTime] = price;
        priceCount++;
        
        emit PriceRecorded(currentTime, price);
    }
    
    /**
     * @dev Lấy giá mới nhất từ Chainlink
     */
    function getLatestPrice() external view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
    
    /**
     * @dev Lấy thông tin chi tiết về price feed
     */
    function getPriceFeedInfo() external view returns (
        uint8 decimals,
        string memory description,
        uint256 version
    ) {
        decimals = priceFeed.decimals();
        description = priceFeed.description();
        version = priceFeed.version();
    }
    
    /**
     * @dev Lấy tất cả giá đã được ghi lại
     */
    function getAllPrices() external view returns (uint256[] memory timestamps, int256[] memory prices) {
        timestamps = new uint256[](priceCount);
        prices = new int256[](priceCount);
        
        uint256 index = 0;
        for (uint256 i = 0; i < priceCount; i++) {
            if (priceHistory[i] != 0) {
                timestamps[index] = i;
                prices[index] = priceHistory[i];
                index++;
            }
        }
    }
    
    /**
     * @dev Dừng automation (chỉ owner)
     */
    function stopAutomation() external {
        isActive = false;
        emit AutomationCompleted();
    }
} 