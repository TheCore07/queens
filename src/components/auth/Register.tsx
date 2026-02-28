import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function Register({ onToggle }: { onToggle: () => void }) {
    const { register } = useAuth();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register({ email, username, password });
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card text-card-foreground p-8 rounded-lg shadow-xl max-w-md w-full mx-auto mt-10 border">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('auth.register')}</h2>
            {error && <div className="bg-destructive/10 text-destructive p-3 rounded mb-4 text-sm border border-destructive/20">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium opacity-70 mb-1">{t('auth.username')}</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary bg-background text-foreground"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium opacity-70 mb-1">{t('auth.email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary bg-background text-foreground"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium opacity-70 mb-1">{t('auth.password')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary bg-background text-foreground"
                        required
                        minLength={6}
                    />
                </div>
                <Button type="submit" className="w-full py-2" disabled={isLoading}>
                    {isLoading ? t('auth.creatingAccount') : t('auth.register')}
                </Button>
            </form>
            <p className="mt-6 text-center text-sm opacity-70">
                {t('auth.haveAccount')}{' '}
                <button onClick={onToggle} className="text-primary hover:underline font-semibold">{t('auth.login')}</button>
            </p>
        </div>
    );
}
