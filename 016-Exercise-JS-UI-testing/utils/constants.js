const BASE_URL = 'http://localhost:3001';

const TEST_URL = {
    TEST_HOME_URL: BASE_URL + '/',
    TEST_LOGIN_URL: BASE_URL + '/login',
    TEST_REGISTER_URL: BASE_URL + '/register',
    TEST_CATALOG_URL: BASE_URL + '/catalog'
}

const TEST_USER = {
    EMAIL: 'peter@abv.bg',
    PASS: '123456'
}

function generateUniqueEmail(){
    const timestamp = Date.now();
    return `test${timestamp}@test.bg`;
}
const USER_REGISTER = {
    EMAIL: generateUniqueEmail(),
    PASS: '123456',
    RE_PASS: '123456'
}

const ALERT = {
    ALERT_MESG: 'All fields are required!'
}

const ALERT_PASSWORD = {
    ALERT_MESG_PASS: "Passwords don't match!"
}

const TEST_BOOK = {
    TITLE: 'Test Book Title',
    DESCRIPTION: 'Test Book Desc',
    IMAGE: 'https://example.com/book-image.jpg',
    TEST_BOOK_OPTIONS: {
        FICTION: 'Fiction',
        ROMANCE: 'Romance',
        MISTERY: 'Mistery',
        CLASIC: 'Clasic',
        OTHER: 'Other'
    }
}

export {
    BASE_URL,
    TEST_URL,
    TEST_USER,
    ALERT,
    TEST_BOOK,
    USER_REGISTER,
    ALERT_PASSWORD
}