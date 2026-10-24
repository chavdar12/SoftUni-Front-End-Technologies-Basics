const baseUrl = 'http://localhost:3030/';

let user = {
    email: '',
    password: '123456'
};

let myEvent = {
    author: 'Random Author',
    date: '25.06.2024',
    title: '',
    description: '',
    imageUrl: '/images/Moulin-Rouge!-The-Musical.jpg'
}

let token = '';
let userId = '';
let lastCreatedEventId = '';

QUnit.config.reorder = false;

QUnit.module('user functionalities', () => {
    QUnit.test('registration', async (assert) => {
        // Arrange
        let path = 'users/register';

        let random = Math.floor(Math.random() * 10000);
        let randomEmail = `abv${random}@abv.bg`;
        user.email = randomEmail;

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let jsonData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(jsonData.hasOwnProperty('email'), 'email exists');
        assert.equal(jsonData.email, user.email, 'email is present');
        assert.strictEqual(typeof jsonData.email, 'string', 'email has correct type');

        assert.ok(jsonData.hasOwnProperty('password'), 'password exists');
        assert.equal(jsonData.password, user.password, 'password is present');
        assert.strictEqual(typeof jsonData.password, 'string', 'password has correct type');

        assert.ok(jsonData.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof jsonData._id, 'string', '_id has correct type');

        assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn has correct type');

        assert.ok(jsonData.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof jsonData.accessToken, 'string', 'accessToken has correct type');

        token = jsonData.accessToken;
        userId = jsonData._id;
        sessionStorage.setItem('event-user', JSON.stringify(user));
    });

    QUnit.test('login', async (assert) => {
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
        let jsonData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(jsonData.hasOwnProperty('email'), 'email exists');
        assert.equal(jsonData.email, user.email, 'email is present');
        assert.strictEqual(typeof jsonData.email, 'string', 'email has correct type');

        assert.ok(jsonData.hasOwnProperty('password'), 'password exists');
        assert.equal(jsonData.password, user.password, 'password is present');
        assert.strictEqual(typeof jsonData.password, 'string', 'password has correct type');

        assert.ok(jsonData.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof jsonData._id, 'string', '_id has correct type');

        assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn has correct type');

        assert.ok(jsonData.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof jsonData.accessToken, 'string', 'accessToken has correct type');

        token = jsonData.accessToken;
        userId = jsonData._id;
        sessionStorage.setItem('event-user', JSON.stringify(user));
    });
});

