import { api } from './api';
import type { QueensBoardResponse } from "@/types/QueensBoardResponse.type.ts";

export const getDailyBoard = () => {
    return api.get<QueensBoardResponse>('/game/daily');
};

export const getInfinityBoard = () => {
    return api.get<QueensBoardResponse>('/game/infinity');
};

export const submitDailyBoard = (solution: { row: number, col: number, color: number }[], timeInSeconds: number) => {
    return api.post('/game/daily/submit', {
        solution,
        timeInSeconds
    });
};

export const submitInfinityBoard = (solution: { row: number, col: number, color: number }[], timeInSeconds: number) => {
    return api.post('/game/infinity/submit', {
        solution,
        timeInSeconds
    });
};

export const getLeaderboard = (date?: string) => {
    return api.get('/game/leaderboard', {
        params: { date }
    });
};

export const getInfinityLeaderboard = () => {
    return api.get('/game/leaderboard/infinity');
};

export const triggerDailyGeneration = () => {
    return api.post('/game/daily/generate');
};
