import * as Popover from '@radix-ui/react-popover';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'white', label: 'Light', icon: <Sun size={14} />, class: 'bg-white' },
        { id: 'dark', label: 'Dark', icon: <Moon size={14} />, class: 'bg-slate-900' },
        { id: 'pink', label: 'Pink', icon: <Palette size={14} />, class: 'bg-pink-300' },
    ];

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Palette size={20} />
                </Button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content 
                    className="z-50 w-48 bg-popover text-popover-foreground rounded-xl shadow-xl border p-2 animate-in fade-in zoom-in-95 duration-100" 
                    sideOffset={5}
                    align="end"
                >
                    <div className="flex flex-col gap-1">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                    theme === t.id 
                                        ? "bg-accent text-accent-foreground" 
                                        : "opacity-70 hover:bg-muted"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", t.class)}>
                                        {t.icon}
                                    </div>
                                    {t.label}
                                </div>
                                {theme === t.id && <Check size={14} className="text-primary" />}
                            </button>
                        ))}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
