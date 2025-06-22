"use client"

import MainLayout from "@/components/layout/main-layout"
import { Box } from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode"

export default function Home() {
  const bg = useColorModeValue("red.500", "red.200")
  const color = useColorModeValue("white", "gray.800")

  return (
    <>
      <MainLayout>
        <Box color="danger" fontFamily="body">
          Hello World
        </Box>
      </MainLayout>
    </>
  )
}
