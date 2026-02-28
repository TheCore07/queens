import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/api/Game';
import { useTranslation } from 'react-i18next';

interface LeaderboardEntry {
    userId: {
        username: string;
    };
    timeInSeconds: number;
    date: string;
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await getLeaderboard();
            setEntries(response.data);
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

    if (isLoading) return <div className="text-center py-10">{t('game.loading')}</div>;

    return (
        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-lg max-w-md mx-auto border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                🏆 {t('header.leaderboard')}
            </h2>
            <div className="space-y-1">
                {entries.length === 0 ? (
                    <p className="opacity-50 text-center py-4 italic">No entries yet for today.</p>
                ) : (
                    entries.map((entry, index) => (
                        <div 
                            key={index} 
                            className={`flex justify-between items-center p-3 rounded-lg ${
                                index === 0 ? 'bg-primary/20 border border-primary/30' : 
                                index === 1 ? 'bg-muted/50' : 
                                index === 2 ? 'bg-muted/30' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`font-bold w-6 text-center ${
                                    index === 0 ? 'text-primary' : 'opacity-50'
                                }`}>
                                    {index + 1}.
                                </span>
                                <span className="font-semibold">
                                    {entry.userId?.username || 'Unknown'}
                                </span>
                            </div>
                            <span className="font-mono font-bold text-primary">
                                {formatTime(entry.timeInSeconds)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
