import { expect } from '@playwright/test';
import { exec } from 'node:child_process';

export default class Dashboard {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Minha Biblioteca' });
        this.totalBooksHeader = page.getByRole('heading', { name: 'Total de Livros' });
        this.totalPagesHeader = page.getByRole('heading', { name: 'Total de Páginas' });
        this.totalUsersHeader = page.getByRole('heading', { name: 'Usuários Cadastrados' });
        this.recentBooksGrid = page.locator('#livros-recentes');
    }

    async navigateToPage() {
        await this.page.goto('http://localhost:3000/dashboard.html');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/dashboard.html');
    }

    async expectUsernameOnHeader(username) {
        const locator = this.page.getByText(`${username}`);
        expect(locator).toBeVisible();
    }

    async expectStatisticsToBeVisible() {
        expect(this.totalBooksHeader).toBeVisible();
        expect(this.totalPagesHeader).toBeVisible();
        expect(this.totalUsersHeader).toBeVisible();
    }

    async expectNumbersToBeFormated() {
        const list = await this.page
            .locator('div[class="numbers"]')
            .allTextContents();

        for (const element of list) {
            const value = Number(element)

            expect(value).toBeGreaterThanOrEqual(0);

            if (value <= 999) {
                expect(text).toMatch(/^\d+$/);
            }

            else {
                expect(text).toMatch(/^\d{1,3}([.,]\d{3})+$/);
            }
        }
    }

    async expectBookGridToBeVisible() {
        await expect(this.recentBooksGrid).toBeVisible();
    }

    async expectMax5BooksToBeVisible() {
        const totalBooksText = await this.page
            .locator('.stat-card', { hasText: 'Total de Livros' })
            .locator('.number').textContent();

        const totalBooks = Number(totalBooksText);

        const visibleBooks = await this.page
            .locator('div.book-card:visible')
            .count();
        
        await expect(visibleBooks).toBeLessThanOrEqual(5);

        if (totalBooks > 5) {
            await expect(visibleBooks).toBe(5);
        }
    }

    async ImgNameAuthor() {

        const visibleBooks = await this.page
            .locator('div.book-card:visible')
            .count();

        const img = this.page
            .locator('div.book-card:visible img');

        for (book of visibleBooks) {
            await expect(img).toBeVisible();
        }
    }

    async openManageBooks() {
        await this.manageBooks.click();

    }

    async expectDataToBeStoredInLocalStorage() {

        const key = await this.page.evaluate(() => {
            return Object.keys(localStorage);
        });

        console.log(key); // OUTPUT: ['usuario'] -> Object

        const usuario = await this.page.evaluate(() => {
            return JSON.parse(localStorage.getItem('usuario'));
        });

        console.log(usuario); // OUTPUT ['id: ...', 'nome:...', 'email:...'] -> Properties of object 'usuario'

        expect(usuario.id).toBeTruthy();
        expect(usuario.nome).toBeTruthy();
        expect(usuario.email).toBeTruthy();
    }
}