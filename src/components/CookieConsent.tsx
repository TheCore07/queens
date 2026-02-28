import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getConsentStatus, setConsentStatus } from '@/lib/cookieUtils';
import { ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const status = getConsentStatus();
        if (status === 'undetermined') {
            setIsVisible(true);
        }
    }, []);

    const handleConsent = (granted: boolean) => {
        setConsentStatus(granted ? 'granted' : 'denied');
        setIsVisible(false);
        // Reload to let other hooks/i18n pick up the change and save their state if granted
        if (granted) {
            window.location.reload();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl hidden sm:block">
                    <ShieldCheck className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {t('cookies.title')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {t('cookies.description')}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                        {t('cookies.essential')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Button 
                        variant="ghost" 
                        onClick={() => handleConsent(false)}
                        className="text-sm font-medium"
                    >
                        {t('cookies.decline')}
                    </Button>
                    <Button 
                        variant="default" 
                        onClick={() => handleConsent(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg shadow-blue-600/20"
                    >
                        {t('cookies.accept')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
