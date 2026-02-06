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
}
