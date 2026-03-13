import type { BoardCellInterface } from "@/interfaces/BoardCell.interface.ts";

type BoardCellProps = BoardCellInterface & {
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    onMouseUp?: () => void;
};

const COLOR_CLASSES: Record<number, string> = {
    0: "bg-cell-0",
    1: "bg-cell-1",
    2: "bg-cell-2",
    3: "bg-cell-3",
    4: "bg-cell-4",
    5: "bg-cell-5",
    6: "bg-cell-6",
    7: "bg-cell-7",
    8: "bg-cell-8",
    9: "bg-cell-9"
};

export default function BoardCell({
                                      color,
                                      hasQueen,
                                      isBlocked,
                                      isAutoBlocked,
                                      isInvalid = false,
                                      onClick,
                                      onMouseEnter,
                                      onMouseDown,
                                      onMouseUp,
                                  }: BoardCellProps) {
    return (
        <div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className={`
        w-12 h-12
        flex items-center justify-center
        cursor-pointer select-none
        ${COLOR_CLASSES[color]}
        ${isInvalid ? "ring-4 ring-destructive animate-pulse" : ""}
        hover:brightness-110
        transition-all
        border border-foreground/10
      `}
        >
            {hasQueen && <span className="text-2xl drop-shadow text-foreground">♛</span>}
            {!hasQueen && isBlocked && <span className="text-xl text-foreground font-bold">✕</span>}
            {!hasQueen && !isBlocked && isAutoBlocked && (
                <span className="text-lg opacity-30 text-foreground">✕</span>
            )}
        </div>
    );
}
