import { useState } from 'react';
import { triggerDailyGeneration } from '../api/Game';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminPanel() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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
        <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <RefreshCw className="text-primary" size={32} />
                {t('admin.title')}
            </h2>

            <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                <h3 className="text-xl font-bold mb-2">{t('admin.generateDaily')}</h3>
                <p className="text-sm opacity-70 mb-6 leading-relaxed">
                    {t('admin.generateDesc')}
                </p>

                {status && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
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
                    className="w-full sm:w-auto px-8 py-6 h-auto text-lg font-bold shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <RefreshCw className="mr-2 animate-spin" size={20} />
                    ) : (
                        <RefreshCw className="mr-2" size={20} />
                    )}
                    {t('admin.button')}
                </Button>
            </div>
        </div>
    );
}
