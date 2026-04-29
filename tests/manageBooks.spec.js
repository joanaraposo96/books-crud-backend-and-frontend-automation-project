import test, { expect } from "@playwright/test";
import Login from "../pom/Login";
import Dashboard from "../pom/Dashboard";
import Header from "../components/Header";
import createBookData from "../test-data/book";
import ManageBooks from "../pom/ManageBooks";

test.describe('Manage books', () => {
    let login;
    let dashboard;
    let header;
    let manageBooks;

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);
        header = new Header(page);
        manageBooks = new ManageBooks(page);

        await login.navigateToPage();
        await login.loginWithCredentials(
            'admin@biblioteca.com',
            '123456'
        );

        await login.expectLoginSuccessfulAlertMessage();
        await login.clickToLogin();
        
        await dashboard.expectPageLoaded();

        await header.openManageBooks();

    });

    test('CT-FE-007: Adicionar Novo Livro', async ({ page }) => {
        const bookData = createBookData();

        await manageBooks.fillBookForm(
            bookData.name,
            bookData.author,
            String(bookData.pages),
            bookData.description,
            bookData.imgURL
        );

        manageBooks = new ManageBooks(page);

        await manageBooks.expectAlertMessage();
        await manageBooks.clickToAddBook();
        await manageBooks.expectFormToBeEmptyAfterSubmission();
        await manageBooks.expectBookToBeAddedToAllBooks(bookData.name);

    });

    test('CT-FE-008: Validação de Campos Obrigatórios', async ({ page }) => {

        const bookData = createBookData();

        await manageBooks.fillBookForm(
            bookData.name,
            bookData.author,
            '',
            '',
            ''
        );

        // VALIDAÇÃO: Mensagens de validação HTML5 são exibidas -> Playwright não exibe diálogo,
        // (...) pelo que validei apenas se o livro foi ou não adiconado à lista de "Todos os livros".

        await manageBooks.expectBookToNotBeAdded(bookData.name); 

    });
 });