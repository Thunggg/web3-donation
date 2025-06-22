
import { useColorMode } from "@/components/ui/color-mode";
import { useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";

export function AppKitThemeSync() {
    const { colorMode } = useColorMode();
    const appKit = useAppKit();

    useEffect(() => {
        // AppKit doesn't currently support theme syncing
    }, [colorMode]);

    return null;
}