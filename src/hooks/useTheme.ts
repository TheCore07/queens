import { useState, useEffect } from "react";

const THEME_COOKIE = "theme";

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
};

const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value};path=/`;
};

// Funktion, um den initialen Theme-Wert zu bestimmen
const getInitialTheme = (): string => {
    const savedTheme = getCookie(THEME_COOKIE);
    if (savedTheme) return savedTheme;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "white";
};

export function useTheme() {
    const [theme, setThemeState] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return getInitialTheme();
        }
        return "white"; // Default SSR
    });

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
        document.documentElement.className = newTheme;
        setCookie(THEME_COOKIE, newTheme);
    };

    useEffect(() => {
        // Sicherstellen, dass die Klasse gesetzt ist, falls SSR
        document.documentElement.className = theme;
    }, [theme]);

    return { theme, setTheme };
}
