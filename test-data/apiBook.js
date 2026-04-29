import { request } from '@playwright/test';

export default async function getApiBook(request) {
    const response = await request.get('/livros');
    const body = await response.json();

    return body[0];
}
