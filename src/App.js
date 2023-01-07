import React, { useEffect } from "react";
import Home from "views/Home";

import { useAuth } from "contexts/AuthContext";

function App() {

  const { setCurrentAccount, setCurrentNetwork, 
    currentNetwork
  } = useAuth()

  useEffect(() => {

    const initialCheck = async() => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(parseInt(chainId, 16))
        window.ethereum.on('accountsChanged', function (accounts) {
          setCurrentAccount(accounts[0]);
          window.location.reload()
        })
        
        window.ethereum.on('chainChanged', function (chainId) {
          setCurrentNetwork(parseInt(chainId, 16))
          window.location.reload()
        })
      } catch(err) {
        console.log(err)
      }
    }
    initialCheck();

  }, [setCurrentAccount, setCurrentNetwork, currentNetwork]);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
