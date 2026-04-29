import { expect } from "@playwright/test";
import { exec } from "node:child_process";

export default class ManageBooks {
    constructor(page) {
        this.page = page;
        this.bookName = page.getByRole('textbox', { name: 'Nome do Livro:' });
        this.author = page.getByRole('textbox', { name: 'Autor:' });
        this.pageNumber = page.getByRole('spinbutton', { name: 'Número de Páginas:' });
        this.description = page.getByRole('textbox', { name: 'Descrição:' });
        this.imgURL = page.getByRole('textbox', { name: 'URL da Imagem:' });
        this.addBook = page.getByRole('button', { name: 'Adicionar Livro' });
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/livros.html');
    }

    async fillBookForm(name, author, pages, description, img) {
        await this.bookName.fill(name);
        await this.author.fill(author);
        await this.pageNumber.fill(pages);
        await this.description.fill(description);
        await this.imgURL.fill(img);
    }

    async expectAlertMessage() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Livro adicionado com sucesso!');
            await dialog.accept();
        });
    }

    async clickToAddBook() {
        await this.addBook.click();
    }

    async expectFormToBeEmptyAfterSubmission() {
        const formFields = [
            this.bookName,
            this.author,
            this.pageNumber,
            this.description,
            this.imgURL
        ]
            
        for (const field of formFields) {
            await expect(field).toHaveValue('');
        }
    }

    async expectBookToBeAddedToAllBooks(book) {
        await expect (this.page
            .locator('div.book-card')
            .locator('h3', { hasText: book })
        ).toBeVisible();
    }

    async expectBookToNotBeAdded(book) {
        await expect (this.page
            .locator('div.book-card')
            .locator('h3', { hasText: book })
        ).not.toBeVisible();
    }

    async openBookCard(book) {
        await this.page
            .getByRole('img', { name: book })
        .click();
    }
}
