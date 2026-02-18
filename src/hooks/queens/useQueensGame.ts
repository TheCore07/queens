import { useEffect, useState } from "react";
import { getDailyBoard, getInfinityBoard } from "@/api/Game";
import type { BoardCellInterface } from "@/interfaces/BoardCell.interface.ts";

type GameMode = "daily" | "infinity";

export function useQueensGame(initialMode: GameMode = "daily") {
    const [board, setBoard] = useState<BoardCellInterface[][]>();
    const [solution, setSolution] = useState<{ row: number; col: number }[]>([]);
    const [history, setHistory] = useState<BoardCellInterface[][][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<GameMode>(initialMode);

    useEffect(() => {
        loadGame(mode);
    }, [mode]);

    async function loadGame(selectedMode: GameMode) {
        setIsLoading(true);

        try {
            let response;

            if (selectedMode === "daily") {
                response = await getDailyBoard();
            } else {
                response = await getInfinityBoard();
            }

            const b = response.data.board.map((row: any[]) =>
                row.map((cell: any) => ({
                    ...cell,
                    isBlocked: false,
                    isInvalid: false,
                    hasQueen: false,
                }))
            );

            setBoard(b);
            setSolution(response.data.solution);
            setHistory([]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    function changeMode(newMode: GameMode) {
        setMode(newMode);
    }

    // dein restlicher Code bleibt gleich
    function cycleCell(row: number, col: number) {
        if (!board) return;

        const newBoard = board.map((r, ri) =>
            r.map((cell, ci) => {
                if (ri !== row || ci !== col) return cell;

                if (!cell.hasQueen && !cell.isBlocked)
                    return { ...cell, isBlocked: true, isInvalid: false };

                if (cell.isBlocked)
                    return { ...cell, isBlocked: false, hasQueen: true, isInvalid: false };

                return { ...cell, hasQueen: false, isInvalid: false };
            })
        );

        setHistory((h) => [...h, board]);
        setBoard(validateBoard(newBoard));
    }

    function validateBoard(current: BoardCellInterface[][]) {
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

                        if (
                            r === rr ||
                            c === cc ||
                            Math.abs(r - rr) === Math.abs(c - cc)
                        ) {
                            copy[r][c].isInvalid = true;
                            copy[rr][cc].isInvalid = true;
                        }
                    }
                }
            }
        }

        return copy;
    }

    function undo() {
        if (history.length === 0) return;
        const last = history[history.length - 1];
        setHistory((h) => h.slice(0, h.length - 1));
        setBoard(last);
    }

    function reset() {
        if (!board) return;

        const cleared = board.map((r) =>
            r.map((cell) => ({
                ...cell,
                hasQueen: false,
                isBlocked: false,
                isInvalid: false,
            }))
        );

        setBoard(cleared);
        setHistory([]);
    }

    function isWin(): boolean {
        if (!board) return false;

        for (const { row, col } of solution) {
            if (!board[row][col].hasQueen) return false;
        }

        return board.every((row) =>
            row.every((cell) => !cell.isInvalid)
        );
    }

    return {
        board,
        isLoading,
        cycleCell,
        undo,
        reset,
        isWin,
        reload: () => loadGame(mode),
        changeMode,
        mode,
    };
}
