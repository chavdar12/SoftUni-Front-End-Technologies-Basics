const baseUrl = 'http://localhost:3030/';

let user = {
    email: '',
    password: '1234567'
};

let game = {
    title: '',
    category: '',
    maxLevel: '71',
    imageUrl: './images/ZombieLang.png',
    summary: ''
};

let lastCreatedGameId = '';

let gameIdForComments = '';

let token = '';
let userId = '';

QUnit.config.reorder = false;

QUnit.module("user functionalities", () => {

    QUnit.test("registration", async (assert) => {
        // Arrange
        let path = 'users/register';
        let random = Math.floor(Math.random() * 10000);
        let email = `abv${random}@abv.bg`;
        user.email = email;

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();

        // Assert
        assert.ok(response.ok, "successful response");

        assert.ok(json.hasOwnProperty('email'), 'email exists');
        assert.equal(json['email'], user.email, 'correct email');
        assert.strictEqual(typeof json.email, 'string', 'email has correct prop type');

        assert.ok(json.hasOwnProperty('password'), 'password exists');
        assert.equal(json['password'], user.password, 'correct password');
        assert.strictEqual(typeof json.password, 'string', 'password has correct prop type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correct prop type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', '_id has correct prop type');

        // Save the token and id
        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('game-user', JSON.stringify(user));
    });

    QUnit.test("login", async (assert) => {
        // Arrange
        let path = 'users/login';

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let json = await response.json();

        // Assert
        assert.ok(response.ok, 'successful response');

        assert.ok(json.hasOwnProperty('email'), 'email exists');
        assert.equal(json['email'], user.email, 'correct email');
        assert.strictEqual(typeof json.email, 'string', 'email has correct prop type');

        assert.ok(json.hasOwnProperty('password'), 'password exists');
        assert.equal(json['password'], user.password, 'correct password');
        assert.strictEqual(typeof json.password, 'string', 'password has correct prop type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correct prop type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', '_id has correct prop type');

        // Save the token and id
        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('game-user', JSON.stringify(user));
    });
});

