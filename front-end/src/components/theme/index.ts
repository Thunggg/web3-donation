import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                // Primary palette
                primary: {
                    50: { value: "#F0E6FF" },
                    500: { value: "#7D4BFF" },
                    600: { value: "#6A3CE6" },
                    900: { value: "#320F99" }
                },

                // Secondary palette  
                secondary: {
                    50: { value: "#E6F0FF" },
                    500: { value: "#0066E6" },
                    600: { value: "#0052B3" },
                    900: { value: "#00161A" }
                },

                // Backgrounds
                bg: {
                    primary: { value: "#0F0F23" },
                    secondary: { value: "#1A1B3A" },
                    card: { value: "rgba(29, 31, 74, 0.6)" }
                },

                // Accents
                success: { value: "#10B981" },
                warning: { value: "#F59E0B" },
                error: { value: "#EF4444" },
                info: { value: "#06B6D4" },

                // Text
                text: {
                    primary: { value: "#FFFFFF" },
                    secondary: { value: "#A0A0B8" },
                    muted: { value: "#6B7280" }
                },

                // Light mode colors
                light: {
                    bg: { value: "#FFFFFF" },
                    cardBg: { value: "#F8F9FA" },
                    text: { value: "#1A202C" },
                    textSecondary: { value: "#4A5568" }
                },

                // Dark mode colors  
                dark: {
                    bg: { value: "#0F0F23" },
                    cardBg: { value: "rgba(29, 31, 74, 0.6)" },
                    text: { value: "#FFFFFF" },
                    textSecondary: { value: "#A0A0B8" }
                },

                darkMoon: {
                    bg: { value: "black" },
                    color: { value: "white" },
                },
                lightSun: {
                    bg: { value: "white" },
                    color: { value: "black" },
                }
            },

            fonts: {
                body: { value: "Inter, system-ui, sans-serif" },
                heading: { value: "Inter, system-ui, sans-serif" }
            },

            shadows: {
                card: { value: "0 8px 32px rgba(0, 0, 0, 0.3)" },
                glow: { value: "0 0 20px rgba(125, 75, 255, 0.3)" }
            },


        },

        semanticTokens: {
            colors: {
                // Background sẽ thay đổi theo mode
                bg: {
                    value: {
                        base: "{colors.light.bg}",
                        _dark: "{colors.dark.bg}"
                    }
                },

                cardBg: {
                    value: {
                        base: "{colors.light.cardBg}",
                        _dark: "{colors.dark.cardBg}"
                    }
                },

                // Text colors
                fg: {
                    value: {
                        base: "{colors.light.text}",
                        _dark: "{colors.dark.text}"
                    }
                },

                fgMuted: {
                    value: {
                        base: "{colors.light.textSecondary}",
                        _dark: "{colors.dark.textSecondary}"
                    }
                },


                // dùng cho các icon của dark/light mode
                iconBg: {
                    value: {
                        base: "white",     // light mode
                        _dark: "#0F0F23",    // dark mode
                    }
                },

                iconColor: {
                    value: {
                        base: "black",
                        _dark: "white",
                    }
                },

                iconBgHover: {
                    value: {
                        base: "#0F0F23",   // light mode hover
                        _dark: "white ",  // dark mode hover
                    }
                },

                iconColorHover: {
                    value: {
                        base: "white",   // light mode hover
                        _dark: "black",  // dark mode hover
                    }
                }
            }
        }


    },


})

export const system = createSystem(defaultConfig, config)