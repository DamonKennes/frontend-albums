import { setupTest } from 'frontend-albums-rating/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | artist', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('artist', {});
    assert.ok(model, 'model exists');
  });

  test('it has name attribute', function (assert) {
    const store = this.owner.lookup('service:store');
    const artist = store.createRecord('artist', {
      name: 'The Beatles',
    });

    assert.strictEqual(artist.name, 'The Beatles', 'name ok');
  });

  test('artist has albums relationship', async function (assert) {
    const store = this.owner.lookup('service:store');

    const artist = store.createRecord('artist', { name: 'Pink Floyd' });
    const album = store.createRecord('album', {
      title: 'The Dark Side of the Moon',
      artists: [artist],
    });

    const albums = await artist.albums;
    assert.strictEqual(albums.length, 1, 'artist has one album');
    assert.strictEqual(albums[0].title, 'The Dark Side of the Moon');
    const artists = await album.artists;
    assert.strictEqual(artists[0].name, 'Pink Floyd');
  });

  test('it can have multiple albums', async function (assert) {
    const store = this.owner.lookup('service:store');
    const artist = store.createRecord('artist', {
      name: 'The Beatles',
    });
    store.createRecord('album', {
      title: 'Abbey Road',
      artists: [artist],
    });
    store.createRecord('album', {
      title: 'Let It Be',
      artists: [artist],
    });

    const albums = await artist.albums;
    assert.strictEqual(albums.length, 2, 'artist has two albums');
  });
});
