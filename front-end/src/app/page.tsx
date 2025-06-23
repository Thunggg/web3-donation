"use client"

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout"
import { useColorModeValue } from "@/components/ui/color-mode";
import { useDonationContract } from "@/config/useDonationContract";
import {
  Box,
  Flex,
  Container,
  Grid,
  GridItem,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Avatar,
  Input,
  Textarea,
  Skeleton,
  Alert
} from "@chakra-ui/react"

export default function Home() {
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    contractBalance,
    totalDonors,
    userDonorInfo,
    loading,
    isConnected,
    address,
    donate
  } = useDonationContract();

  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("gray.100", "#1a1a2e");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const userStatsCardBg = useColorModeValue("white", "gray.700");
  const donationHistoryCardBg = useColorModeValue("white", "gray.700");

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (!donationMessage.trim()) {
      setError("Vui lòng nhập lời nhắn");
      return;
    }

    try {
      await donate(donationAmount, donationMessage);
      setSuccess("Donation thành công! Cảm ơn bạn đã đóng góp.");
      setDonationAmount("");
      setDonationMessage("");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi donation");
    }
  };

  return (
    <>
      <MainLayout>
        <Container py={8} maxW="container.xl">
          <Grid templateColumns="2fr 1fr" gap={8} h="calc(100vh - 120px)">
            {/* Main content */}
            <GridItem>
              {/* Contract Stats */}
              <Box mb={6}>
                <Flex
                  direction="column"
                  bg={cardBg}
                  borderRadius="xl"
                  p={10}
                  align="center"
                  justify="center"
                  textAlign="center"
                  minH="200px"
                >
                  <Text fontSize="lg" mb={2} color="gray.400">
                    Tổng Donation Fund
                  </Text>
                  {loading ? (
                    <Skeleton height="60px" width="300px" />
                  ) : (
                    <Heading fontSize="5xl" color={textColor}>
                      {contractBalance} <Text as="span" color="gray.500">ETH</Text>
                    </Heading>
                  )}
                  <Text fontSize="md" mt={2} color="gray.500">
                    Tổng số donors: {loading ? "..." : totalDonors}
                  </Text>
                </Flex>
              </Box>

              {/* Donation Form */}
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
              >
                <Heading size="md" mb={4} color={textColor}>
                  💝 Thực hiện Donation
                </Heading>

                {!isConnected ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">Vui lòng kết nối ví để donation</Text>
                  </Box>
                ) : (
                  <form onSubmit={handleDonate}>
                    <VStack gap={4} align="stretch">
                      <Box>
                        <Text mb={2} color={textColor} fontSize="sm" fontWeight="medium">
                          Số tiền (ETH)
                        </Text>
                        <Input
                          type="number"
                          step="0.001"
                          placeholder="0.01"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          disabled={loading}
                        />
                      </Box>

                      <Box>
                        <Text mb={2} color={textColor} fontSize="sm" fontWeight="medium">
                          Lời nhắn
                        </Text>
                        <Textarea
                          placeholder="Nhập lời nhắn của bạn..."
                          value={donationMessage}
                          onChange={(e) => setDonationMessage(e.target.value)}
                          disabled={loading}
                          rows={3}
                        />
                      </Box>

                      {error && (
                        <Alert.Root status="error">
                          <Alert.Title>{error}</Alert.Title>
                        </Alert.Root>
                      )}

                      {success && (
                        <Alert.Root status="success">
                          <Alert.Title>{success}</Alert.Title>
                        </Alert.Root>
                      )}

                      <Button
                        type="submit"
                        colorScheme="blue"
                        loading={loading}
                        loadingText="Đang xử lý..."
                        size="lg"
                      >
                        Donation Ngay
                      </Button>
                    </VStack>
                  </form>
                )}
              </Box>
            </GridItem>

            {/* User Donation History */}
            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                h="100%"
                display="flex"
                flexDirection="column"
              >
                <Heading size="lg" mb={6} color={textColor} textAlign="center">
                  📋 Lịch sử của bạn
                </Heading>

                {!isConnected ? (
                  <Box textAlign="center" mt={8}>
                    <Text color="gray.500">Kết nối ví để xem lịch sử</Text>
                  </Box>
                ) : loading ? (
                  <VStack gap={3}>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height="60px" borderRadius="lg" />
                    ))}
                  </VStack>
                ) : !userDonorInfo || userDonorInfo.donationHistory.length === 0 ? (
                  <Box textAlign="center" mt={8}>
                    <Text color="gray.500">Chưa có donation nào</Text>
                  </Box>
                ) : (
                  <>
                    {/* User Stats */}
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={userStatsCardBg}
                      border="1px"
                      borderColor={borderColor}
                      mb={4}
                    >
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Tổng đóng góp của bạn
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">
                        {userDonorInfo.totalAmount} ETH
                      </Text>
                      {userDonorInfo.latestMessage && (
                        <Text fontSize="sm" color="gray.500" mt={2}>
                          "{userDonorInfo.latestMessage}"
                        </Text>
                      )}
                    </Box>

                    {/* Donation History */}
                    <Box flex="1" overflowY="auto" pr={2}>
                      <VStack align="stretch" gap={3}>
                        {userDonorInfo.donationHistory.map((donation, index) => (
                          <Box
                            key={index}
                            p={3}
                            borderRadius="lg"
                            bg={donationHistoryCardBg}
                            border="1px"
                            borderColor={borderColor}
                          >
                            <HStack justify="space-between" align="start">
                              <Box flex="1">
                                <Text fontSize="sm" color="gray.500">
                                  {formatTime(donation.timestamp)}
                                </Text>
                                <Text fontSize="sm" color={textColor} mt={1}>
                                  "{donation.message}"
                                </Text>
                              </Box>
                              <Text
                                fontWeight="bold"
                                color="green.500"
                                fontSize="sm"
                              >
                                {donation.amount} ETH
                              </Text>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  </>
                )}
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </MainLayout>
    </>
  )
}