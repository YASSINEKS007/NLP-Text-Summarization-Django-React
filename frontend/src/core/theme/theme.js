export const colorTokens = {
    light: {
      background: "#F3F4F6", // Light grey for a softer background
      primary: "#7C3AED", // A rich purple for the primary color
      text: "#2D3748", // Dark grey for softer contrast against light background
    },
    dark: {
      background: "#1A1A2E", // Deep purple-black for an elegant dark mode
      primary: "#9D4EDD", // A vibrant purple for dark mode accents
      text: "#E2E8F0", // Light grey text for better readability
    },
    hover: "#6B21A8", // A bolder purple for hover states
  };
  
  export const themeSettings = (mode) => {
    return {
      palette: {
        mode: mode,
        primary: {
          main: colorTokens[mode].primary,
        },
        background: {
          default: colorTokens[mode].background,
          secondary: "#2E2E4D",
        },
        text: {
          primary: colorTokens[mode].text,
        },
        hover: {
          primary: colorTokens.hover,
        },
      },
      typography: {
        fontFamily: ["Karla", "sans-serif"].join(","),
        fontSize: 12,
        h1: { fontSize: 40, fontWeight: "bold" },
        h2: { fontSize: 32, fontWeight: "bold" },
        h3: { fontSize: 24, fontWeight: "bold" },
        h4: { fontSize: 20, fontWeight: "semi-bold" },
        h5: { fontSize: 16, fontWeight: "medium" },
        h6: { fontSize: 14, fontWeight: "medium" },
      },
    };
  };