import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-albums-rating/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | mu-register', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MuRegister />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <MuRegister>
        template block text
      </MuRegister>
    `);

    assert.dom().hasText('template block text');
  });
});
