import axios from 'axios';

// Русский коммент: Базовый клиент. Потом добавим перехватчики для токенов Firebase.
export const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
});
