export interface QueensBoardResponse {
    board: {
        color: number;
        hasQueen: boolean;
    }[][];
    solution: {
        row: number;
        col: number;
        color: number;
    }[];
    isSolved?: boolean;
    userSolution?: {
        row: number;
        col: number;
        color: number;
    }[];
}
