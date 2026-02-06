export type BoardCellInterface = {
    color: number;
    hasQueen: boolean;
    isBlocked: boolean;
    isInvalid?: boolean; // für Regelprüfung
    isHighlighted?: boolean; // optional Highlight
}