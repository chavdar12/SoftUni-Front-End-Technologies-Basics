import { test, expect } from "@playwright/test"
import { ALL_BOOKS_LIST, CREATE_BOOK_FORM, DETAILS_BUTTONS, DETAILS_DESCRIPTION, LOGGED_NAVBAR, LOGIN_FORM, NAVBAR, REGISTER_FORM } from "../utils/locators.js";
import { ALERT, ALERT_PASSWORD, BASE_URL, TEST_BOOK, TEST_URL, TEST_USER, USER_REGISTER } from "../utils/constants.js";

// Navigation
test("Verify 'All books' is visible - Part 1", async ({ page }) => {
    await page.goto('http://localhost:3001/')

    await page.waitForSelector('nav.navbar');
    const allBooksLink = await page.$("a[href='/catalog']");
    const isLinkVisible = await allBooksLink.isVisible();
    expect(isLinkVisible).toBe(true);
});

test("Verify 'All books' is visible - Part 2", async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.locator(NAVBAR.NAV_NAVBAR)).toBeVisible();

    await expect(page.locator(NAVBAR.ALL_BOOKS_LINK)).toBeVisible();
});


// Login button
test("Verify 'Login button' is visible", async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.locator(NAVBAR.NAV_NAVBAR)).toBeVisible();

    await expect(page.locator(NAVBAR.LOGIN_BUTTON)).toBeVisible();
});


// Register button
test("Verify 'Register button' is visible", async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.locator(NAVBAR.NAV_NAVBAR)).toBeVisible();

    await expect(page.locator(NAVBAR.REGISTER_BUTTON)).toBeVisible();
});


// Navigation for logged in users
test("Verify 'All books' link is visible after user is login", async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator(NAVBAR.LOGIN_BUTTON)).toBeVisible();

    await page.locator(NAVBAR.LOGIN_BUTTON).click();

    await expect(page.locator(LOGIN_FORM.LOGIN_FORM)).toBeVisible();

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);

    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);

    await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click();

    await page.waitForURL(TEST_URL.TEST_CATALOG_URL);
    expect(page.url()).toBe(TEST_URL.TEST_CATALOG_URL);
});


// User email welcome message, my books, add book buttons are visible after login
test("Verify user email welcome message, my books, add book buttons are visible after login", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await expect(page.locator(LOGIN_FORM.LOGIN_FORM)).toBeVisible();

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);

    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);

    await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click();

    await page.waitForURL(TEST_URL.TEST_CATALOG_URL);
    expect(page.url()).toBe(TEST_URL.TEST_CATALOG_URL);

    await expect(page.locator(LOGGED_NAVBAR.USER_EMAIL)).toBeVisible();
    await expect(page.locator(LOGGED_NAVBAR.MY_BOOKS)).toBeVisible();
    await expect(page.locator(LOGGED_NAVBAR.ADD_BOOK)).toBeVisible();
});


// LOGIN PAGE/FORM
// Login with valid credentials
test("Login with valid credentials", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);
    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);
    await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click();

    await page.waitForURL(TEST_URL.TEST_CATALOG_URL);
    expect(page.url()).toBe(TEST_URL.TEST_CATALOG_URL);
});

// Try to login with empty fields
test("Try to login with empty fields", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT.ALERT_MESG);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_LOGIN_URL);
    expect(page.url()).toBe(TEST_URL.TEST_LOGIN_URL);
});

// Try to login with email empty field
test("Try to login with empty email field", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);
    await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT.ALERT_MESG);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_LOGIN_URL);
    expect(page.url()).toBe(TEST_URL.TEST_LOGIN_URL);
});

// Try to login with password empty field
test("Try to login with empty password field", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);
    await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT.ALERT_MESG);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_LOGIN_URL);
    expect(page.url()).toBe(TEST_URL.TEST_LOGIN_URL);
});



// REGISTER PAGE/FORM
// Register with valid credentials
test("Register with valid credentials", async ({ page }) => {
    await page.goto(TEST_URL.TEST_REGISTER_URL);

    await page.locator(REGISTER_FORM.EMAIL).fill(USER_REGISTER.EMAIL);
    await page.locator(REGISTER_FORM.PASSWORD).fill(USER_REGISTER.PASS);
    await page.locator(REGISTER_FORM.RE_PASSWORD).fill(USER_REGISTER.RE_PASS);
    await page.locator(REGISTER_FORM.REGISTER_FORM_BUTTON).click();

    await page.waitForURL(TEST_URL.TEST_CATALOG_URL);
    expect(page.url()).toBe(TEST_URL.TEST_CATALOG_URL);
});

// Try to register with empty fields
test("Try to register with empty fields", async ({ page }) => {
    await page.goto(TEST_URL.TEST_REGISTER_URL);

    await page.locator(REGISTER_FORM.REGISTER_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT.ALERT_MESG);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_REGISTER_URL);
    expect(page.url()).toBe(TEST_URL.TEST_REGISTER_URL);
});

// Try to register with empty email field
test("Try to register with empty email field", async ({ page }) => {
    await page.goto(TEST_URL.TEST_REGISTER_URL);

    await page.locator(REGISTER_FORM.PASSWORD).fill(USER_REGISTER.PASS);
    await page.locator(REGISTER_FORM.RE_PASSWORD).fill(USER_REGISTER.RE_PASS);
    await page.locator(REGISTER_FORM.REGISTER_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT.ALERT_MESG);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_REGISTER_URL);
    expect(page.url()).toBe(TEST_URL.TEST_REGISTER_URL);
});

