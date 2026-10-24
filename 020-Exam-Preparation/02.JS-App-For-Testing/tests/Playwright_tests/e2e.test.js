const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3001';

let browser;
let context;
let page;

let user = {
    username: "",
    email: "",
    password: "123456",
    confirmPass: "123456",
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });


    describe("authentication", () => {
        test('user register with valid data', async () => {
            // Arrange
            await page.goto(host);
            await page.locator('a[href="/register"]').first().click();
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);
            user.username = `Random user ${random}`;
            user.email = `test${random}@test.bg`;

            // Act
            await page.locator('#username').fill(user.username);
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPass').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status() === 200),
                page.click('input[type="submit"]')
            ]);
            let userData = await response.json();

            // Assert
            expect(response.ok()).toBeTruthy();

            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test('user login with valid data', async () => {
            // Arrange
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            // Act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login') && response.status() === 200),
                page.click('input[type="submit"]')
            ]);
            let userData = await response.json();

            // Assert
            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test('user logout', async () => {
            // Arrange
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            // Act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('input[type="submit"]');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout') && response.status() === 204),
                page.locator('a[href="/logout"]').click()
            ]);

            // Assert
            expect(response.ok()).toBeTruthy();
            await page.locator('a[href="/login"]');
            await page.waitForURL(host + '/');
            expect(page.url()).toBe(host + '/');
        });
    });

    describe("navbar", () => {
        test('navbar for logged in user', async () => {
            // Arrange
            await page.goto(host)
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            // Act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('input[type="submit"]');

            // Assert
            await expect(page.locator('a[href="/catalog"]')).toBeVisible();
            await expect(page.locator('a[href="/create"]')).toBeVisible();
            await expect(page.locator('a[href="/myprofile"]')).toBeVisible();
            await expect(page.locator('a[href="/logout"]')).toBeVisible();

            await expect(page.locator('a[href="/login"]').first()).toBeHidden();
            await expect(page.locator('a[href="/register"]').first()).toBeHidden();
        });

        test('navbar for guest user', async () => {
            // Act
            await page.goto(host);

            // Assert
            await expect(page.locator('a[href="/login"]').first()).toBeVisible();
            await expect(page.locator('a[href="/register"]').first()).toBeVisible();
            await expect(page.locator('a[href="/"]')).toBeVisible();
            await expect(page.locator('a[href="/"]')).toBeVisible();

            await expect(page.locator('a[href="/create"]')).toBeHidden();
            await expect(page.locator('a[href="/myprofile"]')).toBeHidden();
            await expect(page.locator('a[href="/logout"]')).toBeHidden();
        });
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host)
            await page.locator('a[href="/login"]').first().click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('input[type="submit"]');
        });
        test('create meme', async () => {
            // Arrange
            await page.click('a[href="/create"]');
            await page.waitForSelector('form');

            // Act
            await page.fill('[name="title"]', 'Random Title');
            await page.fill('[name="description"]', 'Random Description');
            await page.fill('[name="imageUrl"]', 'https://jpeg.org/images/jpeg-home.jpg');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status() === 200),
                page.click('input[type="submit"]')
            ]);
            let memeData = await response.json();

            // Assert
            expect(response.ok).toBeTruthy();

            expect(memeData.title).toBe('Random Title');
            expect(memeData.description).toBe('Random Description');
            expect(memeData.imageUrl).toBe('https://jpeg.org/images/jpeg-home.jpg');
        });

        test('edit meme', async () => {
            // Arrange
            await page.click('a[href="/myprofile"]');
            await page.locator('//a[text()="Details"]').first().click();
            await page.locator('//a[text()="Edit"]').click();
            await page.waitForSelector('form');

            // Act
            await page.fill('[name="description"]', 'Random edited description')

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status() === 200),
                page.click('input[type="submit"]')
            ]);
            let memeData = await response.json();

            // Assert
            expect(response.ok).toBeTruthy();

            expect(memeData.title).toBe('Random Title');
            expect(memeData.description).toBe('Random edited description');
            expect(memeData.imageUrl).toBe('https://jpeg.org/images/jpeg-home.jpg');
        });

        test('delete meme', async () => {
            // Arrange
            await page.click('a[href="/myprofile"]');
            await page.locator('//a[text()="Details"]').first().click();

            // Act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status() === 200),
                page.click('//button[text()="Delete"]')
            ]);

            // Assert
            expect(response.ok).toBeTruthy();
        });
    });
});