import { ClientOnly, IconButton, Skeleton } from "@chakra-ui/react"
import { useColorMode } from "@/components/ui/color-mode"
import { LuMoon, LuSun } from "react-icons/lu"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { toggleColorMode, colorMode } = useColorMode()
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton onClick={toggleColorMode} variant="outline" size="sm">
                {colorMode === "light" ? <LuSun /> : <LuMoon />}
            </IconButton>
            {children}
        </ClientOnly>
    )
}

export default MainLayout;