import { StyleSheet } from "react-native-unistyles";

export const lightTheme = {
  colors: {
    text: "#11181C",
    background: "#fff",
    tint: "@0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
    border: "#d4d4d8",
    primary: "pink",
    secondary: "",
    tertiary: "",
    red: "darkred",
  },
};

export const darkTheme = {
  colors: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
    border: "#52525c",
    primary: "pink",
    secondary: "",
    tertiary: "",
    red: "red",
  },
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  superLarge: 2000,
  tvLike: 4000,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  breakpoints,
  themes: appThemes,
});
