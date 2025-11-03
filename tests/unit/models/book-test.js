import { setupTest } from 'frontend-albums-rating/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | book', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('album.js', {});
    assert.ok(model, 'model exists');
  });
});
