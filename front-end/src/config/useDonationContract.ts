import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, DONATION_CONTRACT_ADDRESS, DONATION_CONTRACT_ABI } from '@/config/contract';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

export interface DonationData {
    amount: string;
    message: string;
    timestamp: number;
}

export interface DonorInfo {
    totalAmount: string;
    latestMessage: string;
    donationHistory: DonationData[];
}

export const useDonationContract = () => {
    const { isConnected, address } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');

    const [loading, setLoading] = useState(false);
    const [contractBalance, setContractBalance] = useState('0');
    const [totalDonors, setTotalDonors] = useState(0);
    const [userDonorInfo, setUserDonorInfo] = useState<DonorInfo | null>(null);

    // Get contract instance with provider or signer
    const getContractInstance = (needSigner = false) => {
        if (!walletProvider) return null;

        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const providerOrSigner = needSigner ? ethersProvider.getSigner() : ethersProvider;

        return getContract(providerOrSigner);
    };

    // Donate function
    const donate = async (amount: string, message: string) => {
        if (!isConnected || !address) {
            throw new Error('Wallet not connected');
        }

        setLoading(true);
        try {
            const contract = getContractInstance(true); // Need signer for transactions
            if (!contract) throw new Error('Contract not available');

            const amountInWei = ethers.utils.parseEther(amount);

            const tx = await contract.donate(message, {
                value: amountInWei,
                gasLimit: ethers.utils.hexlify(300000) // Set gas limit
            });

            await tx.wait(); // Wait for transaction confirmation

            // Refresh data after successful donation
            await refreshContractData();

            return tx;
        } catch (error) {
            console.error('Donation failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Get contract balance
    const getContractBalance = async () => {
        try {
            const contract = getContractInstance();
            if (!contract) return;

            const balance = await contract.getContractBalance();
            setContractBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error('Error getting contract balance:', error);
        }
    };

    // Get total donors
    const getTotalDonors = async () => {
        try {
            const contract = getContractInstance();
            if (!contract) return;

            const total = await contract.getTotalDonors();
            setTotalDonors(total.toNumber());
        } catch (error) {
            console.error('Error getting total donors:', error);
        }
    };

    // Get user donor info
    const getUserDonorInfo = async () => {
        if (!address) return;

        try {
            const contract = getContractInstance();
            if (!contract) return;

            const [totalAmount, latestMessage] = await contract.getDonor(address);
            const donationHistory = await contract.getDonorHistory(address);

            const formattedHistory = donationHistory.map((donation: any) => ({
                amount: ethers.utils.formatEther(donation.amount),
                message: donation.message,
                timestamp: donation.timestamp.toNumber()
            }));

            setUserDonorInfo({
                totalAmount: ethers.utils.formatEther(totalAmount),
                latestMessage,
                donationHistory: formattedHistory
            });
        } catch (error) {
            console.error('Error getting user donor info:', error);
        }
    };

    // Refresh all contract data
    const refreshContractData = async () => {
        await Promise.all([
            getContractBalance(),
            getTotalDonors(),
            getUserDonorInfo()
        ]);
    };

    // Listen to contract events
    useEffect(() => {
        if (!walletProvider) return;

        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const contract = new ethers.Contract(DONATION_CONTRACT_ADDRESS, DONATION_CONTRACT_ABI, ethersProvider);

        // Listen to Donate events
        const handleDonate = (donor: string, amount: ethers.BigNumber, message: string) => {
            console.log('New donation:', {
                donor,
                amount: ethers.utils.formatEther(amount),
                message
            });

            // Refresh data when new donation occurs
            refreshContractData();
        };

        contract.on('Donate', handleDonate);

        return () => {
            contract.off('Donate', handleDonate);
        };
    }, [walletProvider, address]);

    // Initial data load
    useEffect(() => {
        if (isConnected && walletProvider) {
            refreshContractData();
        }
    }, [isConnected, address, walletProvider]);

    return {
        // State
        loading,
        contractBalance,
        totalDonors,
        userDonorInfo,
        isConnected,
        address,

        // Functions
        donate,
        refreshContractData,
        getContractBalance,
        getTotalDonors,
        getUserDonorInfo
    };
};