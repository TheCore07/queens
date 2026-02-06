import { api } from './api';
import type {QueensBoardResponse} from "@/types/QueensBoardResponse.type.ts";

export function getBoard() {
    return api.get<QueensBoardResponse>('/game/queens');
}