import React, { useEffect } from 'react'
import { Button, Image, useColorModeValue, useToast} from '@chakra-ui/react';
import { checkIfWalletIsConnected, connectWallet } from 'services/walletConnections';
import { useAuth } from 'contexts/AuthContext';
import BNBLogo from "assets/bnb-logo.svg"
import ETHLogo from "assets/eth-logo.svg"
import FANTOMLogo from "assets/fantom-logo.png"
import MATICLogo from "assets/matic-logo.svg"

export default function LoginButton() {

  const bg = useColorModeValue("#E5E5E5", "gray.800");
  const toast = useToast();
  const id = 'toast'
  const { currentAccount, setCurrentAccount, currentNetwork } = useAuth();
  const handleLogin = async() => {
      if(!window.ethereum) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'No wallet found',
            description: "Please install Metamask",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        return;
      }
      const _address = await connectWallet();
      setCurrentAccount(_address)
  }
  useEffect(() => {
    const getAccount = async() => {
        if(!window.ethereum) {
            if (!toast.isActive(id)) {
                toast({
                id,
                title: 'No wallet found',
                description: "Please install Metamask",
                status: 'error',
                duration: 4000,
                isClosable: true,
                })
            }
            } else {
            setCurrentAccount(await checkIfWalletIsConnected());
        }
    }
    getAccount()
    }, [setCurrentAccount, toast]);

  return (
          <>
          { currentAccount ?
          <Button bg={bg} size="lg">
            <Image src={
              currentNetwork === 56 || currentNetwork === 97 ? BNBLogo
              :
              currentNetwork === 80001 || currentNetwork ===137 ? MATICLogo
              :
              currentNetwork === 250 || currentNetwork === 4002 ? FANTOMLogo
              :
              currentNetwork === 1
              ? ETHLogo : ""} h="15px" mr="2"/>
            {currentAccount.substring(0, 5)+"...."+currentAccount.substring(currentAccount.length-6)}
          </Button>
          /*
          <Box>
          <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {currentAccount.substring(0, 5)+"...."+currentAccount.substring(currentAccount.length-6)}
          </MenuButton>
          <MenuList >
            <MenuItem>Sample</MenuItem>
          </MenuList>
          </Menu>
          </Box>
          */
            : 
            <Button 
              bg="brand.100" color="white" 
              size="md" onClick={handleLogin}
              _hover={{
                backgroundColor: "brand.200"
              }}
            >
              Connect Wallet
            </Button>
          }
          </>

  )
}
