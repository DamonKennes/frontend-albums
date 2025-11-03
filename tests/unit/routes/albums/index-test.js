import { module, test } from 'qunit';
import { setupTest } from 'frontend-albums-rating/tests/helpers';

module('Unit | Route | albums/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:albums/index');
    assert.ok(route);
  });
});
