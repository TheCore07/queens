import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { BoardCellInterface } from "@/interfaces/BoardCell.interface";
import BoardCell from "@/components/queens/BoardCell";
import { useTranslation } from "react-i18next";
import { RotateCcw, Undo2 } from "lucide-react";

interface BoardProps {
    board: BoardCellInterface[][];
    onCellClick: (row: number, col: number) => void;
    onSetBlocked: (cells: {row: number, col: number}[]) => void;
    onUndo: () => void;
    onReset: () => void;
}

export default function Board({ board, onCellClick, onSetBlocked, onUndo, onReset }: BoardProps) {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [startCell, setStartCell] = useState<{r: number, c: number} | null>(null);
    
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            setStartCell(null);
        };
        window.addEventListener("mouseup", handleGlobalMouseUp);
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }, []);

    if (!board || board.length === 0) return null;

    const handleMouseDown = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        e.preventDefault();
        setIsDragging(true);
        setStartCell({ r: rowIndex, c: colIndex });
    };

    const handleMouseEnter = (rowIndex: number, colIndex: number) => {
        if (isDragging) {
            if (startCell && (startCell.r !== rowIndex || startCell.c !== colIndex)) {
                // If it's the first move, mark both the start cell and the current cell
                onSetBlocked([
                    { row: startCell.r, col: startCell.c },
                    { row: rowIndex, col: colIndex }
                ]);
                setStartCell(null); // Clear startCell so we don't mark it again
            } else {
                // Just mark the current cell
                onSetBlocked([{ row: rowIndex, col: colIndex }]);
            }
        }
    };

    const handleMouseUp = (rowIndex: number, colIndex: number) => {
        // If we release on the SAME cell we started on AND never moved to another cell, it's a click
        if (isDragging && startCell && startCell.r === rowIndex && startCell.c === colIndex) {
            onCellClick(rowIndex, colIndex);
        }
        setIsDragging(false);
        setStartCell(null);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-3 mb-6">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onUndo}
                    className="flex items-center gap-2 px-4"
                >
                    <Undo2 size={16} />
                    {t('game.undo')}
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onReset}
                    className="flex items-center gap-2 px-4"
                >
                    <RotateCcw size={16} />
                    {t('game.reset')}
                </Button>
            </div>

            <div
                className="grid gap-[1px] bg-foreground/10 border-2 border-foreground/20 rounded-xl overflow-hidden shadow-2xl touch-none"
                style={{ gridTemplateColumns: `repeat(${board.length}, 3rem)` }}
                onMouseLeave={() => {
                    setIsDragging(false);
                    setStartCell(null);
                }}
            >
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <BoardCell
                            key={`${rowIndex}-${colIndex}`}
                            {...cell}
                            onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
