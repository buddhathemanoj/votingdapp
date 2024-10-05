import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const VotingContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const VotingContractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_electionName",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "CandidateAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalVotes",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "winningCandidateId",
        "type": "uint256"
      }
    ],
    "name": "ElectionEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "VoterAuthorized",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_person",
        "type": "address"
      }
    ],
    "name": "authorizeVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionEnded",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinner",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "winnerId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "winnerName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "winnerVoteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "authorized",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "voted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "vote",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "winningCandidateId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
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
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Not connected');

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnectionStatus('Connecting...');
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setWeb3(provider);
        setAccount(address);
        setConnectionStatus('Connected');

        const votingContract = new ethers.Contract(
          VotingContractAddress,
          VotingContractABI,
          signer
        );

        setContract(votingContract);
        await fetchCandidates();
        setError('');
      } catch (err) {
        console.error('Failed to connect to MetaMask:', err);
        setError(`Failed to connect to MetaMask: ${err.message}`);
        setConnectionStatus('Connection failed');
      }
    } else {
      setError('MetaMask not detected. Please install MetaMask and refresh the page.');
      setConnectionStatus('MetaMask not detected');
    }
  };

  async function fetchCandidates() {
    if (contract) {
      try {
        const candidateCount = await contract.candidatesCount();
        const fetchedCandidates = [];
        for (let i = 1; i <= Number(candidateCount); i++) {
          const candidate = await contract.candidates(i);
          fetchedCandidates.push({
            id: Number(candidate.id),
            name: candidate.name,
            voteCount: Number(candidate.voteCount)
          });
        }
        setCandidates(fetchedCandidates);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to fetch candidates. Please check your connection and try again.');
      }
    }
  }

  useEffect(() => {
    if (contract) {
      fetchCandidates();
    }
  }, [contract]);

  async function addCandidate() {
    if (contract && newCandidateName) {
      try {
        const tx = await contract.addCandidate(newCandidateName);
        await tx.wait();
        setNewCandidateName('');
        await fetchCandidates();
      } catch (error) {
        console.error('Error adding candidate:', error);
        setError(`Failed to add candidate: ${error.message}`);
      }
    }
  }

  async function vote(candidateId) {
    if (contract) {
      try {
        const tx = await contract.vote(candidateId);
        await tx.wait();
        await fetchCandidates();
      } catch (error) {
        console.error('Error voting:', error);
        setError(`Failed to vote: ${error.message}`);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-5 text-center text-gray-800">Voting DApp</h1>
          
          <div className="mb-5">
            <p className="text-lg font-semibold">Status: <span className="font-normal">{connectionStatus}</span></p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {!account ? (
              <button 
                onClick={connectToMetaMask} 
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Connect to MetaMask
              </button>
            ) : (
              <p className="mt-3">Connected Account: {account}</p>
            )}
          </div>

          {account && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3">Add Candidate</h2>
                <input
                  type="text"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  placeholder="Enter candidate name"
                  className="px-3 py-2 border rounded mr-2"
                />
                <button 
                  onClick={addCandidate}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                  Add Candidate
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Candidates</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="py-2 px-4 text-left">ID</th>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Votes</th>
                        <th className="py-2 px-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {candidates.map((candidate) => (
                        <tr key={candidate.id} className="border-b">
                          <td className="py-2 px-4">{candidate.id}</td>
                          <td className="py-2 px-4">{candidate.name}</td>
                          <td className="py-2 px-4">{candidate.voteCount}</td>
                          <td className="py-2 px-4">
                            <button 
                              onClick={() => vote(candidate.id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                            >
                              Vote
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}