export type ConsentStatus = 'granted' | 'denied' | 'undetermined';

const CONSENT_COOKIE = 'cookie-consent';

export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

export const setCookie = (name: string, value: string, days = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict`;
};

export const getConsentStatus = (): ConsentStatus => {
    return (getCookie(CONSENT_COOKIE) as ConsentStatus) || 'undetermined';
};

export const setConsentStatus = (status: ConsentStatus) => {
    setCookie(CONSENT_COOKIE, status);
};

export const canSetStorage = (): boolean => {
    return getConsentStatus() === 'granted';
};

export const safeSetCookie = (name: string, value: string) => {
    if (canSetStorage()) {
        setCookie(name, value);
    }
};
