import { setupTest } from 'frontend-albums-rating/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | album', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('album', {});
    assert.ok(model, 'model exists');
  });

  test('it has correct attributes', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('album', {
      title: 'Abbey Road',
      releasedate: new Date('1969-09-26'),
      cover: 'https://example.com/cover.jpg',
      genre: 'Rock',
      averagerating: 4.5,
    });

    assert.strictEqual(model.title, 'Abbey Road', 'title attribute exists');
    assert.ok(model.releasedate instanceof Date, 'releasedate is a Date');
    assert.strictEqual(
      model.cover,
      'https://example.com/cover.jpg',
      'cover attribute exists',
    );
    assert.strictEqual(model.genre, 'Rock', 'genre attribute exists');
    assert.strictEqual(
      model.averagerating,
      4.5,
      'averagerating attribute exists',
    );
  });

  test('it has artists relationship', async function (assert) {
    const store = this.owner.lookup('service:store');
    const artist = store.createRecord('artist', {
      name: 'The Beatles',
    });
    const album = store.createRecord('album', {
      title: 'Abbey Road',
      artists: [artist],
    });

    const albumArtists = await album.artists;
    assert.strictEqual(albumArtists.length, 1, 'album has one artist');
    assert.strictEqual(
      albumArtists[0].name,
      'The Beatles',
      'artist relationship works',
    );
  });

  test('it has ratings relationship', async function (assert) {
    const store = this.owner.lookup('service:store');
    const album = store.createRecord('album', {
      title: 'Test Album',
    });
    store.createRecord('rating', {
      score: 5,
      album: album,
    });

    const ratings = await album.ratings;
    assert.strictEqual(ratings.length, 1, 'album has one rating');
    assert.strictEqual(ratings[0].score, 5, 'ratings relationship works');
  });

  test('it can have multiple artists', async function (assert) {
    const store = this.owner.lookup('service:store');
    const artist1 = store.createRecord('artist', { name: 'Daft Punk' });
    const artist2 = store.createRecord('artist', { name: 'Pharrell Williams' });
    const album = store.createRecord('album', {
      title: 'Random Access Memories',
      artists: [artist1, artist2],
    });

    const albumArtists = await album.artists;
    assert.strictEqual(albumArtists.length, 2, 'album has two artists');
  });

  test('it can have multiple ratings', async function (assert) {
    const store = this.owner.lookup('service:store');
    const album = store.createRecord('album', {
      title: 'Test Album',
    });
    store.createRecord('rating', {
      score: 5,
      album: album,
    });
    store.createRecord('rating', {
      score: 4,
      album: album,
    });

    const ratings = await album.ratings;
    assert.strictEqual(ratings.length, 2, 'album has two ratings');
  });
});
