"use client"

import MainLayout from "@/components/layout/main-layout"
import { useColorMode } from "@/components/ui/color-mode"
import { IconButton, Box, Flex, Container } from "@chakra-ui/react"
import { LuMoon, LuSun } from "react-icons/lu"

const NavBar = () => {
    const { toggleColorMode, colorMode } = useColorMode()

    return (
        <>
            <Container>
                <Flex
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    padding={"20px 0px"}
                >
                    <Box
                        fontWeight={900}
                        textTransform={"uppercase"}
                    >
                        thunggg charity
                    </Box>
                    <Box>
                        <Flex gap={2}>
                            <appkit-button />
                            <IconButton onClick={toggleColorMode} variant="outline" size="sm" color="iconColor" bg="iconBg" _hover={{ bg: "iconBgHover", color: "iconColorHover" }}>
                                {colorMode === "light" ? <LuSun /> : <LuMoon />}
                            </IconButton>
                        </Flex>
                    </Box>
                </Flex>
            </Container>
        </>
    )
}

export default NavBar;