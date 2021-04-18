pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Token.sol";

contract ICO {
    using SafeMath for uint256;
    struct Sale {
        address investor;
        uint256 amount;
        bool tokensWithdrawn;
    }
    mapping(address => Sale) public sales;
    address public admin;
    uint256 public end;
    uint256 public duration;
    uint256 public price;
    uint256 public availableTokens;
    uint256 public minPurchase;
    uint256 public maxPurchase;
    Token public token;
    IERC20 public dai;

    constructor(
        address tokenAddress,
        uint256 _duration,
        uint256 _price,
        uint256 _availableTokens,
        uint256 _minPurchase,
        uint256 _maxPurchase,
        address daiAddress
    ) {
        token = Token(tokenAddress);
        dai = IERC20(daiAddress);

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

    function buy(uint256 daiAmount) external icoActive() {
        require(
            daiAmount >= minPurchase && daiAmount <= maxPurchase,
            "have to buy between minPurchase and maxPurchase"
        );
        uint256 tokenAmount = daiAmount.div(price);
        require(
            tokenAmount <= availableTokens,
            "Not enough tokens left for sale"
        );
        dai.transferFrom(msg.sender, address(this), daiAmount);
        token.mint(address(this), tokenAmount);
        sales[msg.sender] = Sale(msg.sender, tokenAmount, false);
    }

    function withdrawTokens() external icoEnded() {
        Sale storage sale = sales[msg.sender];
        require(sale.amount > 0, "only investors");
        require(sale.tokensWithdrawn == false, "tokens were already withdrawn");
        sale.tokensWithdrawn = true;
        token.transfer(sale.investor, sale.amount);
    }

    function withdrawDai(uint256 amount) external onlyAdmin() icoEnded() {
        dai.transfer(admin, amount);
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
}

// pragma solidity ^0.7.0;

// import "./ERC20PresetMinterPauser.sol";

// contract TokenSale {
//     IERC20Token public tokenContract; // the token being sold
//     uint256 public price; // the price, in wei, per token
//     address owner;

//     uint256 public tokensSold;

//     event Sold(address buyer, uint256 amount);

//     function TokenSale(IERC20Token _tokenContract, uint256 _price) public {
//         owner = msg.sender;
//         tokenContract = _tokenContract;
//         price = _price;
//     }

//     // Guards against integer overflows
//     function safeMultiply(uint256 a, uint256 b)
//         internal
//         pure
//         returns (uint256)
//     {
//         if (a == 0) {
//             return 0;
//         } else {
//             uint256 c = a * b;
//             assert(c / a == b);
//             return c;
//         }
//     }

//     function buyTokens(uint256 numberOfTokens) public payable {
//         require(msg.value == safeMultiply(numberOfTokens, price));

//         uint256 scaledAmount =
//             safeMultiply(numberOfTokens, uint256(10)**tokenContract.decimals());

//         require(tokenContract.balanceOf(this) >= scaledAmount);

//         emit Sold(msg.sender, numberOfTokens);
//         tokensSold += numberOfTokens;

//         require(tokenContract.transfer(msg.sender, scaledAmount));

//         governanceToken.mint(beneficiary, distributionAmount);
//     }

//     function endSale() public {
//         require(msg.sender == owner);

//         // Send unsold tokens to the owner.
//         require(tokenContract.transfer(owner, tokenContract.balanceOf(this)));

//         msg.sender.transfer(address(this).balance);
//     }
// }
