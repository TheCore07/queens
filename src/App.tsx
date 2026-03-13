import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Board from "@/components/queens/Board";
import { useQueensGame } from "@/hooks/queens/useQueensGame";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Leaderboard from "@/components/Leaderboard";
import AdminPanel from "@/components/AdminPanel";
import FeedbackForm from "@/components/FeedbackForm";
import LegalNotice from "@/components/LegalNotice";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import ThemeSelector from "@/components/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";
import CookieConsent from "@/components/CookieConsent";
import { useTranslation } from "react-i18next";
import { LogOut, Trophy, Gamepad2, User as UserIcon, Clock, Settings, ShieldAlert, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

function App() {
    const { user, logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { t } = useTranslation();
    const [view, setView] = useState<"game" | "leaderboard" | "auth" | "admin" | "feedback" | "legal" | "privacy">("game");
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [gameMode, setGameMode] = useState<"daily" | "infinity">("daily");
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const isAdmin = user?.role === 'admin';

    // Click outside handler for settings menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        }
        if (showSettings) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSettings]);

    const {
        board,
        isLoading: isGameLoading,
        error,
        cycleCell,
        setCellsBlocked,
        undo,
        reset,
        isWin,
        isSubmitted,
        formattedTime,
        changeMode,
        autoFillEnabled,
        setAutoFillEnabled
    } = useQueensGame(gameMode, isAuthenticated);

    const handleModeChange = (mode: "daily" | "infinity") => {
        setGameMode(mode);
        changeMode(mode);
        setView("game");
    };

    if (isAuthLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-medium animate-pulse">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 selection:bg-primary/20">
            {/* Header / Navigation */}
            <header className="bg-card shadow-sm border-b sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 
                            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => handleModeChange("daily")}
                        >
                            <Gamepad2 className="text-blue-600" /> Queens
                        </h1>
                        <nav className="hidden lg:flex items-center gap-1">
                            <Button 
                                variant={view === "game" && gameMode === "daily" ? "secondary" : "ghost"}
                                onClick={() => handleModeChange("daily")}
                                className="text-sm font-medium"
                            >
                                {t('header.daily')}
                            </Button>
                            <Button 
                                variant={view === "game" && gameMode === "infinity" ? "secondary" : "ghost"}
                                onClick={() => handleModeChange("infinity")}
                                className="text-sm font-medium"
                            >
                                {t('header.infinity')}
                            </Button>
                            <Button 
                                variant={view === "leaderboard" ? "secondary" : "ghost"}
                                onClick={() => setView("leaderboard")}
                                className="text-sm font-medium flex items-center gap-2"
                            >
                                <Trophy size={16} /> {t('header.leaderboard')}
                            </Button>
                            {isAuthenticated && (
                                <Button 
                                    variant={view === "feedback" ? "secondary" : "ghost"}
                                    onClick={() => setView("feedback")}
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <MessageSquare size={16} /> Feedback
                                </Button>
                            )}
                            {isAdmin && (
                                <Button 
                                    variant={view === "admin" ? "secondary" : "ghost"}
                                    onClick={() => setView("admin")}
                                    className="text-sm font-medium flex items-center gap-2 text-primary"
                                >
                                    <ShieldAlert size={16} /> Admin
                                </Button>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <LanguageSelector />
                        <ThemeSelector />

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 ml-4">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-semibold">{user.username}</span>
                                    <span className="text-xs opacity-70 font-medium">{t('header.streak')}: {user.streak}🔥</span>
                                </div>
                                <Button variant="outline" size="icon" onClick={logout} title={t('header.logout')} className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                                    <LogOut size={18} />
                                </Button>
                            </div>
                        ) : (
                            <Button variant="default" onClick={() => { setView("auth"); setAuthMode("login"); }} className="ml-4 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all">
                                {t('header.login')}
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex justify-center gap-1 py-2 bg-card border-b overflow-x-auto px-2">
                <Button variant={view === "game" && gameMode === "daily" ? "secondary" : "ghost"} size="sm" onClick={() => handleModeChange("daily")}>{t('header.daily')}</Button>
                <Button variant={view === "game" && gameMode === "infinity" ? "secondary" : "ghost"} size="sm" onClick={() => handleModeChange("infinity")}>{t('header.infinity')}</Button>
                <Button variant={view === "leaderboard" ? "secondary" : "ghost"} size="sm" onClick={() => setView("leaderboard")}>{t('header.leaderboard')}</Button>
                {isAuthenticated && (
                    <Button variant={view === "feedback" ? "secondary" : "ghost"} size="sm" onClick={() => setView("feedback")}>Feedback</Button>
                )}
                {isAdmin && (
                    <Button variant={view === "admin" ? "secondary" : "ghost"} size="sm" onClick={() => setView("admin")} className="text-primary font-bold">Admin</Button>
                )}
            </div>

            <main className="flex-grow max-w-5xl mx-auto p-4 sm:p-8 w-full">
                {view === "game" && (
                    <div className="flex flex-col items-center">
                        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
                                {gameMode === "daily" ? t('game.dailyChallenge') : t('game.infinityMode')}
                            </h2>
                            <p className="opacity-70 max-w-lg mx-auto">
                                {t('game.instructions')}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl mb-8 max-w-md text-center shadow-sm animate-in zoom-in-95">
                                {error}
                                {error.includes("Login") && (
                                    <Button variant="link" onClick={() => { setView("auth"); setAuthMode("login"); }} className="ml-2 text-destructive font-bold p-0 h-auto hover:underline cursor-pointer">
                                        {t('header.login')}
                                    </Button>
                                )}
                            </div>
                        )}

                        {isGameLoading ? (
                            <div className="flex flex-col items-center gap-4 mt-20">
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <span className="opacity-70 font-bold tracking-wider animate-pulse">{t('game.loading')}</span>
                            </div>
                        ) : board ? (
                            <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
                                <div className="flex items-center justify-between w-full max-w-md mb-8 px-4">
                                    <div className="flex items-center gap-3 bg-card px-5 py-2.5 rounded-full shadow-sm border border-foreground/5 hover:border-primary/20 transition-colors">
                                        <Clock size={18} className="text-primary animate-pulse" />
                                        <span className="font-mono text-2xl font-black tracking-tighter tabular-nums">{formattedTime}</span>
                                    </div>

                                    <div className="relative" ref={settingsRef}>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className={cn(
                                                "rounded-full shadow-sm transition-all duration-300",
                                                showSettings && "bg-accent rotate-90"
                                            )}
                                            onClick={() => setShowSettings(!showSettings)}
                                        >
                                            <Settings size={20} />
                                        </Button>

                                        {showSettings && (
                                            <div className="absolute right-0 mt-3 w-72 bg-popover text-popover-foreground border rounded-2xl shadow-2xl p-5 z-[100] animate-in fade-in slide-in-from-top-3 duration-200 ring-1 ring-black/5">
                                                <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                                                    <Settings size={18} className="text-primary" /> {t('game.settings')}
                                                </h4>
                                                <label className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-accent transition-colors">
                                                    <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                                        {t('game.autoFill')}
                                                    </span>
                                                    <div className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={autoFillEnabled}
                                                            onChange={(e) => setAutoFillEnabled(e.target.checked)}
                                                        />
                                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                                    </div>
                                                </label>
                                                <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                                                    <p className="text-xs opacity-60 leading-relaxed italic">
                                                        {t('game.autoFillDesc')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="relative perspective-1000">
                                    <div className={cn(
                                        "transition-all duration-700",
                                        isWin && "opacity-40 scale-[0.98] blur-[2px] pointer-events-none"
                                    )}>
                                        <Board
                                            board={board}
                                            onCellClick={cycleCell}
                                            onSetBlocked={setCellsBlocked}
                                            onUndo={undo}
                                            onReset={reset}
                                        />
                                    </div>
                                    
                                    {isWin && (
                                        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                                            <div className="bg-card/90 backdrop-blur border-2 border-primary/20 p-8 rounded-3xl text-center shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] animate-in zoom-in-75 duration-300 pointer-events-auto ring-1 ring-primary/10">
                                                <div className="text-6xl mb-4 drop-shadow-lg">🏆</div>
                                                <h3 className="text-3xl font-black text-primary mb-2 tracking-tight">{t('game.solved')}</h3>
                                                <p className="text-lg font-mono font-bold mb-4 opacity-70 bg-accent py-1 px-3 rounded-full inline-block">
                                                    {formattedTime}
                                                </p>
                                                {gameMode === "daily" && isSubmitted && (
                                                    <p className="text-primary/80 font-semibold italic text-sm mb-6">
                                                        {t('game.recorded')}
                                                    </p>
                                                )}
                                                {gameMode === "infinity" && (
                                                    <Button onClick={() => handleModeChange("infinity")} className="w-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
                                                        {t('game.nextPuzzle')}
                                                    </Button>
                                                )}
                                                {gameMode === "daily" && (
                                                    <Button variant="outline" onClick={() => setView("leaderboard")} className="w-full">
                                                        {t('header.leaderboard')}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                {view === "leaderboard" && (
                    <div className="mt-4">
                        <Leaderboard />
                    </div>
                )}

                {view === "feedback" && (
                    <div className="mt-4">
                        <FeedbackForm />
                    </div>
                )}

                {view === "admin" && isAdmin && (
                    <div className="mt-4">
                        <AdminPanel />
                    </div>
                )}

                {view === "legal" && (
                    <div className="mt-4">
                        <LegalNotice />
                    </div>
                )}

                {view === "privacy" && (
                    <div className="mt-4">
                        <PrivacyPolicy />
                    </div>
                )}

                {view === "auth" && !isAuthenticated && (
                    <div className="flex justify-center items-start pt-10">
                        {authMode === "login" ? (
                            <Login onToggle={() => setAuthMode("register")} />
                        ) : (
                            <Register onToggle={() => setAuthMode("login")} />
                        )}
                    </div>
                )}
                
                {view === "auth" && isAuthenticated && (
                    <div className="text-center py-20">
                        <UserIcon size={64} className="mx-auto opacity-20 mb-4" />
                        <h2 className="text-2xl font-bold">Welcome back, {user.username}!</h2>
                        <Button onClick={() => setView("game")} className="mt-6">Back to Game</Button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 px-4 border-t bg-card/50 text-center">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs font-medium opacity-60">
                    <button onClick={() => setView("legal")} className="hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">Impressum</button>
                    <button onClick={() => setView("privacy")} className="hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">Datenschutz</button>
                    <span className="opacity-30 hidden sm:inline">|</span>
                    <span>&copy; {new Date().getFullYear()} FabTheDev</span>
                </div>
            </footer>

            <CookieConsent />
        </div>
    );
}

export default App;
