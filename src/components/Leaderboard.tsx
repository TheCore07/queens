import { useEffect, useState } from 'react';
import { getLeaderboard, getInfinityLeaderboard } from '@/api/Game';
import { useTranslation } from 'react-i18next';
import { Trophy, Clock, Zap, Infinity as InfinityIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DailyEntry {
    userId: {
        username: string;
        streak: number;
    };
    timeInSeconds: number;
    date: string;
}

interface InfinityEntry {
    username: string;
    infinitySolved: number;
}

export default function Leaderboard() {
    const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
    const [infinityEntries, setInfinityEntries] = useState<InfinityEntry[]>([]);
    const [type, setType] = useState<'daily' | 'infinity'>('daily');
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (type === 'daily') {
                const response = await getLeaderboard();
                setDailyEntries(response.data);
            } else {
                const response = await getInfinityLeaderboard();
                setInfinityEntries(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-card text-card-foreground p-6 rounded-3xl shadow-2xl max-w-xl mx-auto border animate-in fade-in duration-500">
            <div className="flex flex-col items-center mb-8">
                <Trophy className="text-primary mb-2 animate-bounce" size={48} />
                <h2 className="text-3xl font-black tracking-tight">{t('header.leaderboard')}</h2>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-muted p-1.5 rounded-2xl mb-8 ring-1 ring-foreground/5">
                <Button 
                    variant={type === 'daily' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setType('daily')}
                    className={cn(
                        "flex-1 gap-2 font-bold transition-all duration-300 rounded-xl",
                        type === 'daily' ? "shadow-md scale-[1.02]" : "opacity-60"
                    )}
                >
                    <Clock size={18} />
                    {t('header.daily')}
                </Button>
                <Button 
                    variant={type === 'infinity' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setType('infinity')}
                    className={cn(
                        "flex-1 gap-2 font-bold transition-all duration-300 rounded-xl",
                        type === 'infinity' ? "shadow-md scale-[1.02]" : "opacity-60"
                    )}
                >
                    <InfinityIcon size={18} />
                    {t('header.infinity')}
                </Button>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex flex-col items-center py-20 gap-3">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <div className="text-center opacity-50 font-bold animate-pulse uppercase tracking-widest text-xs">{t('game.loading')}</div>
                    </div>
                ) : (
                    <>
                        {type === 'daily' && (
                            dailyEntries.length === 0 ? (
                                <p className="opacity-50 text-center py-12 italic border-2 border-dashed rounded-3xl">{t('leaderboard.noEntries')}</p>
                            ) : (
                                dailyEntries.map((entry, index) => (
                                    <div 
                                        key={index} 
                                        className={cn(
                                            "flex justify-between items-center p-4 rounded-2xl transition-all hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                            index === 0 ? 'bg-primary/10 border-2 border-primary/20 shadow-sm' : 
                                            'bg-muted/30 border border-foreground/5 hover:bg-muted/50'
                                        )}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "text-xl font-black w-8 text-center",
                                                index === 0 ? 'text-primary' : 'opacity-20'
                                            )}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <div className="font-bold text-lg leading-tight">{entry.userId?.username || 'Unknown'}</div>
                                                <div className="text-xs opacity-50 font-medium flex items-center gap-1 mt-0.5">
                                                    <Zap size={12} className="text-orange-500 fill-orange-500/20" />
                                                    {t('header.streak')}: {entry.userId?.streak || 0}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-mono text-xl font-black text-primary tracking-tighter">
                                            {formatTime(entry.timeInSeconds)}
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {type === 'infinity' && (
                            infinityEntries.length === 0 ? (
                                <p className="opacity-50 text-center py-12 italic border-2 border-dashed rounded-3xl">{t('leaderboard.noInfinity')}</p>
                            ) : (
                                infinityEntries.map((entry, index) => (
                                    <div 
                                        key={index} 
                                        className={cn(
                                            "flex justify-between items-center p-4 rounded-2xl transition-all hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                            index === 0 ? 'bg-primary/10 border-2 border-primary/20 shadow-sm' : 
                                            'bg-muted/30 border border-foreground/5 hover:bg-muted/50'
                                        )}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "text-xl font-black w-8 text-center",
                                                index === 0 ? 'text-primary' : 'opacity-20'
                                            )}>
                                                {index + 1}
                                            </span>
                                            <div className="font-bold text-lg">{entry.username}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-primary tracking-tighter">{entry.infinitySolved}</span>
                                            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{t('leaderboard.solved')}</span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
