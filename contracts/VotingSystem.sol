// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string name;
        bool active;
        mapping(uint256 => Candidate) candidates;
        uint256 candidateCount;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;
    
    mapping(address => bool) public authorizedVoters;
    address public owner;

    event ElectionCreated(uint256 electionId, string name);
    event CandidateAdded(uint256 electionId, uint256 candidateId, string name);
    event VoterAuthorized(address voter);
    event Voted(uint256 electionId, address voter, uint256 candidateId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedVoters[msg.sender], "You are not authorized to vote");
        _;
    }

    function createElection(string memory _name) public onlyOwner {
        electionCount++;
        Election storage newElection = elections[electionCount];
        newElection.id = electionCount;
        newElection.name = _name;
        newElection.active = true;
        emit ElectionCreated(electionCount, _name);
    }

    function addCandidate(uint256 _electionId, string memory _name) public onlyOwner {
        Election storage election = elections[_electionId];
        require(election.active, "Election is not active");
        election.candidateCount++;
        election.candidates[election.candidateCount] = Candidate(election.candidateCount, _name, 0);
        emit CandidateAdded(_electionId, election.candidateCount, _name);
    }

    function authorizeVoter(address _voter) public onlyOwner {
        authorizedVoters[_voter] = true;
        emit VoterAuthorized(_voter);
    }

    function vote(uint256 _electionId, uint256 _candidateId) public onlyAuthorized {
        Election storage election = elections[_electionId];
        require(election.active, "Election is not active");
        require(!election.hasVoted[msg.sender], "You have already voted in this election");
        require(_candidateId > 0 && _candidateId <= election.candidateCount, "Invalid candidate");

        election.hasVoted[msg.sender] = true;
        election.candidates[_candidateId].voteCount++;
        emit Voted(_electionId, msg.sender, _candidateId);
    }

    function getElectionDetails(uint256 _electionId) public view returns (string memory name, bool active, uint256 candidateCount) {
        Election storage election = elections[_electionId];
        return (election.name, election.active, election.candidateCount);
    }

    function getCandidate(uint256 _electionId, uint256 _candidateId) public view returns (string memory name, uint256 voteCount) {
        Election storage election = elections[_electionId];
        Candidate storage candidate = election.candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function endElection(uint256 _electionId) public onlyOwner {
        elections[_electionId].active = false;
    }
}