import { setupTest } from 'frontend-albums-rating/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | rating', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('rating', {});
    assert.ok(model, 'model exists');
  });

  test('it has score attribute', function (assert) {
    const store = this.owner.lookup('service:store');
    const rating = store.createRecord('rating', {
      score: 5
    });

    assert.strictEqual(rating.score, 5, 'score ok');
  });

  test('it has text attribute', function (assert) {
    const store = this.owner.lookup('service:store');
    const rating = store.createRecord('rating', {
      text: 'Great album!'
    });

    assert.strictEqual(rating.text, 'Great album!', 'text ok');
  });

  test('it has creationdate attribute', function (assert) {
    const store = this.owner.lookup('service:store');
    const date = new Date('2025-01-15');
    const rating = store.createRecord('rating', {
      creationdate: date
    });

    assert.strictEqual(rating.creationdate.getTime(), date.getTime(), 'creationdate ok');
  });

  test('it has album relationship', async function (assert) {
    const store = this.owner.lookup('service:store');
    const album = store.createRecord('album', {
      title: 'Test Album'
    });
    const rating = store.createRecord('rating', {
      score: 4,
      album: album
    });

    const ratingAlbum = await rating.album;
    assert.strictEqual(ratingAlbum.title, 'Test Album', 'album relationship ok');
  });

  test('it has useraccount relationship', async function (assert) {
    const store = this.owner.lookup('service:store');
    const useraccount = store.createRecord('useraccount', {
      accountname: 'testuser'
    });
    const rating = store.createRecord('rating', {
      score: 5,
      useraccount: useraccount
    });

    const ratingUser = await rating.useraccount;
    assert.strictEqual(ratingUser.accountname, 'testuser', 'useraccount relationship ok');
  });
});