QUnit.module("games functionalities", () => {

    QUnit.test("get all games", async (assert) => {
        // Arrange
        let path = 'data/games';
        let queryParams = '?sortBy=_createdOn%20desc';

        // Act
        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();

        // Assert
        assert.ok(response.ok, 'successful response');
        assert.ok(Array.isArray(json), 'response is array');

        json.forEach(jsonProp => {
            assert.ok(jsonProp.hasOwnProperty('category', 'property category exists'));
            assert.strictEqual(typeof jsonProp.category, 'string', 'property category has correct type');

            assert.ok(jsonProp.hasOwnProperty('imageUrl', 'property imageUrl exists'));
            assert.strictEqual(typeof jsonProp.imageUrl, 'string', 'property imageUrl has correct type');

            assert.ok(jsonProp.hasOwnProperty('maxLevel', 'property maxLevel exists'));
            assert.strictEqual(typeof jsonProp.maxLevel, 'string', 'property maxLevel has correct type');

            assert.ok(jsonProp.hasOwnProperty('title', 'property title exists'));
            assert.strictEqual(typeof jsonProp.title, 'string', 'property title has correct type');

            assert.ok(jsonProp.hasOwnProperty('summary', 'property summary exists'));
            assert.strictEqual(typeof jsonProp.summary, 'string', 'property summary has correct type');

            assert.ok(jsonProp.hasOwnProperty('_createdOn', 'property _createdOn exists'));
            assert.strictEqual(typeof jsonProp._createdOn, 'number', 'property _createdOn has correct type');

            assert.ok(jsonProp.hasOwnProperty('_id', 'property _id exists'));
            assert.strictEqual(typeof jsonProp._id, 'string', 'property _id has correct type');

            assert.ok(jsonProp.hasOwnProperty('_ownerId', 'property _ownerId exists'));
            assert.strictEqual(typeof jsonProp._ownerId, 'string', 'property _ownerId has correct type');
        });
    });

    QUnit.test("create a game", async (assert) => {
        // Arrange
        let path = 'data/games';
        let random = Math.floor(Math.random() * 10000);

        game.title = `Random game title ${random}`;
        game.category = `Random game category ${random}`;
        game.summary = `Random game summary ${random}`;

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(game)
        });
        let json = await response.json();

        // Save the last created game
        lastCreatedGameId = json._id;

        // Assert
        assert.ok(response.ok, 'successful response');

        assert.ok(json.hasOwnProperty('category'), 'prop category exists');
        assert.strictEqual(typeof json.category, 'string', 'prop category has correct type');
        assert.strictEqual(json.category, game.category, 'prop category has correct value');

        assert.ok(json.hasOwnProperty('imageUrl'), 'prop imageUrl exists');
        assert.strictEqual(typeof json.imageUrl, 'string', 'prop imageUrl has correct type');
        assert.strictEqual(json.imageUrl, game.imageUrl, 'prop imageUrl has correct value');

        assert.ok(json.hasOwnProperty('maxLevel'), 'prop maxLevel exists');
        assert.strictEqual(typeof json.maxLevel, 'string', 'prop maxLevel has correct type');
        assert.strictEqual(json.maxLevel, game.maxLevel, 'prop maxLevel has correct value');

        assert.ok(json.hasOwnProperty('summary'), 'prop summary exists');
        assert.strictEqual(typeof json.summary, 'string', 'prop summary has correct type');
        assert.strictEqual(json.summary, game.summary, 'prop summary has correct value');

        assert.ok(json.hasOwnProperty('title'), 'prop title exists');
        assert.strictEqual(typeof json.title, 'string', 'prop title has correct type');
        assert.strictEqual(json.title, game.title, 'prop title has correct value');

        assert.ok(json.hasOwnProperty('_createdOn'), 'prop _createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'prop _createdOn has correct type');

        assert.ok(json.hasOwnProperty('_id'), 'prop _id exists');
        assert.strictEqual(typeof json._id, 'string', 'prop _id has correct type');

        assert.ok(json.hasOwnProperty('_ownerId'), 'prop _ownerId exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'prop _ownerId has correct type');
    });

    QUnit.test("get game by id", async (assert) => {
        // Arrange
        let path = 'data/games';

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedGameId}`);
        let json = await response.json();

        // Assert
        assert.ok(response.ok, 'successful response');

        assert.ok(json.hasOwnProperty('category'), 'prop category exists');
        assert.strictEqual(typeof json.category, 'string', 'prop category has correct type');
        assert.strictEqual(json.category, game.category, 'prop category has correct value');

        assert.ok(json.hasOwnProperty('imageUrl'), 'prop imageUrl exists');
        assert.strictEqual(typeof json.imageUrl, 'string', 'prop imageUrl has correct type');
        assert.strictEqual(json.imageUrl, game.imageUrl, 'prop imageUrl has correct value');

        assert.ok(json.hasOwnProperty('maxLevel'), 'prop maxLevel exists');
        assert.strictEqual(typeof json.maxLevel, 'string', 'prop maxLevel has correct type');
        assert.strictEqual(json.maxLevel, game.maxLevel, 'prop maxLevel has correct value');

        assert.ok(json.hasOwnProperty('summary'), 'prop summary exists');
        assert.strictEqual(typeof json.summary, 'string', 'prop summary has correct type');
        assert.strictEqual(json.summary, game.summary, 'prop summary has correct value');

        assert.ok(json.hasOwnProperty('title'), 'prop title exists');
        assert.strictEqual(typeof json.title, 'string', 'prop title has correct type');
        assert.strictEqual(json.title, game.title, 'prop title has correct value');

        assert.ok(json.hasOwnProperty('_createdOn'), 'prop _createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'prop _createdOn has correct type');

        assert.ok(json.hasOwnProperty('_id'), 'prop _id exists');
        assert.strictEqual(typeof json._id, 'string', 'prop _id has correct type');

        assert.ok(json.hasOwnProperty('_ownerId'), 'prop _ownerId exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'prop _ownerId has correct type');
    });

    QUnit.test("edit game", async (assert) => {
        // Arrange
        let path = 'data/games';
        let random = Math.floor(Math.random() * 10000);

        game.title = `Updated title ${random}`;
        game.category = `Updated category ${random}`;
        game.summary = `Updated summary ${random}`;

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedGameId}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(game)
        });
        let json = await response.json();

        // Assert
        assert.ok(response.ok, 'successful response');

        assert.ok(json.hasOwnProperty('category'), 'prop category exists');
        assert.strictEqual(typeof json.category, 'string', 'prop category has correct type');
        assert.strictEqual(json.category, game.category, 'prop category has correct value');

        assert.ok(json.hasOwnProperty('imageUrl'), 'prop imageUrl exists');
        assert.strictEqual(typeof json.imageUrl, 'string', 'prop imageUrl has correct type');
        assert.strictEqual(json.imageUrl, game.imageUrl, 'prop imageUrl has correct value');

        assert.ok(json.hasOwnProperty('maxLevel'), 'prop maxLevel exists');
        assert.strictEqual(typeof json.maxLevel, 'string', 'prop maxLevel has correct type');
        assert.strictEqual(json.maxLevel, game.maxLevel, 'prop maxLevel has correct value');

        assert.ok(json.hasOwnProperty('summary'), 'prop summary exists');
        assert.strictEqual(typeof json.summary, 'string', 'prop summary has correct type');
        assert.strictEqual(json.summary, game.summary, 'prop summary has correct value');

        assert.ok(json.hasOwnProperty('title'), 'prop title exists');
        assert.strictEqual(typeof json.title, 'string', 'prop title has correct type');
        assert.strictEqual(json.title, game.title, 'prop title has correct value');

        assert.ok(json.hasOwnProperty('_createdOn'), 'prop _createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'prop _createdOn has correct type');

        assert.ok(json.hasOwnProperty('_id'), 'prop _id exists');
        assert.strictEqual(typeof json._id, 'string', 'prop _id has correct type');

        assert.ok(json.hasOwnProperty('_ownerId'), 'prop _ownerId exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'prop _ownerId has correct type');

        assert.ok(json.hasOwnProperty('_updatedOn'), 'prop _updatedOn exists');
        assert.strictEqual(typeof json._updatedOn, 'number', 'prop _updatedOn has correct type');
    });

    QUnit.test('delete game', async (assert) => {
        // Arrange
        let path = 'data/games';

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedGameId}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            }
        });

        // Assert
        assert.ok(response.ok, 'successful response');
    });
});

QUnit.module("comment functionalities", () => {

    QUnit.test("new created games has no comments", async (assert) => {
        // Arrange
        let path = 'data/comments';

        // create a new game
        let gameId = (await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(game)
        })
            .then(response => response.json()))._id;

        gameIdForComments = gameId;

        let queryParams = `?where=gameId%3D%22${gameIdForComments}%22`;

        // Act
        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();

        // Assert
        assert.ok(response.ok, 'successful response');
        assert.ok(Array.isArray(json), 'response is array');
        assert.ok(json.length === 0, 'array is empty');
    });

    QUnit.test("create a new comment", async (assert) => {
        // Arrange
        let path = 'data/comments';
        let random = Math.floor(Math.random() * 10000);
        let comment = {
            gameId: gameIdForComments,
            comment: `comment ${random}`
        };

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(comment)
        });
        let json = await response.json();

        // Assert
        assert.ok(response.ok, 'successful response');

        assert.ok(json.hasOwnProperty('comment'), 'comment prop exists');
        assert.strictEqual(typeof json.comment, 'string', 'prop comment has correct type');
        assert.strictEqual(json.comment, comment.comment, 'prop comment has expected value');

        assert.ok(json.hasOwnProperty('gameId'), 'gameId prop exists');
        assert.strictEqual(typeof json.gameId, 'string', 'prop gameId has correct type');
        assert.strictEqual(json.gameId, comment.gameId, 'prop gameId has expected value');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn prop exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'prop _createdOn has correct type');

        assert.ok(json.hasOwnProperty('_id'), '_id prop exists');
        assert.strictEqual(typeof json._id, 'string', 'prop _id has correct type');
    });

    QUnit.test("get comment for specific game", async (assert) => {
        // Arrange
        let path = 'data/comments';
        let queryParams = `?where=gameId%3D%22${gameIdForComments}%22`;

        // Act
        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();

        // Assert
        assert.ok(response.ok, 'successful response');
        assert.ok(Array.isArray(json), 'response is array');

        json.forEach(comment => {

            assert.ok(comment.hasOwnProperty('comment'), 'comment prop exists');
            assert.strictEqual(typeof comment.comment, 'string', 'prop comment has correct type');

            assert.ok(comment.hasOwnProperty('gameId'), 'gameId prop exists');
            assert.strictEqual(typeof comment.gameId, 'string', 'prop gameId has correct type');

            assert.ok(comment.hasOwnProperty('_createdOn'), '_createdOn prop exists');
            assert.strictEqual(typeof comment._createdOn, 'number', 'prop _createdOn has correct type');

            assert.ok(comment.hasOwnProperty('_id'), '_id prop exists');
            assert.strictEqual(typeof comment._id, 'string', 'prop _id has correct type');

        });
    });
});