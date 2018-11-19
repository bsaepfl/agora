pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Agora.sol";

contract TestAgora {
  
  Agora agora = Agora(DeployedAddresses.Agora());
  // Addresses of two test acounts: replace with two accounts in your testnet
  address Alice = 0x05B72c78bCA0C3e2E246D6197152346811DE01F4;
  address Bob = 0x08d1Aa26bbf249A4932d83a90f20E53efA1B12Df;
  
  function testInitialStatus() internal {
    // Test the initial status of the contract: current month and student number 
    uint expectedMonth = 0;
    uint expectedStudentNum = 0;
    Assert.equal(agora.currentMonth(), expectedMonth, "Current Month starts from 0!");
    Assert.equal(agora.studentNum(), expectedStudentNum, "Student Number starts from 0!");
  }

  function testAddStudent() internal {
    // Test of adding a new student: Alice
    agora.addStudent(Alice);
    uint expectedStudentNum = 1;
    uint expectedInitialKarma = 0;
    uint expectedInitialCredit = 300; 
    uint expectedMonth = agora.currentMonth();

    Assert.equal(agora.studentNum(), expectedStudentNum, "There should be 1 student");
    Assert.equal(agora.getKarmaBalance(Alice),expectedInitialKarma,"Initial Karma should be 0");
    Assert.equal(agora.getCreditScoreBalance(Alice),expectedInitialCredit,"Initial Credit Score should be 300, filled at the current month");
    Assert.equal(agora.getLastMonthUpdate(Alice),expectedMonth,"Initial Credit Score should be filled at the current month");
  }

  function testNormalTransfer() internal {
    // Test of transfer between two student: Alice and Bob
    uint expectedStudentNum = 2;
    uint transferAmount = 100;
    uint expectedBobKarma = transferAmount;
    uint expectedAliceCredit = 300 - transferAmount; 

    agora.addStudent(Bob);
    agora._exposedTransfer(Alice,Bob,transferAmount);

    Assert.equal(agora.studentNum(), expectedStudentNum, "There should be 2 student");
    Assert.equal(agora.getKarmaBalance(Bob),expectedBobKarma,"Bob should get 100 Karma");
    Assert.equal(agora.getCreditScoreBalance(Alice),expectedAliceCredit,"Alice should only have 200 credits now");
  }

  function testOverspendPrevention() internal {
    // TODO
  }

  function testMonthlyRefill() internal{
    // TODO
  } 

}
