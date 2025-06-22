import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                primary: { value: "#0FEE0F" },
                secondary: { value: "#EE0F0F" },
            },
            fonts: {
                body: { value: "system-ui, sans-serif" },
            },
        },
        semanticTokens: {
            colors: {
                danger: {
                    value: { base: "{colors.primary}", _dark: "{colors.secondary}" },
                }
            },
        },
    },
})

export const system = createSystem(defaultConfig, config)