// Try to register with empty password field
test("Try to register with empty password field", async ({ page }) => {
    await page.goto(TEST_URL.TEST_REGISTER_URL);

    await page.locator(REGISTER_FORM.EMAIL).fill(USER_REGISTER.EMAIL);
    await page.locator(REGISTER_FORM.RE_PASSWORD).fill(USER_REGISTER.RE_PASS);
    await page.locator(REGISTER_FORM.REGISTER_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT.ALERT_MESG);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_REGISTER_URL);
    expect(page.url()).toBe(TEST_URL.TEST_REGISTER_URL);
});

// Try to register with empty re-password field
test("Try to register with empty re-password field", async ({ page }) => {
    await page.goto(TEST_URL.TEST_REGISTER_URL);

    await page.locator(REGISTER_FORM.EMAIL).fill(USER_REGISTER.EMAIL);
    await page.locator(REGISTER_FORM.PASSWORD).fill(USER_REGISTER.PASS);
    await page.locator(REGISTER_FORM.REGISTER_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT.ALERT_MESG);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_REGISTER_URL);
    expect(page.url()).toBe(TEST_URL.TEST_REGISTER_URL);
});

// Try to register with different passwords
test("Try to register with different passwords", async ({ page }) => {
    await page.goto(TEST_URL.TEST_REGISTER_URL);

    await page.locator(REGISTER_FORM.EMAIL).fill(USER_REGISTER.EMAIL);
    await page.locator(REGISTER_FORM.PASSWORD).fill(USER_REGISTER.PASS);
    await page.locator(REGISTER_FORM.RE_PASSWORD).fill('12345');
    await page.locator(REGISTER_FORM.REGISTER_FORM_BUTTON).click();
    page.on("dialog", async dialog => {
        expect(dialog.type()).toContain("alert");
        expect(dialog.message()).toContain(ALERT_PASSWORD.ALERT_MESG_PASS);
        await dialog.accept();
    });

    await page.waitForURL(TEST_URL.TEST_REGISTER_URL);
    expect(page.url()).toBe(TEST_URL.TEST_REGISTER_URL);
});



// ADD BOOK
// Add book page test
test("Add book with correct data", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);
    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);

    await Promise.all([
        await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click(),

        await page.waitForURL(TEST_URL.TEST_CATALOG_URL)
    ]);

    await page.locator(LOGGED_NAVBAR.ADD_BOOK).click();
    await page.locator(CREATE_BOOK_FORM.TITLE).fill(TEST_BOOK.TITLE);
    await page.locator(CREATE_BOOK_FORM.DESCRIPTION).fill(TEST_BOOK.DESCRIPTION);
    await page.locator(CREATE_BOOK_FORM.IMAGE).fill(TEST_BOOK.IMAGE);
    await page.locator(CREATE_BOOK_FORM.TYPE_OPTION).selectOption(TEST_BOOK.TEST_BOOK_OPTIONS.FICTION)
    await page.locator(CREATE_BOOK_FORM.ADD_BOOK_BUTTON).click();

    await page.waitForURL(TEST_URL.TEST_CATALOG_URL);
    expect(page.url()).toBe(TEST_URL.TEST_CATALOG_URL);
});

// All books are visible test
test("Login and verify that all books are visible", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);
    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);

    await Promise.all([
        await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click(),

        await page.waitForURL(TEST_URL.TEST_CATALOG_URL)
    ]);

    // the catalog renders after the URL changes, so wait for it before counting
    await page.locator('//li[@class="otherBooks"]').first().waitFor();
    const booksCount = await page.locator('//li[@class="otherBooks"]').count();
    expect(booksCount).toBeGreaterThan(0);
});

// Details page test
test("Verify Details page of the book is visible", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);
    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);

    await Promise.all([
        await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click(),

        await page.waitForURL(TEST_URL.TEST_CATALOG_URL)
    ]);

    await page.locator(DETAILS_BUTTONS).first().click();
    await expect(page.locator(DETAILS_DESCRIPTION)).toBeVisible();
});



// LOGOUT
// Logout functionality
test("Verify that logout button is visible", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);
    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);

    await Promise.all([
        await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click(),

        await page.waitForURL(TEST_URL.TEST_CATALOG_URL)
    ]);

    await expect(page.locator(LOGGED_NAVBAR.LOGOUT)).toBeVisible();
});


// BUG HERE
test("Verify that logout button redirects correctly to home page", async ({ page }) => {
    await page.goto(TEST_URL.TEST_LOGIN_URL);

    await page.locator(LOGIN_FORM.EMAIL).fill(TEST_USER.EMAIL);
    await page.locator(LOGIN_FORM.PASS).fill(TEST_USER.PASS);

    await Promise.all([
        await page.locator(LOGIN_FORM.LOGIN_FORM_BUTTON).click(),

        await page.waitForURL(TEST_URL.TEST_CATALOG_URL)
    ]);

    await page.locator(LOGGED_NAVBAR.LOGOUT).click();

    await page.waitForURL(TEST_URL.TEST_CATALOG_URL);
    expect(page.url()).toBe(TEST_URL.TEST_CATALOG_URL);

    await expect(page.locator(NAVBAR.LOGIN_BUTTON)).toBeVisible();
    await expect(page.locator(LOGGED_NAVBAR.USER_EMAIL)).toBeHidden();
});