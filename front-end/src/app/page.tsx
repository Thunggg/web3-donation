"use client"

import MainLayout from "@/components/layout/main-layout"
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode"
import { ClientOnly, IconButton, Skeleton, Box, Flex, Container } from "@chakra-ui/react"
import { LuMoon, LuSun } from "react-icons/lu"

export default function Home() {
  const { toggleColorMode, colorMode, setColorMode } = useColorMode()

  return (
    <>
      <MainLayout>
        <Container>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              SPIN MASTER
            </Box>
            <Box>
              <IconButton onClick={toggleColorMode} variant="outline" size="sm" color="iconColor" bg="iconBg" _hover={{ bg: "iconBgHover", color: "iconColorHover" }}>
                {colorMode === "light" ? <LuSun /> : <LuMoon />}
              </IconButton>
            </Box>
          </Flex>
        </Container>
      </MainLayout>
    </>
  )
}
