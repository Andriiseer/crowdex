pragma solidity 0.8.0;

import "./lib/math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Token.sol";
import "./NFT.sol";
import "hardhat/console.sol";

contract ICO is DSMath {
    using SafeMath for uint256;

    struct Sale {
        address investor;
        uint256 amount;
        bool tokensWithdrawn;
    }
    mapping(address => Sale) public sales;

    event GrantAdded(
        address recipient,
        uint256 startTime,
        uint256 amount,
        uint16 vestingDuration
    );
    event GrantRemoved(
        address recipient,
        uint256 amountVested,
        uint256 amountNotVested
    );
    event GrantTokensClaimed(address recipient, uint256 amountClaimed);

    struct Grant {
        uint256 startTime;
        uint256 amount;
        uint16 vestingDuration;
        uint16 intervalsClaimed;
        uint256 totalClaimed;
    }

    mapping(address => Grant) public busdGrants;

    address public admin;
    uint256 public end;
    uint256 public duration;
    uint256 public price;
    uint256 public availableTokens;
    uint256 public minPurchase;
    uint256 public maxPurchase;
    address private authorAddress;
    address private nftAddress;
    uint256 public vestingInterval;

    Token public token;
    Token public busd;
    NFT private nft;

    constructor(
        address tokenAddress,
        uint256 _duration,
        uint256 _price,
        uint256 _availableTokens,
        uint256 _minPurchase,
        uint256 _maxPurchase,
        address busdAddress,
        address _authorAddress,
        uint256 _vestingInterval
    ) {
        token = Token(tokenAddress);
        busd = Token(busdAddress);
        nftAddress = address(0);

        require(_duration > 0, "duration should be > 0");
        require(
            _availableTokens > 0 && _availableTokens <= token.maxTotalSupply(),
            "_availableTokens should be > 0 and <= maxTotalSupply"
        );
        require(_minPurchase > 0, "_minPurchase should > 0");
        require(
            _maxPurchase > 0 && _maxPurchase <= _availableTokens,
            "_maxPurchase should be > 0 and <= _availableTokens"
        );

        authorAddress = _authorAddress;
        vestingInterval = _vestingInterval;
        admin = msg.sender;
        duration = _duration;
        price = _price;
        availableTokens = _availableTokens;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
    }

    function start() external onlyAdmin() icoNotActive() {
        end = block.timestamp + duration;
    }

    function buy(uint256 busdAmount) external icoActive() {
        require(
            busdAmount >= minPurchase && busdAmount <= maxPurchase,
            "have to buy between minPurchase and maxPurchase"
        );
        uint256 tokenAmount = busdAmount.div(price);
        require(
            tokenAmount <= availableTokens,
            "Not enough tokens left for sale"
        );
        busd.transferFrom(msg.sender, address(this), busdAmount);
        token.mint(address(this), tokenAmount);

        Sale storage sale = sales[msg.sender];

        if (sale.amount == 0) {
            sales[msg.sender] = Sale(msg.sender, tokenAmount, false);
        } else {
            sale.amount = sale.amount + tokenAmount;
        }
    }

    function withdrawTokens() external icoEnded() {
        Sale storage sale = sales[msg.sender];
        require(sale.amount > 0, "only investors");
        require(sale.tokensWithdrawn == false, "tokens were already withdrawn");
        sale.tokensWithdrawn = true;
        token.transfer(sale.investor, sale.amount);
    }

    function initiateBusdVesting(uint16 vestingDuration)
        external
        onlyAdmin()
        icoEnded()
    {
        uint256 amount = busd.balanceOf(address(this));
        addBusdGrant(authorAddress, block.timestamp, amount, vestingDuration);
    }

    function addBusdGrant(
        address _recipient,
        uint256 _startTime,
        uint256 _amount,
        uint16 _vestingDuration
    ) public onlyAdmin() noGrantExistsForUser(_recipient) {
        uint256 amountVestedPerInterval = _amount / _vestingDuration;
        require(
            amountVestedPerInterval > 0,
            "token-zero-amount-vested-per-interval"
        );
        console.log("amount: ", _amount, vestingInterval);
        // Transfer the grant tokens under the control of the vesting contract
        // token.transferFrom(admin, address(this), _amount);

        Grant memory grant =
            Grant({
                startTime: _startTime == 0 ? block.timestamp : _startTime,
                amount: _amount,
                vestingDuration: _vestingDuration,
                intervalsClaimed: 0,
                totalClaimed: 0
            });
        console.log("created grant", grant.amount, vestingInterval);
        busdGrants[_recipient] = grant;
        Grant storage busdGrant = busdGrants[_recipient];

        console.log("retrieved grant", busdGrant.amount);

        emit GrantAdded(_recipient, grant.startTime, _amount, _vestingDuration);
    }

    function removeBusdGrant(address _recipient) external onlyAdmin() {
        Grant storage busdGrant = busdGrants[_recipient];
        uint16 intervalsVested;
        uint256 amountVested;
        (intervalsVested, amountVested) = calculateGrantClaim(_recipient);
        uint256 amountNotVested =
            uint256(
                sub(sub(busdGrant.amount, busdGrant.totalClaimed), amountVested)
            );

        require(
            busd.transfer(_recipient, amountVested),
            "token-recipient-transfer-failed"
        );
        require(
            busd.transfer(admin, amountNotVested),
            "token-multisig-transfer-failed"
        );

        busdGrant.startTime = 0;
        busdGrant.amount = 0;
        busdGrant.vestingDuration = 0;
        busdGrant.intervalsClaimed = 0;
        busdGrant.totalClaimed = 0;

        emit GrantRemoved(_recipient, amountVested, amountNotVested);
    }

    function claimVestedBusd() public {
        uint16 intervalsVested;
        uint256 amountVested;
        (intervalsVested, amountVested) = calculateGrantClaim(msg.sender);
        require(amountVested > 0, "token-zero-amount-vested");

        Grant storage busdGrant = busdGrants[msg.sender];
        busdGrant.intervalsClaimed = uint16(
            add(busdGrant.intervalsClaimed, intervalsVested)
        );
        busdGrant.totalClaimed = uint256(
            add(busdGrant.totalClaimed, amountVested)
        );

        console.log(amountVested);
        busd.transfer(msg.sender, amountVested);
        emit GrantTokensClaimed(msg.sender, amountVested);
    }

    /// @notice Calculate the vested and unclaimed days and tokens available for `_recepient` to claim
    /// Due to rounding errors once grant duration is reached, returns the entire left grant amount
    function calculateGrantClaim(address _recipient)
        public
        view
        returns (uint16, uint256)
    {
        Grant storage busdGrant = busdGrants[_recipient];
        // For grants created with a future start date, that hasn't been reached, return 0, 0
        if (block.timestamp < busdGrant.startTime) {
            return (0, 0);
        }

        uint256 elapsedTime = sub(block.timestamp, busdGrant.startTime);
        uint256 elapsedIntervals = elapsedTime / vestingInterval;
        console.log(elapsedIntervals, block.timestamp, busdGrant.startTime);
        // If over vesting duration, all tokens vested
        if (elapsedIntervals >= busdGrant.vestingDuration) {
            uint256 remainingGrant = busdGrant.amount - busdGrant.totalClaimed;
            return (busdGrant.vestingDuration, remainingGrant);
        } else {
            // subtract elapsed from claimed to have current vested
            uint16 intervalsVested =
                uint16(sub(elapsedIntervals, busdGrant.intervalsClaimed));
            // Amount vested per interval
            uint256 amountVestedPerInterval =
                busdGrant.amount / busdGrant.vestingDuration;
            // Multiply amount per interval by current available intervals
            uint256 amountVested =
                uint256(mul(intervalsVested, amountVestedPerInterval));
            return (intervalsVested, amountVested);
        }
    }

    function redeemNft() external icoEnded() nftIsReady() returns (uint256) {
        Sale storage sale = sales[msg.sender];
        sale.amount - price;

        require(sale.amount >= 0, "only investors");

        nft = NFT(nftAddress);
        return nft.mintNFT(msg.sender);
    }

    function setNftAddress(address deployedNft)
        external
        // nftIsNotReady()
        onlyAdmin()
    {
        nftAddress = deployedNft;
    }

    modifier noGrantExistsForUser(address _user) {
        require(busdGrants[_user].startTime == 0, "token-user-grant-exists");
        _;
    }

    modifier nftIsNotReady() {
        require(nftAddress == address(0), "NFT Must NOT be ready");
        _;
    }

    modifier nftIsReady() {
        require(nftAddress != address(0), "NFT Must be ready");
        _;
    }

    modifier icoActive() {
        require(
            end > 0 && block.timestamp < end && availableTokens > 0,
            "ICO must be active"
        );
        _;
    }

    modifier icoNotActive() {
        require(end == 0, "ICO should not be active");
        _;
    }

    modifier icoEnded() {
        require(
            end > 0 && (block.timestamp >= end || availableTokens == 0),
            "ICO must have ended"
        );
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    modifier onlyAuthor() {
        require(msg.sender == authorAddress, "only author");
        _;
    }
}
