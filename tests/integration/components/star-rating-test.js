import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-albums-rating/tests/helpers';
import { render, click, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | star-rating', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders 5 stars', async function (assert) {
    await render(hbs`<StarRating />`);

    assert.dom('.star').exists({ count: 5 }, 'renders 5 stars');
  });

  test('it displays correct number of filled stars based on value', async function (assert) {
    this.set('rating', 3);

    await render(hbs`<StarRating @value={{this.rating}} />`);

    assert.dom('.star-filled').exists({ count: 3 }, 'shows 3 filled stars for rating of 3');
  });

  test('it calls onChange action when a star is clicked', async function (assert) {
    this.set('rating', 0);
    this.set('changeRating', (newRating) => {
      this.set('rating', newRating);
      assert.step(`rating-changed-${newRating}`);
    });

    await render(hbs`<StarRating @value={{this.rating}} @onChange={{this.changeRating}} />`);

    await click('.star:nth-child(4)');

    assert.verifySteps(['rating-changed-4'], 'onChange was called with rating 4');
    assert.strictEqual(this.rating, 4, 'rating was updated to 4');
  });

  test('it shows hover effect when mouse enters and mouse leaves', async function (assert) {
    await render(hbs`<StarRating @value={{0}} />`);

    await triggerEvent('.star:nth-child(3)', 'mouseenter');
    assert.dom('.star-hover').exists({ count: 3 }, 'shows hover effect');

    await triggerEvent('.star:nth-child(3)', 'mouseleave');
    assert.dom('.star-hover').doesNotExist('hover effect is cleared');
  });

  test('it renders as readonly when readOnly is true', async function (assert) {
    this.set('rating', 4);

    await render(hbs`<StarRating @value={{this.rating}} @readOnly={{true}} />`);

    assert.dom('.star-rating-readonly').exists('has readonly class');
    assert.dom('.star button').doesNotExist('does not render interactive buttons');
    assert.dom('span.star').exists({ count: 5 }, 'renders static spans instead');
    assert.dom('.star-filled').exists({ count: 4 }, 'shows 2 filled stars in readonly mode');

  });


  test('it allows selecting all ratings from 1 to 5', async function (assert) {
    let selectedRating = 0;
    this.set('changeRating', (rating) => {
      selectedRating = rating;
    });

    await render(hbs`<StarRating @onChange={{this.changeRating}} />`);

    for (let i = 1; i <= 5; i++) {
      await click(`.star:nth-child(${i})`);
      assert.strictEqual(selectedRating, i, `can select rating ${i}`);
    }
  });

  test('it updates display when value prop changes', async function (assert) {
    this.set('rating', 2);

    await render(hbs`<StarRating @value={{this.rating}} />`);

    assert.dom('.star-filled').exists({ count: 2 }, 'initially shows 2 filled stars');

    this.set('rating', 5);

    assert.dom('.star-filled').exists({ count: 5 }, 'updates to show 5 filled stars');
  });
});
