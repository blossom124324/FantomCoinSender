import React, { useEffect, useCallback } from 'react'
import {
    FormControl, FormLabel, FormHelperText, InputGroup,
    Input, InputRightAddon
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useAuth } from 'contexts/AuthContext'

export default function Amounts() {

  const { currentAccount, setAmount, balance, 
    setBalance, tabIndex, currentNetwork
   } = useAuth();
  const getBalance = useCallback(async() => {
    if(!currentAccount) return;
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setBalance(ethers.utils.formatEther(await signer.getBalance("latest")));
    } catch(err) {
      console.log(err)
    }
  }, [currentAccount, setBalance])

  const handleChange = (e) => {
    setAmount(e.target.value);
  }

  useEffect(() => {
    let isConnected = false;
    if(!isConnected) {
      getBalance()
    }
    return () => {
      isConnected = true;
    }
  }, [getBalance])
  return (
    <>
    <FormControl mt="4">
        <FormLabel htmlFor='amount'>Amount per Address</FormLabel>
        <InputGroup>
          <Input id='amount' _placeholder={{color: "gray.500"}} onChange={handleChange}
          type='number' color="black" w={{base:'100%', md:"60%"}} backgroundColor="#E5E5E5" placeholder='10' isRequired/>
          {tabIndex === 0 ?
          <InputRightAddon children={
            currentNetwork === 56 || currentNetwork === 97 ? "BNB"
                :
                currentNetwork === 80001 || currentNetwork === 137 ? "MATIC"
                    :
                    currentNetwork === 250 || currentNetwork === 4002 ? "FTM"
                        :
                        currentNetwork === 1
                            ? "ETH" : "?"} />
          :
          <></>
          }
          
        </InputGroup>
        {tabIndex===0 ?
          <FormHelperText>Wallet Balance: {balance ? balance : "0"} {
            currentNetwork === 56 || currentNetwork === 97 ? "BNB"
            :
            currentNetwork === 80001 || currentNetwork === 137 ? "MATIC"
            :
            currentNetwork === 250 || currentNetwork === 4002 ? "FTM"
            :
            currentNetwork === 1
            ? "ETH" : "?"}</FormHelperText>
          : 
          <></>
        }
    </FormControl>
    </>
  )
}
