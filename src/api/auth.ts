import { api } from './api';

export async function login(data: any) {
    return api.post('/auth/login', data);
}

export async function register(data: any) {
    return api.post('/auth/register', data);
}

export async function logout() {
    return api.post('/auth/logout');
}

export async function getMe() {
    return api.get('/auth/me');
}

export async function refreshTokens() {
    return api.post('/auth/refresh');
}
