import { expect } from '@playwright/test';

export default class Login {
    constructor(page, name) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Login' });
        this.email = page.locator('input[id="email"]');
        this.password = page.locator('input[id="senha"]');
        this.login = page.locator('button[type="submit"]');
    };

    async navigateToPage() {
        await this.page.goto('http://localhost:3000/login.html');
    };

    async loginWithCredentials(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
    };

    async expectLoginSuccessfulAlertMessage() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Login realizado com sucesso!');
            await dialog.accept();
        });
    }

    async expectAlertMessage() {
         this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Email ou senha incorretos');
            await dialog.accept();
        });
    }

    async clickToLogin() {
        await this.login.click();
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/login.html');
        await expect(this.header).toBeVisible();
    };

    async expectFieldsToKeepValues(email, password) {
        expect(this.email).toHaveValue(email)
        expect(this.password).toHaveValue(password);
    };

    async clearLocalStorage() {
        await this.page.evaluate(() => localStorage.clear());
    }

    async expectLocalStorageToBeEmpty() {
        const storage = await this.page.evaluate(() => Object.keys(localStorage));
        expect(storage.length).toBe(0);
    }
};