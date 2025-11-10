import { module, test } from 'qunit';
import { setupTest } from 'frontend-albums-rating/tests/helpers';

module('Unit | Service | session', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:session');
    assert.ok(service);
  });
});
