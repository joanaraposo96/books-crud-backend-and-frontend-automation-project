import { expect } from "@playwright/test";

export default class Details {
    constructor(page) {
        this.page = page;
        this.favourites = page.getByRole('button', { name: ' Adicionar aos Favoritos' });
        this.removeFavourites = page.getByRole('button', { name: 'Remover dos Favoritos' });
        this.delete = page.getByRole('button', { name: 'Deletar Livro' });
        this.back = page.getByRole('button', { name: 'Voltar' });
        this.img = (img) => page.getByRole('img', { name: `${img}`  });
        this.author = (author) => page.getByText(`Autor: ${author}`);
        this.pages = (pages) => page.getByText(`Páginas: ${pages}`);
        this.description = (description) => page.getByText(`Descrição: ${description}`);
        this.date = (date) => page.getByText(`Data de Cadastro: ${date}`);

    }

    async expectPageLoaded(bookID) {
        await expect(this.page).toHaveURL(`/detalhes.html?id=${bookID}`);
    }

    async expectAllBookInfoToBeVisible(img, author, pages, description, date) {
        const bookInfo = [
            this.img(img) ,
            this.author(author),
            this.pages(pages),
            this.description(description),
            this.date(date)
        ]

        for (const locator of bookInfo) {
            await expect(locator).toBeVisible();
        }
    }

    async expectAllButtonsToBeVisibleAndClickable() {
        const buttons = [
            this.favourites,
            this.back,
            this.delete, // Playwright does not trigger the dialog, delete is currently not possible.
        ]

        for (const locator of buttons) {
            await expect(locator).toBeVisible();
            await locator.click();

            if (locator == this.back) {
                await this.page.waitForTimeout(1000);
                await this.page.goBack();
            }
        }
    }

    async resetState() {
        if (await this.removeFavourites.isVisible()) {
            await this.removeFavourites.click();
        }
    }

    async expectButtonRemoveFromFavourites() {
        await expect(this.favourites).not.toBeVisible();
        await expect(this.removeFavourites).toBeVisible();
    }

    async expectButtonAddToFavourites() {
        await expect(this.removeFavourites).not.toBeVisible();
        await expect(this.favourites).toBeVisible();
    }

    async expectRemoveFromFavouritesIcon() {
        await expect(this.removeFavourites).toContainText('❤️');
    }

    async expectAddedToFavouritesAlert() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Adicionado aos favoritos!');
            await dialog.accept();
        });
    }

    async addToFavourites() {
        await this.favourites.click();
    }

    async expectRemoveFromFavouritesAlert() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Removido dos favoritos!');
            await dialog.accept();
        });
    }

    async removeFromFavourites() {
        this.removeFavourites.click();
    }

    async deleteBook() {
        this.page.on('dialog', async dialog => {
            console.log('Dialog:', dialog.message());

        if (dialog.message().includes('Tem certeza')) {
            await dialog.accept();
        } else if (dialog.message().includes('deletado com sucesso')) {
            await dialog.accept();
        }
    });
    
        await this.delete.click();
    }

    async cancelDelete() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Tem certeza que deseja deletar este livro?');
            await dialog.dismiss();
        });

        await this.delete.click();
    }

    async expectBookToStillExist(book) {
        await expect (this.page
            .locator('div.book-info')
            .locator('h2', { hasText: book })
        ).toBeVisible();
    }

    async goBackToManageBooks() {
        await this.back.click();
    }
}