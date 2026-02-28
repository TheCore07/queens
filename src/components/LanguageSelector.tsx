import * as Popover from '@radix-ui/react-popover';
import { Languages, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    ];

    const currentLang = i18n.language.split('-')[0];

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Languages size={20} />
                </Button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content 
                    className="z-50 w-48 bg-popover text-popover-foreground rounded-xl shadow-xl border p-2 animate-in fade-in zoom-in-95 duration-100" 
                    sideOffset={5}
                    align="end"
                >
                    <div className="flex flex-col gap-1">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => i18n.changeLanguage(l.code)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                    currentLang === l.code 
                                        ? "bg-accent text-accent-foreground" 
                                        : "opacity-70 hover:bg-muted"
                                )}
                            >
                                <div className="flex items-center gap-2 text-base">
                                    <span>{l.flag}</span>
                                    <span className="text-sm">{l.label}</span>
                                </div>
                                {currentLang === l.code && <Check size={14} className="text-primary" />}
                            </button>
                        ))}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