QUnit.module('event functionalities', () => {
    QUnit.test('get all events', async (assert) => {
        // Arrange
        let path = 'data/theaters';
        let queryParams = '?sortBy=_createdOn%20desc&distinct=title';

        // Act
        let response = await fetch(baseUrl + path + queryParams);
        let jsonData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');
        assert.ok(Array.isArray(jsonData), 'response is array');

        jsonData.forEach(element => {
            assert.ok(element.hasOwnProperty('author'), 'author exists');
            assert.strictEqual(typeof element.author, 'string', 'author is correct type');

            assert.ok(element.hasOwnProperty('date'), 'date exists');
            assert.strictEqual(typeof element.date, 'string', 'date is correct type');

            assert.ok(element.hasOwnProperty('description'), 'description exists');
            assert.strictEqual(typeof element.description, 'string', 'description is correct type');

            assert.ok(element.hasOwnProperty('imageUrl'), 'imageUrl exists');
            assert.strictEqual(typeof element.imageUrl, 'string', 'imageUrl is correct type');

            assert.ok(element.hasOwnProperty('title'), 'title exists');
            assert.strictEqual(typeof element.title, 'string', 'title is correct type');

            assert.ok(element.hasOwnProperty('_createdOn'), '_createdOn exists');
            assert.strictEqual(typeof element._createdOn, 'number', '_createdOn is correct type');

            assert.ok(element.hasOwnProperty('_id'), '_id exists');
            assert.strictEqual(typeof element._id, 'string', '_id is correct type');

            assert.ok(element.hasOwnProperty('_ownerId'), '_ownerId exists');
            assert.strictEqual(typeof element._ownerId, 'string', '_ownerId is correct type');
        });
    });

    QUnit.test('create an event', async (assert) => {
        // Arrange
        let path = 'data/theaters';
        let ranodm = Math.floor(Math.random() * 10000);
        myEvent.title = `title ${ranodm}`;
        myEvent.description = `description ${ranodm}`;

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(myEvent)
        });
        let jsonData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(jsonData.hasOwnProperty('author'), 'author exists');
        assert.strictEqual(jsonData.author, myEvent.author, 'author is expected')
        assert.strictEqual(typeof jsonData.author, 'string', 'author is correct type');

        assert.ok(jsonData.hasOwnProperty('date'), 'date exists');
        assert.strictEqual(jsonData.date, myEvent.date, 'date is expected')
        assert.strictEqual(typeof jsonData.date, 'string', 'date is correct type');

        assert.ok(jsonData.hasOwnProperty('description'), 'description exists');
        assert.strictEqual(jsonData.description, myEvent.description, 'description is expected')
        assert.strictEqual(typeof jsonData.description, 'string', 'description is correct type');

        assert.ok(jsonData.hasOwnProperty('imageUrl'), 'imageUrl exists');
        assert.strictEqual(jsonData.imageUrl, myEvent.imageUrl, 'imageUrl is expected')
        assert.strictEqual(typeof jsonData.imageUrl, 'string', 'imageUrl is correct type');

        assert.ok(jsonData.hasOwnProperty('title'), 'title exists');
        assert.strictEqual(jsonData.title, myEvent.title, 'title is expected')
        assert.strictEqual(typeof jsonData.title, 'string', 'title is correct type');

        assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn is correct type');

        assert.ok(jsonData.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof jsonData._id, 'string', '_id is correct type');

        assert.ok(jsonData.hasOwnProperty('_ownerId'), '_ownerId exists');
        assert.strictEqual(typeof jsonData._ownerId, 'string', '_ownerId is correct type');

        lastCreatedEventId = jsonData._id;
    });

    QUnit.test('edit an event', async (assert) => {
        // Arrange
        let path = 'data/theaters';
        let ranodm = Math.floor(Math.random() * 10000);
        myEvent.title = `title edited ${ranodm}`;

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(myEvent)
        });
        let jsonData = await response.json();

        // Assert
        assert.ok(response.ok, 'success response');

        assert.ok(jsonData.hasOwnProperty('author'), 'author exists');
        assert.strictEqual(jsonData.author, myEvent.author, 'author is expected')
        assert.strictEqual(typeof jsonData.author, 'string', 'author is correct type');

        assert.ok(jsonData.hasOwnProperty('date'), 'date exists');
        assert.strictEqual(jsonData.date, myEvent.date, 'date is expected')
        assert.strictEqual(typeof jsonData.date, 'string', 'date is correct type');

        assert.ok(jsonData.hasOwnProperty('description'), 'description exists');
        assert.strictEqual(jsonData.description, myEvent.description, 'description is expected')
        assert.strictEqual(typeof jsonData.description, 'string', 'description is correct type');

        assert.ok(jsonData.hasOwnProperty('imageUrl'), 'imageUrl exists');
        assert.strictEqual(jsonData.imageUrl, myEvent.imageUrl, 'imageUrl is expected')
        assert.strictEqual(typeof jsonData.imageUrl, 'string', 'imageUrl is correct type');

        assert.ok(jsonData.hasOwnProperty('title'), 'title exists');
        assert.strictEqual(jsonData.title, myEvent.title, 'title is expected')
        assert.strictEqual(typeof jsonData.title, 'string', 'title is correct type');

        assert.ok(jsonData.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof jsonData._createdOn, 'number', '_createdOn is correct type');

        assert.ok(jsonData.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof jsonData._id, 'string', '_id is correct type');

        assert.ok(jsonData.hasOwnProperty('_ownerId'), '_ownerId exists');
        assert.strictEqual(typeof jsonData._ownerId, 'string', '_ownerId is correct type');
    });

    QUnit.test('delete an event', async (assert) => {
        // Arrange
        let path = 'data/theaters';

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            }
        });

        // Assert
        assert.ok(response.ok, 'success response');
    });
});