"use client"

import { ClientOnly, IconButton, Skeleton, Box, Flex } from "@chakra-ui/react"
import { useColorMode } from "@/components/ui/color-mode"
import { LuMoon, LuSun } from "react-icons/lu"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <Box
                bg="bg"
                color="fg"
                h="100vh"
            >
                {children}
            </Box>
        </ClientOnly>
    )
}

export default MainLayout;