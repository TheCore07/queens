import { useState, useEffect } from "react";
import { getCookie, safeSetCookie } from "@/lib/cookieUtils";

const THEME_COOKIE = "theme";

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
        safeSetCookie(THEME_COOKIE, newTheme);
    };

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    return { theme, setTheme };
}
