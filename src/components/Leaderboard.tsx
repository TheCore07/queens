import { useEffect, useState } from 'react';
import { getLeaderboard, getInfinityLeaderboard } from '@/api/Game';
import { useTranslation } from 'react-i18next';
import { Trophy, Clock, Zap, Infinity as InfinityIcon } from 'lucide-react';

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
                <Trophy className="text-yellow-500 mb-2" size={48} />
                <h2 className="text-3xl font-black">{t('header.leaderboard')}</h2>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-muted p-1 rounded-xl mb-8">
                <button 
                    onClick={() => setType('daily')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
                        type === 'daily' ? 'bg-background shadow-sm' : 'opacity-50 hover:opacity-100'
                    }`}
                >
                    <Clock size={18} />
                    {t('header.daily')}
                </button>
                <button 
                    onClick={() => setType('infinity')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
                        type === 'infinity' ? 'bg-background shadow-sm' : 'opacity-50 hover:opacity-100'
                    }`}
                >
                    <InfinityIcon size={18} />
                    {t('header.infinity')}
                </button>
            </div>

            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center py-10 opacity-50 font-medium">{t('game.loading')}</div>
                ) : (
                    <>
                        {type === 'daily' && (
                            dailyEntries.length === 0 ? (
                                <p className="opacity-50 text-center py-8 italic">{t('leaderboard.noEntries')}</p>
                            ) : (
                                dailyEntries.map((entry, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex justify-between items-center p-4 rounded-2xl transition-transform hover:scale-[1.02] ${
                                            index === 0 ? 'bg-yellow-500/10 border-2 border-yellow-500/20' : 
                                            'bg-muted/30 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xl font-black w-8 ${
                                                index === 0 ? 'text-yellow-500' : 'opacity-30'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <div className="font-bold text-lg">{entry.userId?.username || 'Unknown'}</div>
                                                <div className="text-xs opacity-50 flex items-center gap-1">
                                                    <Zap size={12} className="text-orange-500" />
                                                    {t('header.streak')}: {entry.userId?.streak || 0}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-mono text-xl font-black text-primary">
                                            {formatTime(entry.timeInSeconds)}
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {type === 'infinity' && (
                            infinityEntries.length === 0 ? (
                                <p className="opacity-50 text-center py-8 italic">{t('leaderboard.noInfinity')}</p>
                            ) : (
                                infinityEntries.map((entry, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex justify-between items-center p-4 rounded-2xl transition-transform hover:scale-[1.02] ${
                                            index === 0 ? 'bg-blue-500/10 border-2 border-blue-500/20' : 
                                            'bg-muted/30 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xl font-black w-8 ${
                                                index === 0 ? 'text-blue-500' : 'opacity-30'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <div className="font-bold text-lg">{entry.username}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-primary">{entry.infinitySolved}</span>
                                            <span className="text-xs font-bold opacity-40 uppercase tracking-widest">{t('leaderboard.solved')}</span>
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
