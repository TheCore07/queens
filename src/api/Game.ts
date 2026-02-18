import { api } from './api';
import type {QueensBoardResponse} from "@/types/QueensBoardResponse.type.ts";

export function getDailyBoard() {
    return api.get<QueensBoardResponse>('/game/daily');
}

export function getInfinityBoard() {
    return api.get<QueensBoardResponse>('/game/infinity');
}