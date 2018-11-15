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

  //public events broadcasted on the blockchain
  event NewUser(address indexed newStudentAddress);
  event Transfer(address indexed from, address indexed to, uint256 value);

  //CreditScore represent the number of credits an user can give in a given month
  struct CreditScore{
    uint balance;
    uint lastMonthUpdate;
  }

  //Karma reprensent the total score a user as received from others
  struct Karma{
    uint balance;
  }

  //public variables
  string public name;
  string public symbol;
  uint CREDITS_BY_MONTH = 300;
  uint currentMonth;

  //balanceOfCredits tracks the credit score of each user
  mapping(address => CreditScore) balanceOfCredits;

  //balanceOfKarma tracks the karma of each user
  mapping(address => Karma) balanceOfKarma;

  //constructor
  constructor(string _name, string _symbol) public {
    name = _name;
    symbol = _symbol;
    currentMonth = 0;
  }

  //_addUser register a key in both balanceOfCredits and balanceOfKarma
  function _addUser(address _newUser) public {
    CreditScore memory newCreditscore  = CreditScore(300, currentMonth);
    Karma memory newKarma = Karma(0);
    balanceOfKarma[_newUser] = newKarma;
    balanceOfCredits[_newStudent] = newCreditscore;
    NewUser(_newUser);
  }

  //_transfer transfer credit from an account and credits the receiver new karma
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
          }
          //Check if the balance of the sender is superior to value
          require(balanceOfCredits[_from].balance>=_value);
          //Updates the balances accordingly
          uint256 previousTotalBalance = balanceOfCredits[_from].balance + balanceOfKarma[_to].balance;
          balanceOfCredits[_from].balance = SafeMath.sub(balanceOfCredits[_from].balance, _value);
          balanceOfKarma[_to].balance = SafeMath.add(balanceOfKarma[_to].balance, _value);
          Transfer(_from, _to, _value);
        }
  //_setNewMonth update the month to reset the credit balance of every user
  function _setNewMonth() public onlyOwner() {
        currentMonth = currentMonth + 1;
      }
  //_changeAllowance modifies the credit allowance if needed
  function _changeAllowance(uint _newAllowance) public onlyOwner() {
    CREDITS_BY_MONTH = _newAllowance;
  }
