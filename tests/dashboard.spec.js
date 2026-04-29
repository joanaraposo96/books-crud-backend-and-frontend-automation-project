import test from "@playwright/test";
import Dashboard from "../pom/Dashboard";
import Login from "../pom/Login";
import Header from "../components/Header";
import ManageBooks from "../pom/ManageBooks";
import Favourites from "../pom/Favourites";

test.describe('Dashboard', () => {
    let login;
    let dashboard;

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);

        await login.navigateToPage();
        await login.loginWithCredentials(
            'admin@biblioteca.com',
            '123456'
        );

        await login.expectLoginSuccessfulAlertMessage();
        await login.clickToLogin();

        await dashboard.expectPageLoaded(); 
    });

    test('CT-FE-006: Visualizar Dashboard com Estatísticas', async ({ page }) => {
        await dashboard.expectStatisticsToBeVisible();
        await dashboard.expectNumbersToBeFormated();
        await dashboard.expectBookGridToBeVisible();
        await dashboard.expectMax5BooksToBeVisible();
    });

    test('CT-FE-009: Navegação Entre Páginas', async ({ page }) => {
        const header = new Header(page);
        const manageBooks = new ManageBooks(page);
        const myFavourites = new Favourites(page);

        await header.openManageBooks();
        await manageBooks.expectPageLoaded();

        await header.openMyFavourites();
        await myFavourites.expectPageLoaded();

    });
});