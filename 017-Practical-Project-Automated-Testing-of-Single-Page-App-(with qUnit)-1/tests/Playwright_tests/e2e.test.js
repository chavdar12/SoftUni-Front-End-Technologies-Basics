const { describe, test, beforeAll, afterAll, beforeEach, afterEach, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3001';

let browser;
let context;
let page;

let game = {
    title: 'Random title',
    category: 'Random category',
    maxLevel: '71',
    imgaeUrl: './images/ZombieLang.png',
    summary: 'summary'
}

let user = {
    email: '',
    password: '123456',
    confirmPassword: '123456'
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
        test("register with valid data", async () => {
            // Arrange
            await page.goto(host);
            let random = Math.floor(Math.random() * 10000);
            user.email = `test${random}@test.bg`;

            // Act
            await page.click('text=Register');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#register-password').fill(user.password);
            await page.locator('#confirm-password').fill(user.confirmPassword);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();

            // Assert
            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test("try to register with empty fields", async () => {
            // Arrange
            await page.goto(host);

            // Act
            await page.click('text=Register');
            await page.click('[type="submit"]');

            // Assert
            expect(page.url()).toBe(host + '/register');
        });

        test("login with valid data", async () => {
            // Arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            // Act
            await page.locator('#email').fill(user.email);
            await page.locator('#login-password').fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('users/login') && res.status() === 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();

            // Assert
            expect(response.ok).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test("try to login with empty fields", async () => {
            // Arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            // Act
            await page.click('[type="submit"]');


            // Assert
            expect(page.url()).toBe(host + '/login');
        });

        test("logout successfuly", async () => {
            // Arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form')
            await page.locator('#email').fill(user.email);
            await page.locator('#login-password').fill(user.password);
            await page.click('[type="submit"]');

            // Act
            let [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('users/logout') && res.status() === 204),
                page.click('text=Logout')
            ]);
            await page.waitForSelector('text=Login');

            // Assert
            expect(response.ok).toBeTruthy();
            expect(page.url()).toBe(host + "/");
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
            await page.locator('#login-password').fill(user.password);
            await page.click('[type="submit"]');

            // Assert
            await expect(page.locator('nav >> text=All games')).toBeVisible();
            await expect(page.locator('nav >> text=Create game')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();

            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();

        });

        test('navbar for non-logged user', async () => {
            // Arrange
            await page.goto(host);

            // Assert
            await expect(page.locator('nav >> text=All games')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();

            await expect(page.locator('nav >> text=Create game')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();



        });
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            // Login user
            await page.goto(host);

            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#login-password').fill(user.password);
            await page.click('[type="submit"]');
            // tests that call page.goto() right away would otherwise cancel the login in flight
            await page.locator('nav >> text=Logout').waitFor();
        });

        test('try to create game with empty fields', async () => {
            // Arrange
            await page.click('text=Create game');
            await page.waitForSelector('form');

            // Act
            await page.click('[type=submit]');

            // Assert
            expect(page.url()).toBe(host + '/create');
        });

        test('create game with valid data', async () => {
            // Arrange
            await page.click('text=Create game');
            await page.waitForSelector('form');

            // Act
            await page.fill('[name="title"]', game.title);
            await page.fill('[name="category"]', game.category);
            await page.fill('[name="maxLevel"]', game.maxLevel);
            await page.fill('[name="imageUrl"]', game.imgaeUrl);
            await page.fill('[name="summary"]', game.summary);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/games') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            let gameData = await response.json();

            // Assert
            expect(response.ok).toBeTruthy();
            expect(gameData.title).toEqual(game.title);
            expect(gameData.category).toEqual(game.category);
            expect(gameData.maxLevel).toEqual(game.maxLevel);
            expect(gameData.summary).toEqual(game.summary);
        });

        test('owner of the game have edit and delete buttons', async () => {
            // Arrange
            await page.goto(host + '/catalog');

            // Act
            await page.click('.allGames .allGames-info:has-text("Random title") .details-button');

            // Assert
            await expect(page.locator('text="Delete"')).toBeVisible();
            await expect(page.locator('text="Edit"')).toBeVisible();
        });

        test('not owner of the game does not see the edit and delete buttons', async () => {
            // Arrange
            await page.goto(host + '/catalog');

            // Act
            await page.click('.allGames .allGames-info:has-text("MineCraft") .details-button');

            // Assert
            await expect(page.locator('text="Delete"')).toBeHidden();
            await expect(page.locator('text="Edit"')).toBeHidden();
        });

        test('owner can edit his own game', async () => {
            // Arrange
            await page.goto(host + '/catalog');
            await page.click('.allGames .allGames-info:has-text("Random title") .details-button');
            await page.click('text=Edit');
            await page.waitForSelector('form');

            // Act
            await page.locator('[name="title"]').fill('Edited Title');
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/games') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            let gameData = await response.json();

            // Assert
            expect(gameData.title).toEqual('Edited Title');
            expect(gameData.category).toEqual(game.category);
            expect(gameData.maxLevel).toEqual(game.maxLevel);
            expect(gameData.summary).toEqual(game.summary);
        });

        test('owner can delete his own game', async () => {
            // Arrange
            await page.goto(host + '/catalog');
            await page.click('.allGames .allGames-info:has-text("Edited Title") .details-button');

            // Act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/games') && response.status() === 200),
                page.click('text=Delete')
            ]);

            // Assert
            expect(response.ok()).toBeTruthy();

        });
    });

    describe("home page", () => {
        test('verify home page has correct data', async () => {
            // Act
            await page.goto(host);

            // Assert
            await expect(page.locator('.welcome-message h2')).toHaveText('ALL new games are');
            await expect(page.locator('.welcome-message h3')).toHaveText('Only in GamesPlay');

            await expect(page.locator('#home-page h1')).toHaveText('Latest Games');
            const games = await page.locator('#home-page .game').all();
            expect(games.length).toBeGreaterThanOrEqual(3);
        });
    });
});