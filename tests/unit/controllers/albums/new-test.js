import { module, test } from 'qunit';
import { setupTest } from 'frontend-albums-rating/tests/helpers';

module('Unit | Controller | albums/new', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:albums/new');
    assert.ok(controller);
  });

  test('it initializes with correct default values', function (assert) {
    let controller = this.owner.lookup('controller:albums/new');

    assert.strictEqual(controller.newTitle, '', 'newTitle starts empty');
    assert.strictEqual(controller.newReleaseDate, '', 'newReleaseDate starts empty');
    assert.strictEqual(controller.newCoverUrl, '', 'newCoverUrl starts empty');
    assert.strictEqual(controller.newGenre, '', 'newGenre starts empty');
    assert.deepEqual(controller.artistNames, [''], 'artistNames starts empty');
  });

  test('resetForm clears all form fields', function (assert) {
    let controller = this.owner.lookup('controller:albums/new');

    controller.newTitle = 'Test Album';
    controller.newReleaseDate = '2024-01-01';
    controller.newCoverUrl = 'http://example.com/cover.jpg';
    controller.newGenre = 'Rock';
    controller.artistNames = ['Test Artist', 'Another Artist'];

    controller.resetForm();

    assert.strictEqual(controller.newTitle, '', 'newTitle is cleared');
    assert.strictEqual(controller.newReleaseDate, '', 'newReleaseDate is cleared');
    assert.strictEqual(controller.newCoverUrl, '', 'newCoverUrl is cleared');
    assert.strictEqual(controller.newGenre, '', 'newGenre is cleared');
    assert.deepEqual(controller.artistNames, [''], 'artistNames is cleared');
  });

  test('cancel resets form and transitions to albums index', function (assert) {
    let controller = this.owner.lookup('controller:albums/new');
    const router = this.owner.lookup('service:router');

    controller.newTitle = 'Test Album';
    controller.artistNames = ['Test Artist'];

    router.transitionTo = function(route) {
      assert.step(`transitioned to ${route}`);
    };

    controller.cancel();

    assert.strictEqual(controller.newTitle, '', 'form is reset');
    assert.verifySteps(['transitioned to albums.index']);
  });

  test('createAlbum creates album with correct attributes', async function (assert) {
    let controller = this.owner.lookup('controller:albums/new');
    const store = this.owner.lookup('service:store');
    const router = this.owner.lookup('service:router');

    controller.newTitle = 'Test Album';
    controller.newReleaseDate = '2024-01-15';
    controller.newCoverUrl = 'http://example.com/cover.jpg';
    controller.newGenre = 'Rock';
    controller.artistNames = [''];

    let createdAlbum = null;
    const originalCreateRecord = store.createRecord.bind(store);
    store.createRecord = function(modelName, attrs) {
      if (modelName === 'album') {
        createdAlbum = {
          id: '123',
          ...attrs,
          artists: Promise.resolve([]),
          save: function() {
            assert.step('album saved');
            return Promise.resolve();
          }
        };
        return createdAlbum;
      }
      return originalCreateRecord(modelName, attrs);
    };

    router.transitionTo = function(route, id) {
      assert.step(`transitioned to ${route} with id ${id}`);
    };

    const event = { preventDefault: () => {} };
    await controller.createAlbum(event);

    assert.strictEqual(createdAlbum.title, 'Test Album', 'album has correct title');
    assert.strictEqual(createdAlbum.cover, 'http://example.com/cover.jpg', 'album has correct cover');
    assert.strictEqual(createdAlbum.genre, 'Rock', 'album has correct genre');
    assert.strictEqual(createdAlbum.averagerating, 0, 'album has averagerating of 0');
    assert.verifySteps(['album saved', 'transitioned to albums.detail with id 123']);
  });

  test('createAlbum creates new artist when artist name is provided and does not exist', async function (assert) {
    let controller = this.owner.lookup('controller:albums/new');
    const store = this.owner.lookup('service:store');
    const router = this.owner.lookup('service:router');

    controller.newTitle = 'Test Album';
    controller.artistNames = ['New Artist'];

    let createdArtist = null;
    const albumArtists = [];

    store.query = function(modelName, query) {
      if (modelName === 'artist') {
        assert.step('queried for existing artist');
        return Promise.resolve([]);
      }
    };

    const originalCreateRecord = store.createRecord.bind(store);
    store.createRecord = function(modelName, attrs) {
      if (modelName === 'artist') {
        createdArtist = {
          ...attrs,
          save: function() {
            assert.step('artist saved');
            return Promise.resolve();
          }
        };
        return createdArtist;
      }
      if (modelName === 'album') {
        return {
          id: '123',
          ...attrs,
          artists: Promise.resolve(albumArtists),
          save: function() {
            assert.step('album saved');
            return Promise.resolve();
          }
        };
      }
      return originalCreateRecord(modelName, attrs);
    };

    router.transitionTo = function() {};

    const event = { preventDefault: () => {} };
    await controller.createAlbum(event);

    assert.strictEqual(createdArtist.name, 'New Artist', 'artist was created with correct name');
    assert.ok(albumArtists.includes(createdArtist), 'artist was added to album');
    assert.verifySteps(['queried for existing artist', 'artist saved', 'album saved']);
  });

  test('createAlbum uses existing artist when artist name matches', async function (assert) {
    let controller = this.owner.lookup('controller:albums/new');
    const store = this.owner.lookup('service:store');
    const router = this.owner.lookup('service:router');

    controller.newTitle = 'Test Album';
    controller.artistNames = ['Existing Artist'];

    const existingArtist = { id: '1', name: 'Existing Artist' };
    const albumArtists = [];

    store.query = function(modelName, query) {
      if (modelName === 'artist' && query.filter.name === 'Existing Artist') {
        assert.step('queried for existing artist');
        return Promise.resolve([existingArtist]);
      }
      return Promise.resolve([]);
    };

    const originalCreateRecord = store.createRecord.bind(store);
    store.createRecord = function(modelName, attrs) {
      if (modelName === 'artist') {
        assert.ok(false, 'should not create new artist when one exists');
      }
      if (modelName === 'album') {
        return {
          id: '123',
          ...attrs,
          artists: Promise.resolve(albumArtists),
          save: function() {
            assert.step('album saved');
            return Promise.resolve();
          }
        };
      }
      return originalCreateRecord(modelName, attrs);
    };

    router.transitionTo = function() {};

    const event = { preventDefault: () => {} };
    await controller.createAlbum(event);

    assert.ok(albumArtists.includes(existingArtist), 'existing artist was added to album');
    assert.verifySteps(['queried for existing artist', 'album saved']);
  });
});
