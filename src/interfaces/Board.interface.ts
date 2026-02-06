import type {BoardCellInterface} from "@/interfaces/BoardCell.interface.ts";
import type {SolutionInterface} from "@/interfaces/Solution.interface.ts";

export interface BoardInterface {
    board: BoardCellInterface[][];
    solution: SolutionInterface[];
}