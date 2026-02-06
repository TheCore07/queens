import {useEffect, useState} from "react";
import type {BoardCellInterface} from "@/interfaces/BoardCell.interface.ts";
import {getBoard} from "@/api/Game.ts";
import BoardCell from "@/components/queens/BoardCell.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function Board() {
    const [board, setBoard] = useState<BoardCellInterface[][]>();
    const [solution, setSolution] = useState<{ row: number; col: number }[]>([]);
    const [history, setHistory] = useState<BoardCellInterface[][][]>([]);

// --- Laden des Boards ---
    useEffect(() => {
        getBoard()
            .then((response) => {
                const b = response.data.board.map((row) =>
                    row.map((cell) => ({...cell, isBlocked: false, isInvalid: false}))
                );
                setBoard(b);
                setSolution(response.data.solution.map(({row, col}) => ({row, col})));
                setHistory([]);
            })
            .catch(console.error);
    }, []);

// --- Klick-Zyklus: leer -> X -> Queen -> leer ---
    function cycleCell(row: number, col: number) {
        if (!board) return;

        const newBoard = board.map((r, ri) =>
            r.map((cell, ci) => {
                if (ri !== row || ci !== col) return cell;
                if (!cell.hasQueen && !cell.isBlocked) return {...cell, isBlocked: true, isInvalid: false};
                if (cell.isBlocked) return {...cell, isBlocked: false, hasQueen: true, isInvalid: false};
                return {...cell, hasQueen: false, isInvalid: false};
            })
        );

        setHistory((h) => [...h, board]); // undo support
        setBoard(validateBoard(newBoard));
    }

// --- Board validieren: Konflikte markieren ---
    function validateBoard(current: BoardCellInterface[][]): BoardCellInterface[][] {
        const size = current.length;
        const copy = current.map((r) => r.map((c) => ({...c, isInvalid: false})));

        // Suche Konflikte
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!copy[r][c].hasQueen) continue;

                for (let rr = 0; rr < size; rr++) {
                    for (let cc = 0; cc < size; cc++) {
                        if (rr === r && cc === c) continue;
                        if (!copy[rr][cc].hasQueen) continue;
                        // gleiche Reihe, Spalte oder Diagonale?
                        if (r === rr || c === cc || Math.abs(r - rr) === Math.abs(c - cc)) {
                            copy[r][c].isInvalid = true;
                            copy[rr][cc].isInvalid = true;
                        }
                    }
                }
            }
        }

        return copy;
    }

// --- Undo ---
    function undo() {
        if (history.length === 0) return;
        const last = history[history.length - 1];
        setHistory((h) => h.slice(0, h.length - 1));
        setBoard(last);
    }

// --- Reset ---
    function reset() {
        if (!board) return;
        const cleared = board.map((r) =>
            r.map((cell) => ({...cell, hasQueen: false, isBlocked: false, isInvalid: false}))
        );
        setBoard(cleared);
        setHistory([]);
    }

// --- Win-Check ---
    function isWin(): boolean {
        if (!board) return false;
        for (const {row, col} of solution) {
            if (!board[row][col].hasQueen) return false;
        }
        // Alle Konflikte weg?
        return board.every((row) => row.every((cell) => !cell.isInvalid));
    }

    return (
        {board && (
            <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${board.length}, 3rem)` }}
            >
                <Button onClick={undo}>Undo</Button>
                <Button onClick={reset}>Reset</Button>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <BoardCell
                            key={`${rowIndex}-${colIndex}`}
                            {...cell}
                            onClick={() => cycleCell(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        )}

        {isWin() && <div className="mt-4 text-green-600 text-xl font-bold">🎉 Du hast gewonnen!</div>}
    )

}