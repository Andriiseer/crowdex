pragma solidity ^0.8.0;

import "./Token.sol";
import "./lib/math.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vesting is DSMath {
  Token public token;
  address public admin;

  event GrantAdded(address recipient, uint256 startTime, uint128 amount, uint128 vestingDuration, uint128 vestingCliff, uint128 vestingInterval);
  event GrantRemoved(address recipient, uint128 amountVested, uint128 amountNotVested);
  event GrantTokensClaimed(address recipient, uint128 amountClaimed);

  struct Grant {
    uint startTime;
    uint128 amount;
    uint128 vestingDuration;
    uint128 vestingCliff;
    uint128 intervalsClaimed;
    uint128 totalClaimed;
    uint128 vestingInterval;
  }
  mapping (address => Grant) public tokenGrants;

  modifier onlyAdmin {
    require(msg.sender == admin, "vesting-unauthorized");
    _;
  }

  modifier nonZeroAddress(address x) {
    require(x != address(0), "token-zero-address");
    _;
  }

  modifier noGrantExistsForUser(address _user) {
    require(tokenGrants[_user].startTime == 0, "token-user-grant-exists");
    _;
  }

  constructor(address _token, address _admin)
  nonZeroAddress(_token)
  nonZeroAddress(_admin)
  {
    token = Token(_token);
    admin = _admin;
  }


  /// @param _startTime Grant start time as seconds since unix epoch
  /// Allows backdating grants by passing time in the past. If `0` is passed here current blocktime is used. 
  /// @param _recipient Address of vesting recipient
  /// @param _amount Total number of tokens in grant
  /// @param _vestingDuration Number of intervals of the grant's duration
  /// @param _vestingCliff Number of intervals of the grant's vesting cliff
  /// @param _vestingInterval Number of seconds in one vesting interval
  function addTokenGrant(
    address _recipient,
    uint256 _startTime, 
    uint128 _amount, 
    uint128 _vestingDuration, 
    uint128 _vestingCliff,
    uint128 _vestingInterval
  ) public 
    onlyAdmin()
    noGrantExistsForUser(_recipient)
  {
    require(_vestingCliff > 0, "token-zero-vesting-cliff");
    require(_vestingInterval > 0, "vesting-interval-less-than-zero");
    require(_vestingDuration > _vestingCliff, "token-cliff-longer-than-duration");
    uint amountVestedPerDay = _amount / _vestingDuration;
    require(amountVestedPerDay > 0, "token-zero-amount-vested-per-month");

    // Transfer the grant tokens under the control of the vesting contract
    token.transferFrom(admin, address(this), _amount);

    Grant memory grant = Grant({
      startTime: _startTime == 0 ? block.timestamp : _startTime,
      amount: _amount,
      vestingDuration: _vestingDuration,
      vestingCliff: _vestingCliff,
      intervalsClaimed: 0,
      totalClaimed: 0,
      vestingInterval: _vestingInterval
    });

    tokenGrants[_recipient] = grant;
    emit GrantAdded(_recipient, grant.startTime, _amount, _vestingDuration, _vestingCliff, _vestingInterval);
  }

  /// @notice Terminate token grant transferring all vested tokens to the `_recipient`
  /// and returning all non-vested tokens to the admin
  /// Secured to the admin only
  /// @param _recipient Address of the token grant recipient
  function removeTokenGrant(address _recipient) external 
  onlyAdmin()
  {
    Grant storage tokenGrant = tokenGrants[_recipient];
    uint128 daysVested;
    uint128 amountVested;
    (daysVested, amountVested) = calculateGrantClaim(_recipient);
    uint128 amountNotVested = uint128(sub(sub(tokenGrant.amount, tokenGrant.totalClaimed), amountVested));

    require(token.transfer(_recipient, amountVested), "token-recipient-transfer-failed");
    require(token.transfer(admin, amountNotVested), "token-multisig-transfer-failed");

    tokenGrant.startTime = 0;
    tokenGrant.amount = 0;
    tokenGrant.vestingDuration = 0;
    tokenGrant.vestingCliff = 0;
    tokenGrant.intervalsClaimed = 0;
    tokenGrant.totalClaimed = 0;

    emit GrantRemoved(_recipient, amountVested, amountNotVested);
  }

  /// @notice Allows a grant recipient to claim their vested tokens. Errors if no tokens have vested
  /// It is advised recipients check they are entitled to claim via `calculateGrantClaim` before calling this
  function claimVestedTokens() public {
    uint128 intervalsVested;
    uint128 amountVested;
    (intervalsVested, amountVested) = calculateGrantClaim(msg.sender);
    require(amountVested > 0, "token-zero-amount-vested");

    Grant memory tokenGrant = tokenGrants[msg.sender];
    tokenGrant.intervalsClaimed = uint128(add(tokenGrant.intervalsClaimed, intervalsVested));
    tokenGrant.totalClaimed = uint128(add(tokenGrant.totalClaimed, amountVested));
    
    require(token.transfer(msg.sender, amountVested), "token-sender-transfer-failed");
    emit GrantTokensClaimed(msg.sender, amountVested);
  }

  /// @notice Calculate the vested and unclaimed days and tokens available for `_recepient` to claim
  /// Due to rounding errors once grant duration is reached, returns the entire left grant amount
  /// Returns (0, 0) if cliff has not been reached
  function calculateGrantClaim(address _recipient) public view returns (uint128, uint128) {
    Grant storage tokenGrant = tokenGrants[_recipient];

    // For grants created with a future start date, that hasn't been reached, return 0, 0
    if (block.timestamp < tokenGrant.startTime) {
      return (0, 0);
    }

    // Check cliff was reached
    uint elapsedTime = sub(block.timestamp, tokenGrant.startTime);
    uint elapsedIntervals = elapsedTime / tokenGrant.vestingInterval;

    if (elapsedIntervals < tokenGrant.vestingCliff) {
      return (0, 0);
    }

    // If over vesting duration, all tokens vested
    if (elapsedIntervals >= tokenGrant.vestingDuration) {
      uint128 remainingGrant = tokenGrant.amount - tokenGrant.totalClaimed;
      return (tokenGrant.vestingDuration, remainingGrant);
    } else {
      uint128 intervalsVested = uint128(sub(elapsedIntervals, tokenGrant.intervalsClaimed));
      uint amountVestedPerInterval = tokenGrant.amount / tokenGrant.vestingDuration;
      uint128 amountVested = uint128(mul(intervalsVested, amountVestedPerInterval));
      return (intervalsVested, amountVested);
    }
  }
}