import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { submitFeedback } from '@/api/feedback';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeedbackForm() {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || message.length < 3) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await submitFeedback(message);
            setIsSuccess(true);
            setMessage('');
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card text-card-foreground p-6 rounded-3xl shadow-xl border animate-in fade-in duration-500 max-w-lg mx-auto w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <MessageSquare size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
            </div>

            {isSuccess ? (
                <div className="py-10 text-center animate-in zoom-in-95 duration-300">
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                    <p className="opacity-70">Your feedback has been received and helps us improve the game.</p>
                    <Button 
                        variant="outline" 
                        onClick={() => setIsSuccess(false)} 
                        className="mt-6"
                    >
                        Send more feedback
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm opacity-70 mb-2">
                        Do you have suggestions, found a bug or just want to say hi? We'd love to hear from you!
                    </p>
                    
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full min-h-[120px] p-4 rounded-2xl bg-muted/50 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm"
                        disabled={isSubmitting}
                    />

                    {error && (
                        <p className="text-xs text-destructive font-medium px-2">{error}</p>
                    )}

                    <Button 
                        type="submit" 
                        disabled={isSubmitting || message.trim().length < 3}
                        className="w-full py-6 rounded-2xl gap-2 font-bold text-lg shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                        Send Feedback
                    </Button>
                </form>
            )}
        </div>
    );
}
