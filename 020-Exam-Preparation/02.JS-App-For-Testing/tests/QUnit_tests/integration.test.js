const baseUrl = 'http://localhost:3030';

let user = {
    username: '',
    email: '',
    password: '123456',
    gender: 'male'
};

let token = '';
let userId = '';

let meme = {
    title: '',
    description: '',
    imageUrl: './images/2.png'
};

let lastCreatedMemeId = '';

QUnit.config.reorder = false;

QUnit.module('user functionalities', () => {
    QUnit.test('user registration', async (assert) => {
        // Arrange
        let path = '/users/register';
        let random = Math.floor(Math.random() * 10000);
        let randomUsername = `Random username ${random}`;
        let randomEmail = `test${random}@test.bg`;

        user.username = randomUsername;
        user.email = randomEmail;

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let userData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(userData.hasOwnProperty('email'), 'email exist');
        assert.equal(userData.email, user.email, 'email is correct');
        assert.strictEqual(typeof userData.email, 'string', 'email type is correct');

        assert.ok(userData.hasOwnProperty('username'), 'username exist');
        assert.equal(userData.username, user.username, 'username is correct');
        assert.strictEqual(typeof userData.username, 'string', 'username type is correct');

        assert.ok(userData.hasOwnProperty('password'), 'password exist');
        assert.equal(userData.password, user.password, 'password is correct');
        assert.strictEqual(typeof userData.password, 'string', 'password type is correct');

        assert.ok(userData.hasOwnProperty('gender'), 'gender exist');
        assert.equal(userData.gender, user.gender, 'gender is correct');
        assert.strictEqual(typeof userData.gender, 'string', 'gender type is correct');

        assert.ok(userData.hasOwnProperty('_id'), '_id exist');
        assert.strictEqual(typeof userData._id, 'string', '_id type is correct');

        assert.ok(userData.hasOwnProperty('accessToken'), 'accessToken exist');
        assert.strictEqual(typeof userData.accessToken, 'string', 'accessToken type is correct');

        token = userData['accessToken']; //  Get AccessToken
        userId = userData['_id']; // Get Id
        sessionStorage.setItem('meme-user', JSON.stringify(user));
    });

    QUnit.test('user login', async (assert) => {
        // Arrange
        let path = '/users/login';

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
        let userData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(userData.hasOwnProperty('email'), 'email exist');
        assert.equal(userData.email, user.email, 'email is correct');
        assert.strictEqual(typeof userData.email, 'string', 'email type is correct');

        assert.ok(userData.hasOwnProperty('username'), 'username exist');
        assert.equal(userData.username, user.username, 'username is correct');
        assert.strictEqual(typeof userData.username, 'string', 'username type is correct');

        assert.ok(userData.hasOwnProperty('password'), 'password exist');
        assert.equal(userData.password, user.password, 'password is correct');
        assert.strictEqual(typeof userData.password, 'string', 'password type is correct');

        assert.ok(userData.hasOwnProperty('gender'), 'gender exist');
        assert.equal(userData.gender, user.gender, 'gender is correct');
        assert.strictEqual(typeof userData.gender, 'string', 'gender type is correct');

        assert.ok(userData.hasOwnProperty('_id'), '_id exist');
        assert.strictEqual(typeof userData._id, 'string', '_id type is correct');

        assert.ok(userData.hasOwnProperty('accessToken'), 'accessToken exist');
        assert.strictEqual(typeof userData.accessToken, 'string', 'accessToken type is correct');

        token = userData['accessToken']; //  Get AccessToken
        userId = userData['_id']; // Get Id
        sessionStorage.setItem('meme-user', JSON.stringify(user));
    });
});


