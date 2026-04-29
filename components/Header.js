export default class Header{
    constructor(page) {
        this.page = page;
        this.dashboard = page.getByRole('link', { name: 'Dashboard' });
        this.manageBooks = page.getByRole('link', { name: 'Gerenciar Livros' });
        this.myFavourites = page.getByRole('link', { name: 'Meus Favoritos' });
        this.logout = page.getByRole('button', { name: 'Sair' });
    }

    async expectUsernameOnHeader(username) {
        const locator = this.page.getByText(`${username}`);
        expect(locator).toBeVisible();
    }
    
    async openDashboard() {
        await this.dashboard.click();
    }

    async openManageBooks() {
        await this.manageBooks.click();
    }

    async openMyFavourites() {
        await this.myFavourites.click();
    }

    async logoutFromSystem() {
        await this.logout.click();
    }
}