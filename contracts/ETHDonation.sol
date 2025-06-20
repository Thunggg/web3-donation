// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ETHDonation {
    address public owner;
    uint256 public totalAmount;

    struct Donation {
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    struct Donor {
        uint256 totalAmount;
        Donation[] donationHistory;
        string latestMessage;
    }

    mapping(address => Donor) public donors;
    address[] public donorAddress;

    event Donate(address indexed donor, uint256 amount, string message);
    event Withdraw(address indexed receiver, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function donate(string calldata _message) external payable {
        require(msg.value >= 0.01 ether, "Donation must be greater than 0");

        // Nếu là người mới thì push vào mảng
        if (donors[msg.sender].totalAmount == 0) {
            donorAddress.push(msg.sender);
        }

        // Thêm vào lịch sử
        donors[msg.sender].donationHistory.push(
            Donation({
                amount: msg.value,
                message: _message,
                timestamp: block.timestamp
            })
        );

        donors[msg.sender].totalAmount += msg.value;
        donors[msg.sender].latestMessage = _message; // Lưu lời nhắn mới nhất
        totalAmount += msg.value;

        emit Donate(msg.sender, msg.value, _message);
    }

    function withdraw() external {
        require(address(msg.sender) == owner, "Only owner can withdraw");
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");

        payable(owner).transfer(amount);

        emit Withdraw(owner, amount);
    }

    // Lấy thông tin donor
    function getDonor(
        address _donor
    ) external view returns (uint256, string memory) {
        return (donors[_donor].totalAmount, donors[_donor].latestMessage);
    }

    // Lấy tổng số donor
    function getTotalDonors() external view returns (uint256) {
        return donorAddress.length;
    }

    // Lấy balance hiện tại của contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getDonorHistory(
        address _donor
    ) external view returns (Donation[] memory) {
        return donors[_donor].donationHistory;
    }
}