QUnit.module('meme functionalities', () => {
    QUnit.test('get all memes', async (assert) => {
        // Arrange
        let path = '/data/memes';
        let queryParam = '?sortBy=_createdOn%20desc';

        // Act
        let response = await fetch(baseUrl + path + queryParam);
        let userData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');
        assert.ok(Array.isArray(userData), 'response is array');

        userData.forEach(element => {
            assert.ok(element.hasOwnProperty('description'), 'description exist');
            assert.strictEqual(typeof element.description, 'string', 'description type is correct');

            assert.ok(element.hasOwnProperty('title'), 'title exist');
            assert.strictEqual(typeof element.title, 'string', 'title type is correct');

            assert.ok(element.hasOwnProperty('imageUrl'), 'imageUrl exist');
            assert.strictEqual(typeof element.imageUrl, 'string', 'imageUrl type is correct');

            assert.ok(element.hasOwnProperty('_createdOn'), '_createdOn exist');
            assert.strictEqual(typeof element._createdOn, 'number', '_createdOn type is correct');

            assert.ok(element.hasOwnProperty('_id'), '_id exist');
            assert.strictEqual(typeof element._id, 'string', '_createdOn type is correct');

            assert.ok(element.hasOwnProperty('_ownerId'), '_ownerId exist');
            assert.strictEqual(typeof element._ownerId, 'string', '_ownerId type is correct');
        });
    });

    QUnit.test('create meme', async (assert) => {
        // Arrange
        let path = '/data/meme'
        let random = Math.floor(Math.random() * 10000);
        let randomTitle = `Random meme title ${random}`;
        let randomDesc = `Random meme description ${random}`;

        meme.title = randomTitle;
        meme.description = randomDesc;

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(meme)
        });
        let memeData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(memeData.hasOwnProperty('title'), 'title exists');
        assert.equal(memeData.title, meme.title, 'title is correct');
        assert.strictEqual(typeof memeData.title, 'string', 'title type is correct');

        assert.ok(memeData.hasOwnProperty('description'), 'description exists');
        assert.equal(memeData.description, meme.description, 'description is correct');
        assert.strictEqual(typeof memeData.description, 'string', 'description type is correct');

        assert.ok(memeData.hasOwnProperty('imageUrl'), 'imageUrl exists');
        assert.equal(memeData.imageUrl, meme.imageUrl, 'imageUrl is correct');
        assert.strictEqual(typeof memeData.imageUrl, 'string', 'imageUrl type is correct');

        assert.ok(memeData.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof memeData._id, 'string', '_id type is correct');

        assert.ok(memeData.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof memeData._createdOn, 'number', '_createdOn type is correct');

        assert.ok(memeData.hasOwnProperty('_ownerId'), '_ownerId exists');
        assert.strictEqual(typeof memeData._ownerId, 'string', '_ownerId type is correct');

        lastCreatedMemeId = memeData._id;
    });

    QUnit.test('edit meme', async (assert) => {
        // Arrange
        let path = '/data/meme'
        let random = Math.floor(Math.random() * 10000);
        let randomTitle = `Edited title ${random}`;
        meme.title = randomTitle;

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedMemeId}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(meme)
        });
        let memeData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(memeData.hasOwnProperty('title'), 'title exists');
        assert.equal(memeData.title, meme.title, 'title is correct');
        assert.strictEqual(typeof memeData.title, 'string', 'title type is correct');

        assert.ok(memeData.hasOwnProperty('description'), 'description exists');
        assert.equal(memeData.description, meme.description, 'description is correct');
        assert.strictEqual(typeof memeData.description, 'string', 'description type is correct');

        assert.ok(memeData.hasOwnProperty('imageUrl'), 'imageUrl exists');
        assert.equal(memeData.imageUrl, meme.imageUrl, 'imageUrl is correct');
        assert.strictEqual(typeof memeData.imageUrl, 'string', 'imageUrl type is correct');

        assert.ok(memeData.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof memeData._id, 'string', '_id type is correct');

        assert.ok(memeData.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof memeData._createdOn, 'number', '_createdOn type is correct');

        assert.ok(memeData.hasOwnProperty('_ownerId'), '_ownerId exists');
        assert.strictEqual(typeof memeData._ownerId, 'string', '_ownerId type is correct');

        assert.ok(memeData.hasOwnProperty('_updatedOn'), '_updatedOn exists');
        assert.strictEqual(typeof memeData._updatedOn, 'number', '_updatedOn type is correct');

        lastCreatedMemeId = memeData._id;
    });

    QUnit.test('delete meme', async (assert) => {
        // Arrange
        let path = '/data/meme'

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedMemeId}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            }
        });

        // Assert
        assert.ok(response.ok, 'success response');
    });
});