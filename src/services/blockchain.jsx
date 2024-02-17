import address from "../Context/constant.json";
import abi from "../Context/crowdfunding.json";
import { getGlobalState, setGlobalState, useGlobalState } from "../store";
// import hre from 'hardhat' ;
import { ethers } from "ethers";

const { ethereum } = window;
const contractAddress = address.address;
const contractAbi = abi.abi;
let tx;

const connectWallet = async () => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
  } catch (error) {
    reportError(error);
  }
};

const isWalletConnected = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const accounts = await ethereum.request({ method: "eth_accounts" });
    setGlobalState("connectedAccount", accounts[0]?.toLowerCase());

    // Account Changed
    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async () => {
      setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
      await isWalletConnected();
    });

    if (accounts.length) {
      setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
    } else {
      alert("Please connect wallet.");
      console.log("No accounts found.");
    }
  } catch (error) {
    reportError(error);
  }
};

const fetchContract = async () => {
  const connectedAccount = getGlobalState("connectedAccount");

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    return contract;
  } else {
    getGlobalState("contract");
  }
};

const createProject = async ({
  title,
  description,
  imageUrl,
  target,
  expireAt,
}) => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }
    const contract = await fetchContract();
    target = ethers.utils.parseEther(target);
    let temp = await contract.createProject(
      title,
      description,
      imageUrl,
      target,
      expireAt
    );
    await temp.wait();

    await loadProjects();
  } catch (error) {
    reportError(error);
  }
};

const updateProject = async ({
  id,
  title,
  description,
  imageUrl,
  expiresAt,
}) => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }

    const contract = await fetchContract();
    let temp = await contract.updateProject(
      id,
      title,
      description,
      imageUrl,
      expiresAt
    );
    await temp.wait();
    await loadProject(id);
  } catch (error) {
    reportError(error);
  }
};
const deleteProject = async (id) => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }

    const contract = await fetchContract();
    let temp = await contract.deleteProject(id);
  } catch (error) {
    reportError(error);
  }
};

// not for display purpose .. just to load projects
const loadProjects = async () => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }
    const contract = await fetchContract();
    const projects = await contract.getProjects();
    // await projects.wait() ;

    setGlobalState("projects", structuredProjects(projects));
    const stats = await contract.stats();
    setGlobalState("stats", structuredstats(stats));
  } catch (error) {
    reportError(error);
  }
};

// not for display purpose .. just to load projects
const loadProject = async (id) => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }

    const contract = await fetchContract();
    const project = await contract.getProject(id);
    setGlobalState("project", structuredProjects([project])[0]);
  } catch (error) {
    alert(JSON.stringify(error.message));
    reportError(error);
  }
};

const backProject = async (id, amount) => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }

    const contract = await fetchContract();
    const connectedAccount = getGlobalState("connectedAccount");

    amount = ethers.utils.parseEther(amount);

    tx = await contract.backProject(id, {
      from: connectedAccount,
      value: amount._hex,
    });
    
    await tx.wait();
    await getBackers(id);
  
  } catch (error) {
    reportError(error);
  }
};
const getBackers = async (id) => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }

    const contract = await fetchContract();
    const backers = await contract.getBackers(id);
    

    setGlobalState("backers", structuredBackers(backers));
    console.log("backers : ", backers);
  } catch (error) {
    reportError(error);
  }
};
const payout_project = async (id) => {
  try {
    if (!ethereum) {
      return alert("Please Install Metamask");
    }
    const contract = await fetchContract();

    const connectedAccount = getGlobalState("connectedAccount");

    tx = await contract.projectPayout(id, { from: connectedAccount });
    await tx.wait();
    await getBackers(id);
  } catch (error) {
    reportError(error);
  }
};
// i have made some changes
// comeback here
const structuredProjects = (projects) =>
  projects
    .map((project) => ({
      id: project.id.toNumber(),
      owner: project.owner.toLowerCase(),
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      target: parseInt(project.target._hex) / 10 ** 18,
      raised: parseInt(project.raised._hex) / 10 ** 18,
      timestamp: new Date(project.timestamp.toNumber()).getTime(),
      expiresAt: new Date(project.expiresAt.toNumber()).getTime(),
      date: toDate(project.expiresAt.toNumber() * 1000),
      backers: project.backers.toNumber(),
      status: project.status,
    }))
    .reverse();

const toDate = (timestamp) => {
  const date = new Date(timestamp);
  const dd = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const mm =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const structuredstats = (stats) => ({
  totalProjects: stats.totalProjects ? stats.totalProjects.toNumber() : 0,
  totalBackings: stats.totalBackings ? stats.totalBackings.toNumber() : 0,
  totalDonations: parseInt(stats.totalDonations._hex) / 10 ** 18,
});

// contri -- wei to ethers
// in javascript timestamp --> millisec and in blockchain --> sec
const structuredBackers = (backers) =>
  backers
    .map((backer) => ({
      owner: backer.owner.toLowerCase(),
      contribution: parseInt(backer.contribution._hex) / 10 ** 18,
      refunded: backer.refunded,
      timestamp: new Date(backer.timestamp.toNumber() * 1000).toJSON(),
    }))
    .reverse();

const reportError = (error) => {
  console.log(error.message);
  throw new Error("No ethereum object.");
};

export {
  connectWallet,
  isWalletConnected,
  createProject,
  updateProject,
  deleteProject,
  loadProjects,
  loadProject,
  backProject,
  getBackers,
  payout_project,
};
