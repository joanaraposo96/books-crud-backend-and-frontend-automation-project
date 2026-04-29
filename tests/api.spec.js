import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';

test.describe('Books API', () => { 

    let userData; // REQUEST body
    let registeredUser; // RESPONSE body
    let bookData; // REQUEST body
    let registeredBook; // RESPONSE body
    let favouriteBookData; // REQUEST body
    let registeredfavouriteBook; // RESPONSE body

    function createUserData() {
        return {
            nome: faker.internet.username(),
            email: faker.internet.email(),
            senha: faker.internet.password()
        };
    };

    async function registerUser(request, account) {
        const response = await request.post('/registro', { data: account });
        const body = await response.json();

        expect(response.status()).toBe(201);

        return body;
    };

    function createBookData() {
        return {
            nome: faker.book.title(),
            autor: faker.book.author(),
            paginas: faker.number.int({ min: 80, max: 600 }),
            descricao: faker.lorem.paragraph(),
            imagemUrl: faker.image.url({ category: 'book' })
        };
    };

    async function registerBook(request, book) {
        const response = await request.post('/livros', { data: book});
        const body = await response.json();

        expect(response.status()).toBe(201);

        return body
    };

    function createFavouriteBookData() {
        return {
            usuarioId: registeredUser.usuario.id, 
            livroId: registeredBook.id
        }
    };

    async function registerFavouriteBook(request, book) {
        const response = await request.post('/favoritos', { data: book });
        const body = await response.json();

        expect(response.status()).toBe(201);

        return body
    }


    test.describe('User', () => {

        test.beforeEach(async ({ request }) => {
            userData = createUserData();
            registeredUser = await registerUser(request, userData);
        });

        test('Register a new user', async ({ request }) => {
            const responseBody = registeredUser;

            expect(responseBody.mensagem).toBe('Usuário criado com sucesso');
            expect(responseBody).toHaveProperty('usuario');

            expect(responseBody.usuario).toHaveProperty('id');
            expect(typeof responseBody.usuario.id).toBe('number');
            expect(Number.isInteger(responseBody.usuario.id)).toBe(true);

            expect(responseBody.usuario).toHaveProperty('nome');
            expect(responseBody.usuario).toHaveProperty('email');
            expect(responseBody.usuario).not.toHaveProperty('senha');
        });

        test('Register a user with an already registered email', async ({request}) => {
            const response = await request.post('/registro', { data: userData });
            const body = await response.json();

            expect(response.status()).toBe(400);
            expect(body.mensagem).toBe('Email já cadastrado');
        });

        test('Login with valid credentials', async ({request}) => {
            const response = await request.post('/login', { data: {email: userData.email, senha: userData.senha} });
            const body = await response.json();
            console.log(body);

            expect(response.status()).toBe(200);
            expect(body.mensagem).toBe('Login realizado com sucesso');
            expect(body).not.toHaveProperty('senha');
        });

        test('Login with invalid credentials', async ({request}) => {
            const wrongPassword = `${userData.senha}*error`

            const response = await request.post('/login', { data: {email: userData.email, senha: wrongPassword} });
            const body = await response.json();

            expect(response.status()).toBe(401);
            expect(body.mensagem).toBe('Email ou senha incorretos');
        });
    });

    test.describe('Books', () => {

        test.beforeEach(async ({ request }) => {
            bookData = createBookData();
            registeredBook = await registerBook(request, bookData);

            console.log(registeredBook);
        });

        test('List all existing books', async ({request}) => {
            const response = await request.get('/livros')
            const body = await response.json();

            expect(response.status()).toBe(200);
            expect(Array.isArray(body)).toBe(true);

            body.forEach((book) => {
                expect(book).toHaveProperty('id');
                expect(book).toHaveProperty('nome');
                expect(book).toHaveProperty('paginas');
                expect(Number.isInteger(book.paginas)).toBe(true);
                expect(book).toHaveProperty('descricao');
                expect(book).toHaveProperty('imagemUrl');
                expect(book).toHaveProperty('dataCadastro');
            });
        });

        test('Search book by its ID (Existing)', async ({request}) => {
            const response = await request.get(`/livros/${registeredBook.id}`);
            const body = await response.json();

            expect(response.status()).toBe(200);

            expect(body).toHaveProperty('id');
            expect(body.id).toBe(registeredBook.id);

            expect(body).toHaveProperty('nome');
            expect(typeof body.nome).toBe('string');
            expect(body.nome.length).toBeGreaterThan(0);

            expect(body).toHaveProperty('autor');
            expect(body).toHaveProperty('paginas');
            expect(body).toHaveProperty('descricao');
            expect(body).toHaveProperty('imagemUrl');
            expect(body).toHaveProperty('dataCadastro');
        });

        test('Search book by its ID (Non-existing)', async ({request}) => {
            const response = await request.get('/livros/9999')
            const body = await response.json();

            expect(response.status()).toBe(404);
            expect(body.mensagem).toBe('Livro não encontrado');
        });

        test('Add new book', async ({ request }) => {
            expect(registeredBook).toHaveProperty('id');
            expect(registeredBook).toHaveProperty('dataCadastro');
            expect(new Date(registeredBook.dataCadastro).toString()).not.toBe('Invalid Date');
        });


        test('Update existing book', async ({request}) => {
            const updatedData = {
                ...bookData,
                nome: 'Updated Book Name',
            }

            const response = await request.put(`/livros/${registeredBook.id}`, { data: updatedData });
            const body = await response.json();

            expect(response.status()).toBe(200);
            expect(body.nome).toBe('Updated Book Name');
            expect(body.id).toEqual(registeredBook.id);
        });

        test('Delete book', async ({ request }) => {
            const responseDELETE = await request.delete(`/livros/${registeredBook.id}`);
            const bodyDELETE = await responseDELETE.json();

            expect(responseDELETE.status()).toBe(200);
            expect(bodyDELETE.mensagem).toBe('Livro removido com sucesso');

            const responseGET = await request.get(`/livros/${registeredBook.id}`);
            const bodyGET = await responseGET.json();

            expect(responseGET.status()).toBe(404);
        });

        test('Get library statistics', async ({ request }) => {
            const response = await request.get('/estatisticas');
            const body = await response.json();


            expect(response.status()).toBe(200);
            expect(body).toHaveProperty('totalLivros');
            expect(body).toHaveProperty('totalPaginas');
            expect(body).toHaveProperty('totalUsuarios');

            expect(Number.isInteger(body.totalLivros)).toBe(true);
            expect(body.totalLivros).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(body.totalPaginas)).toBe(true);
            expect(body.totalPaginas).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(body.totalUsuarios)).toBe(true);
            expect(body.totalUsuarios).toBeGreaterThanOrEqual(0);
        });
    });

    test.describe('User + Books', () => {

        test.beforeEach(async ({ request }) => {
            userData = createUserData();
            registeredUser = await registerUser(request, userData);

            bookData = createBookData();
            registeredBook = await registerBook(request, bookData);
        });

        test.afterEach(async ({ request }) => {
            if (favouriteBookData) {
                await request.delete(`/favoritos/${favouriteBookData.usuarioId}/${favouriteBookData.livroId}`);
            }

            if (registeredBook) {
                await request.delete(`/livros/${registeredBook.id}`);
            }
        });

        test('Add book to favourites', async ({ request }) => {
            favouriteBookData = createFavouriteBookData();

            registeredfavouriteBook = await registerFavouriteBook(request, favouriteBookData);

            const body = registeredfavouriteBook;

            expect(body.mensagem).toBe('Livro adicionado aos favoritos');
        });

        test('List user favourites', async ({ request }) => {
            favouriteBookData = createFavouriteBookData();
            registeredfavouriteBook = await registerFavouriteBook(request, favouriteBookData);

            const response = await request.get(`/favoritos/${favouriteBookData.usuarioId}`);
            const body = await response.json();

            expect(response.status()).toBe(200);
            expect(Array.isArray(body)).toBe(true);
        });
    });
});