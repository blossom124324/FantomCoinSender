import React, {useEffect, useState} from 'react'
import AddressesList from './Confirm/AddressesList';
import {
    Box,
    Button,
    Center,
    Heading,
    SimpleGrid,
    Table,
    TableCaption,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useToast,
    VStack
} from '@chakra-ui/react'
import {useNavigate} from "react-router-dom";
import {ArrowBackIcon} from '@chakra-ui/icons';
import {useAuth} from 'contexts/AuthContext';
import {ethers} from 'ethers';

import multisend_abi from "abi/contract_abi.json"

export default function Confirm() {

    const bg = useColorModeValue("#E5E5E5", "gray.800");
    let navigate = useNavigate();
    const toast = useToast()
    const toastID = 'toast'

    const [isLoading, setIsLoading] = useState()
    const [isSent, setIsSent] = useState(false)

    const {
        currentAccount, addresses, tokenAddress, amount, isPro, setIsPro,
        setAmount, setAddresses, contractAddr, currentNetwork,
        setContractAddr, setTabIndex, tabIndex
    } = useAuth()

    useEffect(() => {
        if (currentNetwork === 250) {
            setContractAddr("0x20D60C6017F6997Cd58930cdE2671aDB02E9Ed7d")
        } else setContractAddr()
    }, [currentNetwork, tokenAddress, tabIndex])

    const handleBackClick = () => {
        setIsPro(false)
        setAddresses()
        setAmount()
        setTabIndex(0)
        navigate("/", {replace: false})
    }

    const sendTx = async () => {
        if (!currentAccount) {
            toast({
                toastID,
                title: 'No Account Found!',
                description: "Please connect with your wallet.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        if (currentNetwork !== 250) {
            toast({
                toastID,
                title: 'Incorrect Network detected!',
                description: "Please switch to supported networks.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        if (!amount) {
            toast({
                toastID,
                title: 'No amount detected',
                description: "Please input correct values",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        setIsLoading(true)
        try {
            const {ethereum} = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const multisendContract = new ethers.Contract(contractAddr, multisend_abi, signer);
            if (isPro) {
                const options = {value: ethers.utils.parseEther((amount).toString())}
                let _amountArr = []
                let _addressArr = []
                for (let i = 0; i < addresses.length; i++) {
                    _amountArr.push(ethers.utils.parseEther(addresses[i][1]))
                    _addressArr.push(addresses[i][0])
                }
                await multisendContract.sendDifferentValue(_addressArr, _amountArr, options)
            } else {
                const options = {value: ethers.utils.parseEther((amount * addresses.length).toString())}

                await multisendContract.sendSameValue(addresses, ethers.utils.parseEther((amount).toString()), options);

            }
            setTimeout(() => {
                setIsSent(true)
            }, 5000);
            toast({
                toastID,
                title: 'Transaction Submitted',
                description: "Please check explorer.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 5000);
        }
    }

    return (
        <Center bg={bg} h="90vh">
            <Box rounded="xl" shadow="lg" bg={useColorModeValue("white", "gray.700")} p="4" w="80vw">
                <Button variant="ghost" m="1" leftIcon={<ArrowBackIcon/>} onClick={handleBackClick}>
                    Back
                </Button>
                <Table variant='simple' size="sm">
                    <TableCaption placement='top'>
                        <Heading as="h2" size="md" color={useColorModeValue("gray.600", "gray.400")}>DETAILS</Heading>
                    </TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th isNumeric>Amount</Th>
                        </Tr>
                    </Thead>
                    <AddressesList/>
                </Table>
                <Center mt="4">
                    <VStack spacing="4">
                        <Heading as="h2" size="md" my="2"
                                 color={useColorModeValue("gray.600", "gray.400")}>SUMMARY</Heading>
                        <SimpleGrid columns={[1, null, 2]} spacing={4}>
                            <Box rounded="xl" bg='brand.200' height='80px' p="4">
                                Total Number Of Addresses
                                <Center>{addresses ? addresses.length : ""}</Center>
                            </Box>
                            <Box rounded="xl" bg='brand.200' height='80px' p="4">
                                <Center>
                                    Total Amount to be Sent
                                </Center>
                                <Center>{isPro
                                    ? amount
                                    : addresses && (addresses.length * Math.round(amount * 10**10) / 10**10 )
                                }
                                </Center>
                            </Box>

                        </SimpleGrid>
                        <Button bg="brand.100" color="white"
                                size="md"
                                _hover={{
                                    backgroundColor: "brand.200"
                                }}
                                onClick={sendTx}
                                isLoading={isLoading}
                                isDisabled={isSent}
                        >
                            SEND
                        </Button>
                    </VStack>
                </Center>
            </Box>
        </Center>
    )
}
