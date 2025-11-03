import { module, test } from 'qunit';
import { setupTest } from 'frontend-albums-rating/tests/helpers';

module('Unit | Route | albums/detail', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:albums/detail');
    assert.ok(route);
  });
});
