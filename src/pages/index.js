import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const VotingContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const VotingContractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "CandidateAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "ElectionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "VoterAuthorized",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "authorizeVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "authorizedVoters",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "createElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "electionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "elections",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "candidateCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "endElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "getCandidate",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getElectionDetails",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "candidateCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [newElectionName, setNewElectionName] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [selectedElection, setSelectedElection] = useState(null);
  const [voterToAuthorize, setVoterToAuthorize] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    connectWallet();
  }, []);
  console.log("elections", elections);
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setWeb3(provider);
        setAccount(address);

        const votingContract = new ethers.Contract(
          VotingContractAddress,
          VotingContractABI,
          signer
        );

        setContract(votingContract);
        await fetchElections();
      } catch (err) {
        console.error("Failed to connect to wallet:", err);
        setError(`Failed to connect to wallet: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };


  const switchAccount = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        await connectWallet();
      } catch (err) {
        console.error("Failed to switch account:", err);
        setError(`Failed to switch account: ${err.message}`);
      }
    }
  };

  const fetchElections = async () => {
    if (contract) {
      try {
        const electionCount = await contract.electionCount();
        const fetchedElections = [];
        for (let i = 1; i <= Number(electionCount); i++) {
          const election = await contract.getElectionDetails(i);
          fetchedElections.push({
            id: i,
            name: election.name,
            active: election.active,
            candidateCount: Number(election.candidateCount),
          });
          await fetchCandidates(i);
        }
        setElections(fetchedElections);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to fetch elections.");
      } 
    }
  };

  const fetchCandidates = async (electionId) => {
    if (contract) {
      try {
        const election = elections.find((e) => e.id === electionId) || {
          candidateCount: await contract
            .elections(electionId)
            .then((e) => Number(e.candidateCount)),
        };
        const fetchedCandidates = [];
        for (let i = 1; i <= election.candidateCount; i++) {
          const candidate = await contract.getCandidate(electionId, i);
          fetchedCandidates.push({
            id: i,
            name: candidate.name,
            voteCount: Number(candidate.voteCount),
          });
        }
        setCandidates((prev) => ({ ...prev, [electionId]: fetchedCandidates }));
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError("Failed to fetch candidates.");
      }
    }
  };

  const createElection = async () => {
    if (contract && newElectionName) {
      try {
        const tx = await contract.createElection(newElectionName);
        await tx.wait();
        setNewElectionName("");
        await fetchElections();
        setSuccess("Election created successfully!");
      } catch (error) {
        console.error("Error creating election:", error);
        setError(`Failed to create election: ${error.message}`);
      }
    }
  };

  const addCandidate = async () => {
    if (contract && selectedElection && newCandidateName) {
      try {
        const tx = await contract.addCandidate(
          selectedElection,
          newCandidateName
        );
        await tx.wait();
        setNewCandidateName("");
        await fetchCandidates(selectedElection);
        setSuccess("Candidate added successfully!");
      } catch (error) {
        console.error("Error adding candidate:", error);
        setError(`Failed to add candidate: ${error.message}`);
      }
    }
  };

  const authorizeVoter = async () => {
    if (contract && voterToAuthorize) {
      try {
        let voterAddress = voterToAuthorize;
        
        // Check if the input is a valid Ethereum address
        if (!ethers.isAddress(voterToAuthorize)) {
          setError("Please enter a valid Ethereum address.");
          return;
        }

        const tx = await contract.authorizeVoter(voterAddress);
        await tx.wait();
        setVoterToAuthorize('');
        setSuccess('Voter authorized successfully!');
      } catch (error) {
        console.error('Error authorizing voter:', error);
        setError(`Failed to authorize voter: ${error.message}`);
      }
    }
  };

  const vote = async (electionId, candidateId) => {
    if (contract) {
      try {
        const tx = await contract.vote(electionId, candidateId);
        await tx.wait();
        await fetchCandidates(electionId);
        setSuccess("Vote cast successfully!");
      } catch (error) {
        console.error("Error voting:", error);
        setError(`Failed to vote: ${error.message}`);
      }
    }
  };
useEffect(() => {
  if (contract) {
    fetchElections();
  }
}, [contract]);
  return (
    <>
    {
      isLoading ? (<>Loading...</>) : (<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 px-10">
          <div className="">
            <h1 className="text-4xl font-bold mb-5 text-center text-gray-800">
              Voting DApp
            </h1>
  
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
  
            {!account ? (
              <Button onClick={connectWallet} className="w-full mb-4">
                Connect Wallet
              </Button>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600 ">
                    Connected: {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                  <Button onClick={switchAccount}>Switch Account</Button>
                </div>
  
                <div className="flex space-x-4 mb-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Create Election</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Create New Election</DialogTitle>
                      </DialogHeader>
                      <Input
                        type="text"
                        value={newElectionName}
                        onChange={(e) => setNewElectionName(e.target.value)}
                        placeholder="Enter election name"
                        className="mb-2"
                      />
                      <Button onClick={createElection} className="w-full">
                        Create Election
                      </Button>
                    </DialogContent>
                  </Dialog>
  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Authorize Voter</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Authorize New Voter</DialogTitle>
                      </DialogHeader>
                      <Input
                        type="text"
                        value={voterToAuthorize}
                        onChange={(e) => setVoterToAuthorize(e.target.value)}
                        placeholder="Enter voter address"
                        className="mb-2"
                      />
                      <Button onClick={authorizeVoter} className="w-full">
                        Authorize Voter
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
  
                <h2 className="text-2xl font-bold mb-4 text-gray-700">
                  Current Elections
                </h2>
                {elections.length === 0 ? (
                  <p>No elections found.</p>
                ) : (
                  elections.map((election) => (
                    <Card key={election.id} className="mb-6">
                      <CardHeader>
                        <h3 className="text-xl font-bold text-gray-700">
                          {election.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {election.active ? "Active" : "Ended"}
                        </p>
                      </CardHeader>
                      <CardContent>
                        {candidates[election.id] ? (
                          <ul className="space-y-2">
                            {candidates[election.id].map((candidate) => (
                              <li
                                key={candidate.id}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded"
                              >
                                <span className="font-semibold">
                                  {candidate.name}
                                </span>
                                <div>
                                  <span className="mr-2">
                                    Votes: {candidate.voteCount}
                                  </span>
                                  {election.active && (
                                    <Button
                                      onClick={() =>
                                        vote(election.id, candidate.id)
                                      }
                                      size="sm"
                                    >
                                      Vote
                                    </Button>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No candidates yet.</p>
                        )}
                      </CardContent>
                      {election.active && (
                        <CardFooter>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full">Add Candidate</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle>Add New Candidate</DialogTitle>
                              </DialogHeader>
                              <Input
                                type="text"
                                value={newCandidateName}
                                onChange={(e) =>
                                  setNewCandidateName(e.target.value)
                                }
                                placeholder="Enter candidate name"
                                className="mb-2"
                              />
                              <Button
                                onClick={() => {
                                  setSelectedElection(election.id);
                                  addCandidate();
                                }}
                                className="w-full"
                              >
                                Add Candidate
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      )}
                    </Card>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>)
    }
    </>
  );
}
