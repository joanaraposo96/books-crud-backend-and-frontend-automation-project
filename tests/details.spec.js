import test from "@playwright/test";
import ManageBooks from "../pom/ManageBooks";
import Login from "../pom/Login";
import Dashboard from "../pom/Dashboard";
import Header from "../components/Header";
import Details from "../pom/Details";
import Favourites from "../pom/Favourites";
import formatDateToUI from "../test-data/date";
import getApiBook from "../test-data/apiBook";
import { de_AT } from "@faker-js/faker";

test.describe('Details', () => {
    let login;
    let dashboard;
    let manageBooks;
    let header;
    let details;
    let book;

    test.beforeEach(async ({ page, request }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);
        manageBooks = new ManageBooks(page);
        header = new Header(page);
        details = new Details(page);

        await login.navigateToPage();
        await login.loginWithCredentials(
            'admin@biblioteca.com',
            '123456'
        );

        await login.expectLoginSuccessfulAlertMessage();
        await login.clickToLogin();

        await dashboard.expectPageLoaded(); 

        await header.openManageBooks();

        book = await getApiBook(request);

        await manageBooks.expectPageLoaded();
        await manageBooks.openBookCard(book.nome);

        await details.expectPageLoaded(book.id);

    });

    test.afterEach(async ({ page }, test) => {
        if (test.title.startsWith('CT-FE-010:')) {
            await details.resetState();
        }
    });

    test('CT-FE-010: Visualizar Detalhes de Livro', async ({ page }) => {
        const date = formatDateToUI(book.dataCadastro);

        await details.expectAllBookInfoToBeVisible(book.nome, book.autor, book.paginas, book.descricao, date);

        await details.expectAllButtonsToBeVisibleAndClickable();

    });

    test('CT-FE-014: Deletar Livro com Confirmação', async ({ page}) => {
        await details.deleteBook();

        manageBooks = new ManageBooks (page);

        await manageBooks.expectPageLoaded();
        await manageBooks.expectBookToNotBeAdded(book);
    });

    test('CT-FE-015: Cancelar Deleção de Livro', async ({ page }) => {
        await details.cancelDelete();
        await details.expectPageLoaded(book.id);
        await details.expectBookToStillExist(book.nome);
    });

});