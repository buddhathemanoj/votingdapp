// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/// @custom:dev-run-script scripts/deploy.js
contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }

    address public owner;
    string public electionName;
    bool public electionEnded;

    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    uint public totalVotes;
    uint public winningCandidateId;

    event CandidateAdded(uint candidateId, string name);
    event VoterAuthorized(address voter);
    event Voted(address voter, uint candidateId);
    event ElectionEnded(uint totalVotes, uint winningCandidateId);

    modifier ownerOnly() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier electionOngoing() {
        require(!electionEnded, "Election has ended");
        _;
    }

    constructor(string memory _electionName) {
        owner = msg.sender;
        electionName = _electionName;
        electionEnded = false;
    }

    function addCandidate(string memory _name) public ownerOnly electionOngoing {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function authorizeVoter(address _person) public ownerOnly electionOngoing {
        require(!voters[_person].authorized, "Voter is already authorized");
        voters[_person].authorized = true;
        emit VoterAuthorized(_person);
    }

    function vote(uint _candidateId) public electionOngoing {
        require(voters[msg.sender].authorized, "You are not authorized to vote");
        require(!voters[msg.sender].voted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        voters[msg.sender].voted = true;
        voters[msg.sender].vote = _candidateId;

        candidates[_candidateId].voteCount++;
        totalVotes++;

        if (candidates[_candidateId].voteCount > candidates[winningCandidateId].voteCount) {
            winningCandidateId = _candidateId;
        }

        emit Voted(msg.sender, _candidateId);
    }

    function getVotes(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        return candidates[_candidateId].voteCount;
    }

    function endElection() public ownerOnly electionOngoing {
        electionEnded = true;
        emit ElectionEnded(totalVotes, winningCandidateId);
    }

    function getWinner() public view returns (uint winnerId, string memory winnerName, uint winnerVoteCount) {
        require(electionEnded, "Election has not ended yet");
        return (
            winningCandidateId,
            candidates[winningCandidateId].name,
            candidates[winningCandidateId].voteCount
        );
    }
}