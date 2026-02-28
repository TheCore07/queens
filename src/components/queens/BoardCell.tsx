import type { BoardCellInterface } from "@/interfaces/BoardCell.interface.ts";

type BoardCellProps = BoardCellInterface & {
    onClick?: () => void;
};

const COLOR_CLASSES: Record<number, string> = {
    0: "bg-red-300 dark:bg-red-900/50",
    1: "bg-blue-300 dark:bg-blue-900/50",
    2: "bg-green-300 dark:bg-green-900/50",
    3: "bg-yellow-300 dark:bg-yellow-900/50",
    4: "bg-purple-300 dark:bg-purple-900/50",
    5: "bg-orange-300 dark:bg-orange-900/50",
    6: "bg-amber-300 dark:bg-amber-900/50",
    7: "bg-neutral-300 dark:bg-neutral-900/50",
    8: "bg-pink-300 dark:bg-pink-900/50",
    9: "bg-cyan-300 dark:bg-cyan-900/50"
};

export default function BoardCell({
                                      color,
                                      hasQueen,
                                      isBlocked,
                                      isAutoBlocked,
                                      isInvalid = false,
                                      onClick,
                                  }: BoardCellProps) {
    return (
        <div
            onClick={onClick}
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
