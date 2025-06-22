"use client"

import MainLayout from "@/components/layout/main-layout"
import { useColorModeValue } from "@/components/ui/color-mode";
import {
  IconButton,
  Box,
  Flex,
  Container,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Avatar,
  Badge
} from "@chakra-ui/react"

// Mock data cho top 10 donors
const topDonors = [
  { id: 1, name: "Nguyen Van A", amount: 5420.50, avatar: "https://bit.ly/sage-adebayo" },
  { id: 2, name: "Tran Thi B", amount: 4280.30, avatar: "https://bit.ly/kent-c-dodds" },
  { id: 3, name: "Le Van C", amount: 3650.75, avatar: "https://bit.ly/ryan-florence" },
  { id: 4, name: "Pham Thi D", amount: 2940.20, avatar: "https://bit.ly/prosper-baba" },
  { id: 5, name: "Hoang Van E", amount: 2500.00, avatar: "https://bit.ly/code-beast" },
  { id: 6, name: "Vu Thi F", amount: 2100.80, avatar: "https://bit.ly/sage-adebayo" },
  { id: 7, name: "Do Van G", amount: 1890.45, avatar: "https://bit.ly/kent-c-dodds" },
  { id: 8, name: "Bui Thi H", amount: 1650.30, avatar: "https://bit.ly/ryan-florence" },
  { id: 9, name: "Mai Van I", amount: 1400.60, avatar: "https://bit.ly/prosper-baba" },
  { id: 10, name: "Cao Thi J", amount: 1200.25, avatar: "https://bit.ly/code-beast" }
];

// Mock data cho recent donations
const recentDonations = [
  { id: 1, name: "Alex Johnson", amount: 250.00, time: "2 phút trước", avatar: "https://bit.ly/sage-adebayo" },
  { id: 2, name: "Maria Garcia", amount: 150.50, time: "5 phút trước", avatar: "https://bit.ly/kent-c-dodds" },
  { id: 3, name: "David Smith", amount: 500.00, time: "8 phút trước", avatar: "https://bit.ly/ryan-florence" },
  { id: 4, name: "Emily Davis", amount: 75.25, time: "12 phút trước", avatar: "https://bit.ly/prosper-baba" },
  { id: 5, name: "Michael Brown", amount: 320.80, time: "15 phút trước", avatar: "https://bit.ly/code-beast" },
  { id: 6, name: "Sarah Wilson", amount: 180.40, time: "18 phút trước", avatar: "https://bit.ly/sage-adebayo" },
  { id: 7, name: "James Miller", amount: 450.00, time: "22 phút trước", avatar: "https://bit.ly/kent-c-dodds" },
  { id: 8, name: "Lisa Anderson", amount: 95.75, time: "25 phút trước", avatar: "https://bit.ly/ryan-florence" },
  { id: 9, name: "Robert Taylor", amount: 275.30, time: "28 phút trước", avatar: "https://bit.ly/prosper-baba" },
  { id: 10, name: "Jennifer Lee", amount: 125.60, time: "32 phút trước", avatar: "https://bit.ly/code-beast" },
  { id: 11, name: "Kevin White", amount: 380.90, time: "35 phút trước", avatar: "https://bit.ly/sage-adebayo" },
  { id: 12, name: "Amanda Clark", amount: 220.15, time: "40 phút trước", avatar: "https://bit.ly/kent-c-dodds" }
];

export default function Home() {
  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("gray.100", "#1a1a2e");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      <MainLayout>
        <Container py={8}>
          <Grid templateColumns="2fr 1fr" gap={8} h="calc(100vh - 120px)">
            {/* Main content - Charity Fund */}
            <GridItem>
              <Box>
                <Flex
                  direction="column"
                  bg={cardBg}
                  borderRadius="xl"
                  p={10}
                  align="center"
                  justify="center"
                  textAlign="center"
                  minH="300px"
                >
                  <Text fontSize="lg" mb={2} color="gray.400">
                    Your Charity Fund
                  </Text>
                  <Heading fontSize="5xl" color={textColor}>
                    $120,184.<Text as="span" color="gray.500">34</Text>
                  </Heading>
                  <Button mt={6} colorScheme="blue" size="lg" borderRadius="full">
                    Add Funds
                  </Button>
                </Flex>
              </Box>

              <Box flex="1" minH="0">
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={6}
                  h="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Heading size="md" mb={4} color={textColor}>
                    🕒 Donations gần đây
                  </Heading>

                  <Box flex="1" overflowY="auto" pr={2}>
                    <VStack align="stretch">
                      {recentDonations.map((donation) => (
                        <Box
                          key={donation.id}
                          p={3}
                          borderRadius="lg"
                          bg={useColorModeValue("white", "gray.700")}
                          border="1px"
                          borderColor={borderColor}
                          _hover={{
                            transform: "translateX(4px)",
                            transition: "all 0.2s"
                          }}
                        >
                          <HStack justify="space-between" align="center">
                            <HStack >
                              <Avatar.Root size="sm">
                                <Avatar.Fallback name={donation.name} />
                                <Avatar.Image src={donation.avatar} />
                              </Avatar.Root>
                              <Box>
                                <Text fontWeight="medium" color={textColor} fontSize="sm">
                                  {donation.name}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {donation.time}
                                </Text>
                              </Box>
                            </HStack>

                            <Text
                              fontWeight="bold"
                              color="green.500"
                              fontSize="sm"
                            >
                              +${donation.amount.toLocaleString()}
                            </Text>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              </Box>
            </GridItem>

            {/* Top 10 Donors Panel */}
            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                h="100%"
                overflowY="auto"
              >
                <Heading size="lg" mb={6} color={textColor} textAlign="center">
                  🏆 Top 10 Donors
                </Heading>

                <VStack align="stretch">
                  {topDonors.map((donor, index) => (
                    <Box
                      key={donor.id}
                      p={4}
                      borderRadius="lg"
                      bg={useColorModeValue("white", "gray.700")}
                      border="1px"
                      borderColor={borderColor}
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                        transition: "all 0.2s"
                      }}
                    >
                      <HStack justify="space-between" align="center">
                        <HStack>
                          <Badge
                            colorScheme={index < 3 ? "yellow" : "gray"}
                            variant="solid"
                            borderRadius="full"
                            px={2}
                            py={1}
                            fontSize="sm"
                          >
                            #{index + 1}
                          </Badge>
                          <Avatar.Root>
                            <Avatar.Fallback name="Segun Adebayo" />
                            <Avatar.Image src={donor.avatar} />
                          </Avatar.Root>
                          <Box>
                            <Text fontWeight="medium" color={textColor} fontSize="sm">
                              {donor.name}
                            </Text>
                          </Box>
                        </HStack>

                        <Text
                          fontWeight="bold"
                          color={index < 3 ? "yellow.500" : "green.500"}
                          fontSize="sm"
                        >
                          ${donor.amount.toLocaleString()}
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </MainLayout>
    </>
  )
}