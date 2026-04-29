import { faker } from '@faker-js/faker';

export default function createUserData() {

    const password = faker.internet.password()

    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: password,
        confirmPassword: password
    }
}