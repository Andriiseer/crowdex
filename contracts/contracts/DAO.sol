pragma solidity 0.8.0;
import "./Token.sol";

contract DAO {
    enum Side {Yes, No}
    enum Status {Undecided, Approved, Rejected}

    struct Proposal {
        address author;
        bytes32 hash;
        uint256 createdAt;
        uint256 votesYes;
        uint256 votesNo;
        Status status;
    }

    mapping(bytes32 => Proposal) public proposals;
    mapping(address => mapping(bytes32 => bool)) public votes;
    mapping(address => uint256) public shares;
    uint256 public totalShares;
    Token public token;
    uint256 constant VOTING_PERIOD = 7 days;

    constructor(address _token) {
        token = Token(_token);
    }

    function deposit(uint256 amount) external {
        shares[msg.sender] += amount;
        totalShares += amount;
        token.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external {
        require(shares[msg.sender] >= amount, "not enough shares");
        shares[msg.sender] -= amount;
        totalShares -= amount;
        token.transfer(msg.sender, amount);
    }

    function createProposal(bytes32 proposalHash) external {
        // require(
        //   shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE,
        //   'not enough shares to create proposal'
        // );
        require(
            proposals[proposalHash].hash == bytes32(0),
            "this proposal already exist"
        );
        proposals[proposalHash] = Proposal(
            msg.sender,
            proposalHash,
            block.timestamp,
            0,
            0,
            Status.Undecided
        );
    }

    function vote(bytes32 proposalHash, Side side) external {
        Proposal storage proposal = proposals[proposalHash];
        require(votes[msg.sender][proposalHash] == false, "already voted");
        require(
            proposals[proposalHash].hash != bytes32(0),
            "proposal already exist"
        );
        require(
            block.timestamp <= proposal.createdAt + VOTING_PERIOD,
            "voting period over"
        );
        votes[msg.sender][proposalHash] = true;
        if (side == Side.Yes) {
            proposal.votesYes += shares[msg.sender];
            if ((proposal.votesYes * 100) / totalShares > 50) {
                proposal.status = Status.Approved;
            }
        } else {
            proposal.votesNo += shares[msg.sender];
            if ((proposal.votesNo * 100) / totalShares > 50) {
                proposal.status = Status.Rejected;
            }
        }
    }
}
