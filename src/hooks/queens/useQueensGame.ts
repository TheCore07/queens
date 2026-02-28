import { useEffect, useState, useCallback, useRef } from "react";
import { getDailyBoard, getInfinityBoard, submitDailyBoard, submitInfinityBoard } from "@/api/Game";
import type { BoardCellInterface } from "@/interfaces/BoardCell.interface.ts";
import type { SolutionInterface } from "@/interfaces/Solution.interface.ts";
import { getCookie, safeSetCookie } from "@/lib/cookieUtils";

type GameMode = "daily" | "infinity";

const AUTO_FILL_COOKIE = "auto-fill";

export function useQueensGame(initialMode: GameMode = "daily", isAuthenticated: boolean = false) {
    const [board, setBoard] = useState<BoardCellInterface[][]>();
    const [solution, setSolution] = useState<SolutionInterface[]>([]);
    const [history, setHistory] = useState<BoardCellInterface[][][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<GameMode>(initialMode);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [autoFillEnabled, setAutoFillEnabled] = useState(() => {
        const saved = getCookie(AUTO_FILL_COOKIE);
        return saved === "true";
    });
    
    const timerRef = useRef<number | null>(null);

    const loadGame = useCallback(async (selectedMode: GameMode) => {
        setIsLoading(true);
        setError(null);
        setIsSubmitted(false);
        setIsWon(false);
        setElapsedTime(0);
        
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }

        try {
            const response = selectedMode === "daily" 
                ? await getDailyBoard() 
                : await getInfinityBoard();

            if (!response.data || !response.data.board) {
                throw new Error("Invalid board data received");
            }

            const data = response.data;
            const b = data.board.map((row: any[], ri: number) =>
                row.map((cell: any, ci: number) => {
                    const isUserQueen = data.isSolved && data.userSolution?.some(
                        (sq: any) => sq.row === ri && sq.col === ci
                    );

                    return {
                        ...cell,
                        isBlocked: false,
                        isAutoBlocked: false,
                        isInvalid: false,
                        hasQueen: isUserQueen || false,
                    };
                })
            );

            setBoard(b);
            setSolution(data.solution || []);
            setHistory([]);
            
            if (data.isSolved) {
                setIsWon(true);
                setIsSubmitted(true);
            }
            
        } catch (err: any) {
            console.error("Game load error:", err);
            setError(err.response?.data?.message || err.message || "Failed to load game");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading && !isWon && !isSubmitted && !error && board) {
            if (timerRef.current !== null) window.clearInterval(timerRef.current);
            
            timerRef.current = window.setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current !== null) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current !== null) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isLoading, isWon, isSubmitted, error, board]);

    useEffect(() => {
        loadGame(mode);
    }, [mode, loadGame]);

    function changeMode(newMode: GameMode) {
        if (newMode === mode) {
            loadGame(newMode); 
        } else {
            setMode(newMode);
        }
    }

    const calculateAutoBlocks = useCallback((currentBoard: BoardCellInterface[][]) => {
        if (!autoFillEnabled) {
            return currentBoard.map(row => row.map(cell => ({ ...cell, isAutoBlocked: false })));
        }

        const size = currentBoard.length;
        const newBoard = currentBoard.map(row => row.map(cell => ({ ...cell, isAutoBlocked: false })));

        const queens: {r: number, c: number, color: number}[] = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (newBoard[r][c].hasQueen) {
                    queens.push({r, c, color: newBoard[r][c].color});
                }
            }
        }

        for (const q of queens) {
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (r === q.r && c === q.c) continue;

                    let shouldBlock = false;
                    if (r === q.r) shouldBlock = true;
                    if (c === q.c) shouldBlock = true;
                    if (newBoard[r][c].color === q.color) shouldBlock = true;
                    if (Math.abs(r - q.r) <= 1 && Math.abs(c - q.c) <= 1) shouldBlock = true;

                    if (shouldBlock && !newBoard[r][c].hasQueen) {
                        newBoard[r][c].isAutoBlocked = true;
                    }
                }
            }
        }
        return newBoard;
    }, [autoFillEnabled]);

    const validateBoard = useCallback((current: BoardCellInterface[][]) => {
        const size = current.length;
        const copy = current.map((r) =>
            r.map((c) => ({ ...c, isInvalid: false }))
        );

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!copy[r][c].hasQueen) continue;

                for (let rr = 0; rr < size; rr++) {
                    for (let cc = 0; cc < size; cc++) {
                        if (rr === r && cc === c) continue;
                        if (!copy[rr][cc].hasQueen) continue;

                        if (r === rr || c === cc || (Math.abs(r - rr) <= 1 && Math.abs(c - cc) <= 1) || copy[r][c].color === copy[rr][cc].color) {
                            copy[r][c].isInvalid = true;
                            copy[rr][cc].isInvalid = true;
                        }
                    }
                }
            }
        }
        return copy;
    }, []);

    const checkWinCondition = useCallback(async (currentBoard: BoardCellInterface[][]) => {
        if (!currentBoard || solution.length === 0 || isWon) return;

        const placedQueens: { row: number; col: number; color: number }[] = [];
        let anyInvalid = false;

        for (let r = 0; r < currentBoard.length; r++) {
            for (let c = 0; c < currentBoard[r].length; c++) {
                if (currentBoard[r][c].hasQueen) {
                    if (currentBoard[r][c].isInvalid) anyInvalid = true;
                    placedQueens.push({ row: r, col: c, color: currentBoard[r][c].color });
                }
            }
        }

        if (!anyInvalid && placedQueens.length === solution.length) {
            setIsWon(true);
            
            // Only submit if user is authenticated
            if (!isSubmitted && isAuthenticated) {
                setIsSubmitted(true);
                try {
                    if (mode === "daily") {
                        await submitDailyBoard(placedQueens, elapsedTime);
                    } else {
                        await submitInfinityBoard(placedQueens, elapsedTime);
                    }
                } catch (err) {
                    console.error("Submission error:", err);
                }
            }
        }
    }, [mode, solution, isSubmitted, elapsedTime, isWon, isAuthenticated]);

    function cycleCell(row: number, col: number) {
        if (!board || isWon || isSubmitted) return;

        const newBoard = board.map((r, ri) =>
            r.map((cell, ci) => {
                if (ri !== row || ci !== col) return cell;
                if (!cell.hasQueen && !cell.isBlocked)
                    return { ...cell, isBlocked: true, hasQueen: false, isAutoBlocked: false };
                if (cell.isBlocked)
                    return { ...cell, isBlocked: false, hasQueen: true, isAutoBlocked: false };
                return { ...cell, hasQueen: false, isBlocked: false, isAutoBlocked: false };
            })
        );

        setHistory((h) => [...h, board]);
        const withAutoBlocks = calculateAutoBlocks(newBoard);
        const validated = validateBoard(withAutoBlocks);
        setBoard(validated);
        checkWinCondition(validated);
    }

    useEffect(() => {
        if (board) {
            const updated = calculateAutoBlocks(board);
            setBoard(validateBoard(updated));
        }
        safeSetCookie(AUTO_FILL_COOKIE, String(autoFillEnabled));
    }, [autoFillEnabled, calculateAutoBlocks, validateBoard]);

    function undo() {
        if (history.length === 0 || isWon || isSubmitted) return;
        const last = history[history.length - 1];
        setHistory((h) => h.slice(0, h.length - 1));
        const recalculated = calculateAutoBlocks(last);
        setBoard(validateBoard(recalculated));
    }

    function reset() {
        if (!board || isWon || isSubmitted) return;
        const cleared = board.map((r) =>
            r.map((cell) => ({
                ...cell,
                hasQueen: false,
                isBlocked: false,
                isAutoBlocked: false,
                isInvalid: false,
            }))
        );
        setBoard(cleared);
        setHistory([]);
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        board,
        isLoading,
        error,
        cycleCell,
        undo,
        reset,
        isWin: isWon,
        isSubmitted,
        elapsedTime,
        formattedTime: formatTime(elapsedTime),
        reload: () => loadGame(mode),
        changeMode,
        mode,
        autoFillEnabled,
        setAutoFillEnabled
    };
}
