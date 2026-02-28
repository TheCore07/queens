export type BoardCellInterface = {
    color: number;
    hasQueen: boolean;
    isBlocked: boolean; // Manual block by user
    isAutoBlocked?: boolean; // Automatic block by system
    isInvalid?: boolean;
    isHighlighted?: boolean;
}
