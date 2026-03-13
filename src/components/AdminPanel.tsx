import { useState, useEffect } from 'react';
import { triggerDailyGeneration } from '../api/Game';
import { getAllFeedback } from '../api/feedback';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, AlertCircle, MessageSquare, User, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackEntry {
    _id: string;
    userId: {
        username: string;
        email: string;
    };
    message: string;
    createdAt: string;
}

export default function AdminPanel() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        setIsFeedbackLoading(true);
        try {
            const response = await getAllFeedback();
            setFeedback(response.data);
        } catch (error) {
            console.error("Failed to fetch feedback:", error);
        } finally {
            setIsFeedbackLoading(false);
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setStatus(null);
        try {
            await triggerDailyGeneration();
            setStatus({ type: 'success', message: t('admin.success') });
        } catch (error: any) {
            const msg = error.response?.data?.message || t('admin.error');
            setStatus({ type: 'error', message: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border/50">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                    <RefreshCw className="text-primary" size={32} />
                    {t('admin.title')}
                </h2>

                <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                    <h3 className="text-xl font-bold mb-2">{t('admin.generateDaily')}</h3>
                    <p className="text-sm opacity-70 mb-6 leading-relaxed">
                        {t('admin.generateDesc')}
                    </p>

                    {status && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                            status.type === 'success' 
                                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                                : 'bg-destructive/10 text-destructive border-destructive/20'
                        }`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-sm font-medium">{status.message}</span>
                        </div>
                    )}

                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="w-full sm:w-auto px-8 py-6 h-auto text-lg font-bold shadow-lg shadow-primary/20 rounded-xl"
                    >
                        <RefreshCw className={cn("mr-2", isLoading && "animate-spin")} size={20} />
                        {t('admin.button')}
                    </Button>
                </div>
            </div>

            <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border/50">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black flex items-center gap-3">
                        <MessageSquare className="text-primary" size={32} />
                        User Feedback
                    </h2>
                    <Button variant="outline" size="sm" onClick={fetchFeedback} disabled={isFeedbackLoading} className="rounded-full">
                        <RefreshCw size={16} className={cn("mr-2", isFeedbackLoading && "animate-spin")} />
                        Refresh
                    </Button>
                </div>

                <div className="space-y-4">
                    {isFeedbackLoading ? (
                        <div className="py-20 text-center opacity-50 font-bold animate-pulse">LOADING FEEDBACK...</div>
                    ) : feedback.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed rounded-3xl opacity-40 italic">
                            No feedback received yet.
                        </div>
                    ) : (
                        feedback.map((item) => (
                            <div key={item._id} className="bg-muted/30 p-6 rounded-2xl border border-foreground/5 hover:bg-muted/50 transition-colors">
                                <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-foreground/5">
                                    <div className="flex items-center gap-2 text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                                        <User size={14} />
                                        {item.userId?.username || 'Unknown'}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs opacity-60">
                                        <Mail size={14} />
                                        {item.userId?.email || 'No email'}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs opacity-60 ml-auto">
                                        <Calendar size={14} />
                                        {new Date(item.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap italic">
                                    "{item.message}"
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
