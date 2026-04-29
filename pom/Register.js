import { expect } from "@playwright/test";
import Login from "./Login";

export default class Register {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Criar Conta' });
        this.name = page.getByRole('textbox', { name: 'Nome:' });
        this.email = page.getByRole('textbox', { name: 'Email:' });
        this.password = page.getByRole('textbox', { name: 'Senha:', exact: true });
        this.confirmPassword = page.getByRole('textbox', { name: 'Confirmar Senha:' });
        this.register = page.getByRole('button', { name: 'Registrar' });

    }

    async navigateToPage() {
        await this.page.goto('http://localhost:3000/registro.html');
    }

    async registerUser(name, email, password, confirmPassword) {
        await this.name.fill(name);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.confirmPassword.fill(confirmPassword);
    }

    async expectFormToBeEmpty() {

        const fields = [
            this.name,
            this.email,
            this.password,
            this.confirmPassword
        ];

        for (this.field of fields) {
            expect(this.field).toHaveValue('');
        }
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/registro.html');
        await expect(this.header).toBeVisible();
    }
  
    async expectNonMatchingPasswordAlert() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('As senhas não coincidem!');
            await dialog.accept();
        });
    }

    async expectAccountCreatedSuccessfullyAlert() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Conta criada com sucesso!');
            await dialog.accept();
        });
    }

    async clickToRegister() {
        await this.register.click();
    }
}