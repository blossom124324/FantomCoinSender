import { ethers } from "ethers";
import web3modal from "utils/web3modal"

export const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
        alert("Make sure you have metamask!");
        return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        return account;
    } else {
        console.log("No authorized account found")
    }
  }

export const connectWallet = async () => {
    try {
        const instance = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        return signer.getAddress();
    } catch(err) {
    }
    
}

