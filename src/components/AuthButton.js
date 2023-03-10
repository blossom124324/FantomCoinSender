import React, { useState, useEffect} from 'react';
import { Button, Menu, MenuButton, 
    MenuList, MenuItem, Box,
} from '@chakra-ui/react';
import udLogo from 'assets/udLogo.png'
import UAuth from '@uauth/js';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { useAuth } from "contexts/AuthContext";

export default function AuthButton(props) {

    const {size} = props;
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const {user, setUser, setCurrentAccount } = useAuth()

    const uauth = new UAuth({
        clientID: '1225f41f-f384-42ee-8613-4b1bba7051f9',
        redirectUri: 'https://fantom-coin-sender.netlify.app/',
        scope: 'openid wallet',
    })
   
    useEffect(() => {
      setLoading(true)
      uauth
        .user()
        .then(setUser)
        .catch(() => {})
        .finally(() => setLoading(false))
    }, [setUser]) // eslint-disable-line

    const handleLogin = () => {
        if(user) return;
        setLoading(true)
        uauth
        .loginWithPopup()
        .then(() => {
            uauth.user().then(setUser)
        })
        .catch((err)=> {
            setError(err)
            console.log(error)
        })
        .finally(async() => {
            try {
                const { ethereum } = window;

                if (!ethereum) {
                    alert("Get MetaMask!");
                    return;
                }
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                setCurrentAccount(accounts[0])
                const chainId = await ethereum.request({ method: 'eth_chainId' });
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        })
    }
  
    const handleLogout = () => {
        setLoading(true)
        uauth
        .logout()
        .then(() => setUser(undefined))
        .catch((err)=> {
            setError(err)
            console.log(error)
        })
        .finally(() => setLoading(false))
    }

    return (
        <>
            { 
            user ?
            <Box>
                <Menu>
                    <MenuButton
                    as={Button}
                    color={'white'} 
                    backgroundColor={'#4b47ee'}
                    _hover={{
                        bg: '#0b24b3'
                    }}
                    _active={{
                        bg: '#5361c7'
                    }}
                    size={size}
                    isLoading={loading}>
                    {user.sub}
                    <ArrowDownIcon/>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => {handleLogout()}}>
                            Log Out
                        </MenuItem>
                    </MenuList>
                </Menu>
                
            </Box>
            
            :
            <Button as={Button} color={'white'} leftIcon={<img style={{height: "20px"}} src={udLogo} alt='UD Logo'/>}
            backgroundColor={'#4b47ee'}
            _hover={{
                bg: '#0b24b3'
            }}
            _active={{
                bg: '#5361c7'
            }}
            onClick={()=>{handleLogin()}} size={size}
            isLoading={loading}>
                Login with Unstoppable
            </Button>
            }
        </>
  
    );
}
