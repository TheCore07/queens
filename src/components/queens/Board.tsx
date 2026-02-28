import { Button } from "@/components/ui/button";
import type { BoardCellInterface } from "@/interfaces/BoardCell.interface";
import BoardCell from "@/components/queens/BoardCell";
import { useTranslation } from "react-i18next";
import { RotateCcw, Undo2 } from "lucide-react";

interface BoardProps {
    board: BoardCellInterface[][];
    onCellClick: (row: number, col: number) => void;
    onUndo: () => void;
    onReset: () => void;
}

export default function Board({ board, onCellClick, onUndo, onReset }: BoardProps) {
    const { t } = useTranslation();
    
    if (!board || board.length === 0) return null;

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
                className="grid gap-[1px] bg-foreground/10 border-2 border-foreground/20 rounded-xl overflow-hidden shadow-2xl"
                style={{ gridTemplateColumns: `repeat(${board.length}, 3rem)` }}
            >
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <BoardCell
                            key={`${rowIndex}-${colIndex}`}
                            {...cell}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
