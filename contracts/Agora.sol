pragma solidity ^0.4.16;

import "./SafeMath.sol";
// Consider using openzeppelin library for ownership and SafeMath etc.?
contract owned {
    address public owner;

    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
}

contract Agora is owned {

  using SafeMath for uint256;

  // Transfer event
  event Transfer(
    address from,
    address to,
    uint value
  );

  // AddStudent event
  event NewStudent(
    address newStudent
  );

  // Resupply event
  event Resupply(
    address account,
    uint month
  );


  struct CreditScore{
    uint balance;
    uint lastMonthUpdate;
  }

  struct Karma{
    uint balance;
  }

  string public name;
  string public symbol;
  uint public lastResetDate;
  uint constant CREDITS_BY_MONTH = 300;
  uint public currentMonth;
  uint public studentNum;

  //amount you can give
  mapping(address => CreditScore) balanceOfCredits;
  //karma balance
  mapping(address => Karma) balanceOfKarma;


  constructor(string _name, string _symbol) public {
    name = _name;
    symbol = _symbol;
    currentMonth = 0;
    studentNum = 0;
  }

  function addStudent(address _newStudent) public {
    CreditScore memory newCreditscore  = CreditScore(300, currentMonth);
    balanceOfCredits[_newStudent] = newCreditscore;
    studentNum = SafeMath.add(studentNum,1);
    emit NewStudent(_newStudent);
  }

  function getKarmaBalance(address _oneStudent) public view returns (uint) {
    return balanceOfKarma[_oneStudent].balance;
  }
  
  function getCreditScoreBalance(address _oneStudent) public view returns (uint) {
    return balanceOfCredits[_oneStudent].balance;
  }

  function getLastMonthUpdate(address _oneStudent) public view returns (uint) {
    return balanceOfCredits[_oneStudent].lastMonthUpdate;
  }
 

  function _transfer(address _from, address _to, uint _value) internal {
          //Check the receiver address is != of 0
          require(_to != 0x0, "receiver addres is not valid");
          //Check the receiver and sender are not the same person
          require(_from != _to, "Sender try tou send himself credits");

          //Check that the balance of the receiver after transaction will be greater or equal than before
          require(balanceOfKarma[_to].balance + _value >= balanceOfKarma[_to].balance, "The balance of receiver is lower than it should be, Overflow?");

          //Check if the current month of the sender is correct
          if (balanceOfCredits[_from].lastMonthUpdate<currentMonth){
            balanceOfCredits[_from].lastMonthUpdate = currentMonth;
            balanceOfCredits[_from].balance = CREDITS_BY_MONTH;
            emit Resupply(_from, currentMonth);
          }
          //Check if the balance of the sender is superior to value
          require(balanceOfCredits[_from].balance>=_value);

          uint256 previousTotalBalance = balanceOfCredits[_from].balance + balanceOfKarma[_to].balance;
          balanceOfCredits[_from].balance = SafeMath.sub(balanceOfCredits[_from].balance, _value);
          balanceOfKarma[_to].balance = SafeMath.add(balanceOfKarma[_to].balance, _value);
          /*
          //Transfer
          balanceOfCredits[_from] = SafeMath.sub(balanceOfCredits[_from], _value);
          balanceOfKarma[_to] = SafeMath.add(balanceOfKarma[_to], _value);*/
          //Assert
          assert(balanceOfCredits[_from].balance + balanceOfKarma[_to].balance == previousTotalBalance);

          emit Transfer(_from, _to, _value);
      }
  // An exposed transfer for testing  
  function _exposedTransfer(address _from, address _to, uint _value) public {
      _transfer(_from, _to, _value);
  }  
  
  function setNewMonth() public onlyOwner() {
        currentMonth = currentMonth + 1;
      }
}

