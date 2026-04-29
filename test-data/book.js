import { faker } from '@faker-js/faker';

export default function createBookData() {
    return {
        name: faker.book.title(),
        author: faker.book.author(),
        pages: faker.number.int({ min: 80, max: 600 }),
        description: faker.lorem.paragraph(),
        imgURL: faker.image.url({ category: 'book' })
    }
}