import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-albums-rating/tests/helpers';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | modal-confirm', function (hooks) {
  setupRenderingTest(hooks);

  test('it does not render when isOpen is false', async function (assert) {
    await render(hbs`<ModalConfirm @isOpen={{false}} />`);

    assert.dom('.modal-overlay').doesNotExist('modal is not visible');
  });

  test('it renders when isOpen is true', async function (assert) {
    this.set('noop', () => {});

    await render(hbs`<ModalConfirm @isOpen={{true}} @onConfirm={{this.noop}} @onCancel={{this.noop}} />`);

    assert.dom('.modal-overlay').exists('modal overlay is visible');
    assert.dom('.modal-content').exists('modal content is visible');
  });

  test('it displays the title', async function (assert) {
    this.set('noop', () => {});

    await render(hbs`<ModalConfirm @isOpen={{true}} @title="Delete Item" @onConfirm={{this.noop}} @onCancel={{this.noop}} />`);

    assert.dom('.modal-header h2').hasText('Delete Item', 'displays the correct title');
  });

  test('it displays the message', async function (assert) {
    this.set('noop', () => {});

    await render(hbs`
      <ModalConfirm
        @isOpen={{true}}
        @message="Are you sure you want to delete this item?"
        @onConfirm={{this.noop}}
        @onCancel={{this.noop}}
      />
    `);

    assert.dom('.modal-body p').hasText('Are you sure you want to delete this item?', 'displays the correct message');
  });

  test('it calls onConfirm when confirm button is clicked', async function (assert) {
    this.set('confirmed', false);
    this.set('noop', () => {});
    this.set('handleConfirm', () => {
      this.set('confirmed', true);
      assert.step('confirm-clicked');
    });

    await render(hbs`
      <ModalConfirm
        @isOpen={{true}}
        @onConfirm={{this.handleConfirm}}
        @onCancel={{this.noop}}
      />
    `);

    await click('.button-confirm');

    assert.verifySteps(['confirm-clicked'], 'onConfirm was called');
    assert.true(this.confirmed, 'confirm action was executed');
  });

  test('it calls onCancel when cancel button is clicked', async function (assert) {
    this.set('cancelled', false);
    this.set('noop', () => {});
    this.set('handleCancel', () => {
      this.set('cancelled', true);
      assert.step('cancel-clicked');
    });

    await render(hbs`
      <ModalConfirm
        @isOpen={{true}}
        @onConfirm={{this.noop}}
        @onCancel={{this.handleCancel}}
      />
    `);

    await click('.button-cancel');

    assert.verifySteps(['cancel-clicked'], 'onCancel was called');
    assert.true(this.cancelled, 'cancel action was executed');
  });

  test('it calls onCancel when overlay is clicked', async function (assert) {
    this.set('cancelled', false);
    this.set('noop', () => {});
    this.set('handleCancel', () => {
      this.set('cancelled', true);
      assert.step('cancel-clicked');
    });

    await render(hbs`
      <ModalConfirm
        @isOpen={{true}}
        @onConfirm={{this.noop}}
        @onCancel={{this.handleCancel}}
      />
    `);

    await click('.modal-overlay');

    assert.verifySteps(['cancel-clicked'], 'onCancel was called when overlay clicked');
    assert.true(this.cancelled, 'cancel action was executed');
  });

  test('it displays custom confirm button text', async function (assert) {
    this.set('noop', () => {});

    await render(hbs`
      <ModalConfirm
        @isOpen={{true}}
        @confirmText="Delete"
        @onConfirm={{this.noop}}
        @onCancel={{this.noop}}
      />
    `);

    assert.dom('.button-confirm').hasText('Delete', 'displays custom confirm text');
  });

  test('it displays default confirm button text when not set', async function (assert) {
    this.set('noop', () => {});

    await render(hbs`<ModalConfirm @isOpen={{true}} @onConfirm={{this.noop}} @onCancel={{this.noop}} />`);

    assert.dom('.button-confirm').hasText('Yes', 'displays default confirm text');
  });

  test('it always displays "Cancel" for cancel button', async function (assert) {
    this.set('noop', () => {});

    await render(hbs`<ModalConfirm @isOpen={{true}} @onConfirm={{this.noop}} @onCancel={{this.noop}} />`);

    assert.dom('.button-cancel').hasText('Cancel', 'displays Cancel text');
  });
});
