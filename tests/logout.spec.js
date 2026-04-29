import test from "@playwright/test";
import Login from "../pom/Login";
import Dashboard from "../pom/Dashboard";
import Header from "../components/Header";

test.describe('Logout', () => { 

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

    test('CT-FE-016: Logout do Sistema', async ({ page }) => {
        const header = new Header(page);

        await header.logoutFromSystem();

        await login.expectPageLoaded();

        await login.expectLocalStorageToBeEmpty();

        await dashboard.navigateToPage();

        await login.expectPageLoaded();
    });
});