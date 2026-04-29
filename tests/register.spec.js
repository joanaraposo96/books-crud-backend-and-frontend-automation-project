import { test, expect } from '@playwright/test';
import Register from '../pom/Register';
import createUserData from '../test-data/user';
import Login from '../pom/Login';

test.describe('Registo', () => { 

    let register;

    test.beforeEach(async ({ page }) => {

        register = new Register(page);
        await register.navigateToPage();

    });

    test('CT-FE-001: Fluxo Completo de Registro', async ({ page }) => {

        const userData = createUserData();

        await register.registerUser(
            userData.name, 
            userData.email, 
            userData.password, 
            userData.confirmPassword
        );

        await register.expectAccountCreatedSuccessfullyAlert();
        await register.clickToRegister();

        const login = new Login(page);
        await login.expectPageLoaded();

        await register.navigateToPage();
        await register.expectFormToBeEmpty();

    });

    test('CT-FE-002: Validação de Senhas Não Correspondentes', async ({ page }) => {

        const userData = createUserData();
        const nonMatchingPassword = userData.password + 1;

        await register.registerUser(
            userData.name,
            userData.email,
            userData.password,
            nonMatchingPassword
        );

        await register.expectNonMatchingPasswordAlert();
        await register.expectPageLoaded();

    });
});