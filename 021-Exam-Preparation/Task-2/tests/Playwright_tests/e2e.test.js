const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3001'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
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
        test('register user with valid data', async () => {
            // Arrange
            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');
            let random = Math.floor(Math.random() * 10000);
            user.email = `test${random}@test.bg`;

            // Act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPassword').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/users/register') && res.status() === 200),
                page.click('[type="submit"]')
            ]);
            let jsonData = await response.json();

            // Assert
            await expect(response.ok).toBeTruthy();

            expect(jsonData.email).toBe(user.email);
            expect(jsonData.password).toBe(user.password);
        });

        test('login user with valid data', async () => {
            // Arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            // Act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);

            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/users/login') && res.status() === 200),
                page.click('[type="submit"]')
            ]);
            let jsonData = await response.json();

            // Assert
            await expect(response.ok).toBeTruthy();

            expect(jsonData.email).toBe(user.email);
            expect(jsonData.password).toBe(user.password);
        });

        test('logout user', async () => {
            // Arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            // Act
            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/users/logout') && res.status() === 204),
                page.click('nav >> text=Logout')
            ]);

            // Assert
            expect(response.ok).toBeTruthy();
            await page.waitForSelector('nav >> text=Login');
            expect(page.url()).toBe(host + '/');

        });
    });

    describe("navbar", () => {
        test('navbar for logged in user', async () => {
            // Arrange
            await page.goto(host);

            // Act
            await page.click('text=Login');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            // Act
            await expect(page.locator('nav >> text=Theater')).toBeVisible();
            await expect(page.locator('nav >> text=Create Event')).toBeVisible();
            await expect(page.locator('nav >> text=Profile')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();

            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();
        });

        test('navbar for guest user', async () => {
            // Act
            await page.goto(host);

            // Assert
            await expect(page.locator('nav >> text=Theater')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();

            await expect(page.locator('nav >> text=Create Event')).toBeHidden();
            await expect(page.locator('nav >> text=Profile')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();
        });
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');
        });

        test('create an event', async () => {
            // Arrange
            await page.click('nav >> text=Create Event');
            await page.waitForSelector('form');

            // Act
            await page.fill('#title', 'Random Title');
            await page.fill('#date', 'Random date');
            await page.fill('#author', 'Random author');
            await page.fill('#description', 'Random description');
            await page.fill('#imageUrl', '/images/background.jpg');

            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/data/theaters') && res.status() === 200),
                page.click('[type="submit"]')
            ]);
            let eventData = await response.json();

            // Assert
            expect(response.ok).toBeTruthy();
            expect(eventData.title).toEqual('Random Title');
            expect(eventData.author).toEqual('Random author');
            expect(eventData.date).toEqual('Random date');
            expect(eventData.description).toEqual('Random description');
            expect(eventData.imageUrl).toEqual('/images/background.jpg');
        });

        test('edit an event', async () => {
            // Arrange
            await page.click('nav >> text=Profile');
            await page.locator('text=Details').first().click();
            await page.click('text=Edit');
            await page.waitForSelector('form');

            // Act
            await page.fill('#title', 'Random Edited Title');
            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/data/theaters') && res.status() === 200),
                page.click('[type="submit"]')
            ]);
            let eventData = await response.json();

            // Assert
            expect(response.ok).toBeTruthy();
            expect(eventData.title).toEqual('Random Edited Title');
            expect(eventData.author).toEqual('Random author');
            expect(eventData.date).toEqual('Random date');
            expect(eventData.description).toEqual('Random description');
            expect(eventData.imageUrl).toEqual('/images/background.jpg');
        });

        test('delete an event', async () => {
            // Arange
            await page.click('nav >> text=Profile');
            await page.locator('text=Details').first().click();

            // Act
            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/data/theaters') && res.status() === 200),
                page.on('dialog', dialog => dialog.accept()),
                page.click('text=Delete')
            ]);

            // Assert
            expect(response.ok).toBeTruthy();
        });
    })
})