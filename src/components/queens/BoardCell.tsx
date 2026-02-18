import type { BoardCellInterface } from "@/interfaces/BoardCell.interface.ts";

type BoardCellProps = BoardCellInterface & {
    onClick?: () => void;
};

const COLOR_CLASSES: Record<number, string> = {
    0: "bg-red-200",
    1: "bg-blue-200",
    2: "bg-green-200",
    3: "bg-yellow-200",
    4: "bg-purple-200",
    5: "bg-orange-200",
    6: "bg-amber-200",
    7: "bg-neutral-200",
    8: "bg-pink-200",
    9: "bg-cyan-200"
};

export default function BoardCell({
                                      color,
                                      hasQueen,
                                      isBlocked,
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
        ${isInvalid ? "ring-4 ring-red-500" : ""}
        hover:brightness-110
        transition
        border
      `}
        >
            {hasQueen && <span className="text-2xl drop-shadow">♛</span>}
            {!hasQueen && isBlocked && <span className="text-xl text-gray-700">✕</span>}
        </div>
    );
}
