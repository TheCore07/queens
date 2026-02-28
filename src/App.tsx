import { useState } from "react";
import { Button } from "@/components/ui/button";
import Board from "@/components/queens/Board";
import { useQueensGame } from "@/hooks/queens/useQueensGame";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Leaderboard from "@/components/Leaderboard";
import AdminPanel from "@/components/AdminPanel";
import ThemeSelector from "@/components/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";
import CookieConsent from "@/components/CookieConsent";
import { useTranslation } from "react-i18next";
import { LogOut, Trophy, Gamepad2, User as UserIcon, Clock, Settings, ShieldAlert } from "lucide-react";

function App() {
    const { user, logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { t } = useTranslation();
    const [view, setView] = useState<"game" | "leaderboard" | "auth" | "admin">("game");
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [gameMode, setGameMode] = useState<"daily" | "infinity">("daily");
    const [showSettings, setShowSettings] = useState(false);

    const isAdmin = user?.role === 'admin';

    const {
        board,
        isLoading: isGameLoading,
        error,
        cycleCell,
        undo,
        reset,
        isWin,
        isSubmitted,
        formattedTime,
        changeMode,
        autoFillEnabled,
        setAutoFillEnabled
    } = useQueensGame(gameMode);

    const handleModeChange = (mode: "daily" | "infinity") => {
        setGameMode(mode);
        changeMode(mode);
        setView("game");
    };

    if (isAuthLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header / Navigation */}
            <header className="bg-card shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                            <Gamepad2 className="text-blue-600" /> Queens
                        </h1>
                        <nav className="hidden md:flex items-center gap-1">
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
                                    <span className="text-xs opacity-70">{t('header.streak')}: {user.streak}🔥</span>
                                </div>
                                <Button variant="outline" size="icon" onClick={logout} title={t('header.logout')} className="rounded-full">
                                    <LogOut size={18} />
                                </Button>
                            </div>
                        ) : (
                            <Button variant="default" onClick={() => { setView("auth"); setAuthMode("login"); }} className="ml-4">
                                {t('header.login')}
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className="md:hidden flex justify-center gap-4 py-2 bg-card border-b overflow-x-auto">
                <Button variant="ghost" size="sm" onClick={() => handleModeChange("daily")}>{t('header.daily')}</Button>
                <Button variant="ghost" size="sm" onClick={() => handleModeChange("infinity")}>{t('header.infinity')}</Button>
                <Button variant="ghost" size="sm" onClick={() => setView("leaderboard")}>{t('header.leaderboard')}</Button>
                {isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => setView("admin")} className="text-primary font-bold">Admin</Button>
                )}
            </div>

            <main className="max-w-5xl mx-auto p-4 sm:p-8">
                {view === "game" && (
                    <div className="flex flex-col items-center">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold mb-2">
                                {gameMode === "daily" ? t('game.dailyChallenge') : t('game.infinityMode')}
                            </h2>
                            <p className="opacity-70">
                                {t('game.instructions')}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 max-w-md text-center">
                                {error}
                                {error.includes("Login") && (
                                    <Button variant="link" onClick={() => { setView("auth"); setAuthMode("login"); }} className="ml-2 text-destructive font-bold p-0">
                                        {t('header.login')}
                                    </Button>
                                )}
                            </div>
                        )}

                        {isGameLoading ? (
                            <div className="flex flex-col items-center gap-4 mt-20">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <span className="opacity-70 font-medium">{t('game.loading')}</span>
                            </div>
                        ) : board ? (
                            <div className="flex flex-col items-center w-full">
                                <div className="flex items-center justify-between w-full max-w-md mb-6 px-4">
                                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border">
                                        <Clock size={16} className="text-primary" />
                                        <span className="font-mono text-xl font-bold">{formattedTime}</span>
                                    </div>

                                    <div className="relative">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="rounded-full"
                                            onClick={() => setShowSettings(!showSettings)}
                                        >
                                            <Settings size={20} className={showSettings ? "animate-spin-slow" : ""} />
                                        </Button>

                                        {showSettings && (
                                            <div className="absolute right-0 mt-2 w-64 bg-popover text-popover-foreground border rounded-xl shadow-xl p-4 z-20 animate-in fade-in slide-in-from-top-2">
                                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                                    <Settings size={16} /> {t('game.settings')}
                                                </h4>
                                                <label className="flex items-center justify-between cursor-pointer group">
                                                    <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                                        {t('game.autoFill')}
                                                    </span>
                                                    <div className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={autoFillEnabled}
                                                            onChange={(e) => setAutoFillEnabled(e.target.checked)}
                                                        />
                                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>
                                                <p className="text-[10px] opacity-50 mt-2 leading-tight">
                                                    {t('game.autoFillDesc')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <Board
                                        board={board}
                                        onCellClick={cycleCell}
                                        onUndo={undo}
                                        onReset={reset}
                                    />
                                    
                                    {isWin && (
                                    <div className="mt-8 bg-primary/10 border border-primary/20 p-6 rounded-xl text-center animate-bounce shadow-xl">
                                        <div className="text-4xl mb-2">🎉</div>
                                        <h3 className="text-2xl font-bold text-primary">{t('game.solved')}</h3>
                                        {gameMode === "daily" && isSubmitted && (
                                            <p className="text-primary mt-1 font-medium italic">
                                                {t('game.recorded')}
                                            </p>
                                        )}
                                        {gameMode === "infinity" && (
                                            <Button onClick={() => handleModeChange("infinity")} className="mt-4">
                                                {t('game.nextPuzzle')}
                                            </Button>
                                        )}
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

                {view === "admin" && isAdmin && (
                    <div className="mt-4">
                        <AdminPanel />
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
            <CookieConsent />
        </div>
    );
}

export default App;
