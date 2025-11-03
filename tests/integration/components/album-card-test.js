import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-albums-rating/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | album-card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<AlbumCard />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <AlbumCard>
        template block text
      </AlbumCard>
    `);

    assert.dom().hasText('template block text');
  });
});
