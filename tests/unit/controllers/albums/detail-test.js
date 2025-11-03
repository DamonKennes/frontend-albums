import { module, test } from 'qunit';
import { setupTest } from 'frontend-albums-rating/tests/helpers';

module('Unit | Controller | albums/detail', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:albums/detail');
    assert.ok(controller);
  });
});
