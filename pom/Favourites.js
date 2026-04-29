import { expect } from "@playwright/test";
import Details from "./Details";
import Header from "../components/Header";

export default class Favourites {
    constructor(page) {
        this.page = page;
        this.emptyGridMessage = page.locator('p[id="mensagem-vazio"]');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/favoritos.html');
    }

    async openBookCard(book) {
        await this.page
            .getByRole('img', { name: book })
        .click();
    }

    async expectBookToBeVisible(book) {
        await expect(this.page
            .locator('div.book-card')
            .locator('h3', { hasText: book })
        ).toBeVisible();
    }

    async expectBookNotToBeVisible(book) {
        await expect(this.page
            .locator('div.book-card')
            .locator('h3', { hasText: book })
        ).not.toBeVisible();
    }

    async expectGridWithBooks() {
        const bookGrid = await this.page
            .locator('div.book-card')
            .locator('h3')

        const count = await bookGrid.count();

        expect(count).toBeGreaterThan(0);

        return { count, bookGrid };
    }

    async expectOnlyFavouritedBooks() {
        const { count, bookGrid } = await this.expectGridWithBooks();

        for (let i = 0; i < count; i++) {
            await bookGrid.nth(i).click();

            const details = new Details(this.page);
            await details.expectRemoveFromFavouritesIcon();

            await this.page.goBack();
        }
    }

    async removeAllFromFavourites() {
        const details = new Details(this.page);
        const header = new Header(this.page);

        await header.openMyFavourites();

        const books = this.page.locator('div.book-card h3');

        while (await books.count() > 0) {
            await books.first().click();
            await details.removeFromFavourites();
            await details.goBackToManageBooks();
            await header.openMyFavourites();
        }
}

    async expectEmptyGridMessage() {
        const books = await this.page
            .locator('div.book-card')
            .locator('h3')

        const count = await books.count();

        expect(count).toBe(0);

        await expect(this.emptyGridMessage).toBeVisible();
    }
}