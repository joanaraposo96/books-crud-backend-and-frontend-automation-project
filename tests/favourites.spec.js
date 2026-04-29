import test from "@playwright/test";
import Login from "../pom/Login";
import Dashboard from "../pom/Dashboard";
import Details from "../pom/Details";
import ManageBooks from "../pom/ManageBooks";
import getApiBook from "../test-data/apiBook";
import Favourites from "../pom/Favourites";
import Header from "../components/Header";

test.describe('Favourites', () => {
    let login;
    let dashboard;
    let manageBooks;
    let details;
    let book;
    let favourites;
    let header;

    test.beforeEach(async ({ page, request }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);
        manageBooks = new ManageBooks(page);
        details = new Details(page);

        await login.navigateToPage();
        await login.loginWithCredentials(
            'admin@biblioteca.com',
            '123456'
        );

        await login.expectLoginSuccessfulAlertMessage();
        await login.clickToLogin();

        await dashboard.expectPageLoaded(); 

        book = await getApiBook(request);

        await manageBooks.openBookCard(book.nome);

        await details.expectAddedToFavouritesAlert();
        await details.addToFavourites();

    });

    test.afterEach(async ({ page }, test) => {
        if (test.title.startsWith('CT-FE-011:')) {
            favourites = new Favourites(page);
            details = new Details(page);

            await favourites.openBookCard(book.nome);
            await details.resetState();
        }
    });
 
 
    test('CT-FE-011: Adicionar Livro aos Favoritos', async ({ page }) => {
        favourites = new Favourites(page);
        header = new Header(page);

        await details.expectButtonRemoveFromFavourites();
        await details.expectRemoveFromFavouritesIcon();

        await header.openMyFavourites();

        await favourites.expectBookToBeVisible(book.nome);
    });

    test('CT-FE-012: Remover Livro dos Favoritos', async ({ page }) => {

        await details.expectRemoveFromFavouritesAlert();
        await details.removeFromFavourites();
        await details.expectButtonAddToFavourites();

        header = new Header(page); // Reinstanciamos o Page Object para refletir o novo estado da página após a remoção do livro dos favoritos.
        await header.openMyFavourites(); 
        
        favourites = new Favourites(page); // Reinstanciamos o Page Object para refletir o novo estado da página após a remoção do livro dos favoritos.
        await favourites.expectBookNotToBeVisible(book.nome);
    });

    test('CT-FE-013: Listar Livros Favoritos', async ({ page }) => {
        header = new Header(page);
        await header.openMyFavourites();

        favourites = new Favourites(page);
        await favourites.expectGridWithBooks();
        await favourites.expectOnlyFavouritedBooks();
        await favourites.removeAllFromFavourites();
        await favourites.expectEmptyGridMessage();
        
    });
});
