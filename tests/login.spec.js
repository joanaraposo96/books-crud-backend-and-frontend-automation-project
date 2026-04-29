import { expect, test } from '@playwright/test';
import Register from '../pom/Register';
import Login from '../pom/Login';
import Dashboard from '../pom/Dashboard';
import createUserData from '../test-data/user';
import Header from '../pom/Dashboard';

test.describe('Login', () => { 

    let register;
    let userData;
    let login;

    test.beforeEach(async ({ page }, test ) => {
        if (
            test.title.startsWith('CT-FE-003:') || 
            test.title.startsWith('CT-FE-004:')
        ) {

            register = new Register(page);
            login = new Login(page);

            userData = createUserData();
            
            await register.navigateToPage();
            await register.registerUser(
                userData.name, 
                userData.email, 
                userData.password, 
                userData.confirmPassword
            );

            await register.expectAccountCreatedSuccessfullyAlert();
            await register.clickToRegister();

            await login.expectPageLoaded();

        }
    });

    test('CT-FE-003: Login com Sucesso', async ({ page }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);
        
        await login.loginWithCredentials(
            userData.email,
            userData.password
        );

        
        await login.expectLoginSuccessfulAlertMessage();
        await login.clickToLogin();

        await dashboard.expectPageLoaded();
        await dashboard.expectDataToBeStoredInLocalStorage();

        await header.expectUsernameOnHeader(userData.name);

    });

    test('CT-FE-004: Login com Credenciais Inválidas', async ({ page }) => {
        const updatedUserData = {
            ...userData,
            password: "newPassword123"
            };

        await login.loginWithCredentials(
            userData.email,
            updatedUserData.password
        );
        
        await login.expectAlertMessage();
        await login.clickToLogin();
        await login.expectPageLoaded();
        await login.expectFieldsToKeepValues(userData.email, updatedUserData.password);
    });

    test('CT-FE-005: Verificar Proteção de Rotas', async ({ page }) => {
        const login = new Login(page);
        const dashboard = new Dashboard(page);

        await login.navigateToPage();

        await login.clearLocalStorage();

        await dashboard.navigateToPage();

        await login.expectPageLoaded();
    });
    
});