// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract FantomCoinSender {
    event sendDifferentValueEvent (
        address from,
        address[] to,
        uint[] values
    );

    event sendSameValueEvent (
        address from,
        address[] to,
        uint value
    );

    function sendDifferentValue (address[] memory recipients, uint256[] memory values) public payable {
        for (uint256 i = 0; i < recipients.length; i++)
            payable(recipients[i]).transfer(values[i]);
        uint256 balance = address(this).balance;
        emit sendDifferentValueEvent(msg.sender, recipients, values);
        if (balance > 0)
            payable(msg.sender).transfer(balance);
    }

    function sendSameValue (address[] memory recipients, uint256 value) public payable {
        for (uint256 i = 0; i < recipients.length; i++)
            payable(recipients[i]).transfer(value);
        uint256 balance = address(this).balance;
        emit sendSameValueEvent(msg.sender, recipients, value);
        if (balance > 0)
            payable(msg.sender).transfer(balance);
    }

}