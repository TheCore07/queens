import { Button } from "@/components/ui/button";
import type { BoardCellInterface } from "@/interfaces/BoardCell.interface";
import BoardCell from "@/components/queens/BoardCell";

interface BoardProps {
    board: BoardCellInterface[][];
    onCellClick: (row: number, col: number) => void;
    onUndo: () => void;
    onReset: () => void;
}

export default function Board({ board, onCellClick, onUndo, onReset }: BoardProps) {
    return (
        <div>
            <div className="flex gap-2 mb-3">
                <Button onClick={onUndo}>Undo</Button>
                <Button onClick={onReset}>Reset</Button>
            </div>

            <div
                className="grid"
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

