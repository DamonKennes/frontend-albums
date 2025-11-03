import { setupTest } from 'frontend-albums-rating/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | artist', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('artist', {});
    assert.ok(model, 'model exists');
  });
});
