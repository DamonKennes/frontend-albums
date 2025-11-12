import { setupTest } from 'frontend-albums-rating/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | useraccount', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('useraccount', {});
    assert.ok(model, 'model exists');
  });

  test('it has accountname attribute', async function (assert) {
    const store = this.owner.lookup('service:store');
    const date1 = new Date('2025-01-15');
    const date2 = new Date('2025-02-20');

    const gebruiker = store.createRecord('gebruiker', {
      voornaam: 'John',
      achternaam: 'Doe',
    });

    const useraccount = store.createRecord('useraccount', {
      accountname: 'john_doe',
      created: date1,
      modified: date2,
      gebruiker: gebruiker,
    });

    assert.strictEqual(useraccount.accountname, 'john_doe', 'accountname ok');
    assert.strictEqual(
      useraccount.created.getTime(),
      date1.getTime(),
      'created date ok',
    );
    assert.strictEqual(
      useraccount.modified.getTime(),
      date2.getTime(),
      'modified date ok',
    );
    const accountGebruiker = await useraccount.gebruiker;
    assert.strictEqual(accountGebruiker.voornaam, 'John', 'gebruiker ok');
  });

  test('it has ratings relationship', async function (assert) {
    const store = this.owner.lookup('service:store');
    const useraccount = store.createRecord('useraccount', {
      accountname: 'test_account',
    });
    store.createRecord('rating', {
      score: 5,
      useraccount: useraccount,
    });

    const ratings = await useraccount.ratings;
    assert.ok(ratings.length === 1, '1 rating is added');
  });

  test('useraccount can have multiple ratings', async function (assert) {
    const store = this.owner.lookup('service:store');
    const useraccount = store.createRecord('useraccount', {
      accountname: 'rater',
    });
    store.createRecord('rating', {
      score: 5,
      useraccount: useraccount,
    });
    store.createRecord('rating', {
      score: 4,
      useraccount: useraccount,
    });

    const ratings = await useraccount.ratings;
    assert.ok(ratings.length === 2, '2 ratings are added');
  });
});
