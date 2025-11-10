import { module, test } from 'qunit';
import { setupTest } from 'frontend-albums-rating/tests/helpers';
import Service from '@ember/service';

module('Unit | Controller | albums/detail', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:albums/detail');
    assert.ok(controller);
  });

  test('it initializes with correct default values', function (assert) {
    let controller = this.owner.lookup('controller:albums/detail');

    assert.strictEqual(controller.newRatingText, '', 'newRatingText starts empty');
    assert.strictEqual(controller.newRatingScore, 0, 'newRatingScore starts at 0');
    assert.strictEqual(controller.showDeleteModal, false, 'showDeleteModal starts false');
    assert.strictEqual(controller.hasUserRating, false, 'hasUserRating starts false');
  });

  test('updateRatingScore updates the score', function (assert) {
    let controller = this.owner.lookup('controller:albums/detail');
    controller.updateRatingScore(4);
    assert.strictEqual(controller.newRatingScore, 4, 'score is updated to 4');
  });

  test('showDeleteConfirmation sets showDeleteModal to true', function (assert) {
    let controller = this.owner.lookup('controller:albums/detail');
    controller.showDeleteConfirmation();
    assert.true(controller.showDeleteModal, 'modal is shown');
  });

  test('cancelDelete sets showDeleteModal to false', function (assert) {
    let controller = this.owner.lookup('controller:albums/detail');
    controller.showDeleteModal = true;
    controller.cancelDelete();
    assert.false(controller.showDeleteModal, 'modal is hidden');
  });

  test('checkRating returns false when not authenticated', function (assert) {
    class MockSessionService extends Service {
      get isAuthenticated() {
        return false;
      }
    }
    this.owner.register('service:session', MockSessionService);

    let controller = this.owner.lookup('controller:albums/detail');

    const store = this.owner.lookup('service:store');
    const useraccount = store.createRecord('useraccount', { id: '1' });
    const rating = store.createRecord('rating', { useraccount });

    const result = controller.checkRating(rating);

    assert.false(result, 'returns false when not authenticated');
  });

  test('checkRating returns true when rating belongs to authenticated user', function (assert) {
    class MockSessionService extends Service {
      get isAuthenticated() {
        return true;
      }
      data = {
        authenticated: {
          data: {
            relationships: {
              account: {
                data: { id: '1' }
              }
            }
          }
        }
      };
    }
    this.owner.register('service:session', MockSessionService);

    let controller = this.owner.lookup('controller:albums/detail');

    const store = this.owner.lookup('service:store');
    const useraccount = store.createRecord('useraccount', { id: '1' });
    const rating = store.createRecord('rating', { useraccount });

    const result = controller.checkRating(rating);

    assert.true(result, 'returns true when rating belongs to user');
    assert.true(controller.hasUserRating, 'sets hasUserRating to true');
  });

  test('checkRating returns false when rating belongs to different user', function (assert) {
    class MockSessionService extends Service {
      get isAuthenticated() {
        return true;
      }
      data = {
        authenticated: {
          data: {
            relationships: {
              account: {
                data: { id: '1' }
              }
            }
          }
        }
      };
    }
    this.owner.register('service:session', MockSessionService);

    let controller = this.owner.lookup('controller:albums/detail');

    const store = this.owner.lookup('service:store');
    const useraccount = store.createRecord('useraccount', { id: '2' });
    const rating = store.createRecord('rating', { useraccount });

    const result = controller.checkRating(rating);

    assert.false(result, 'returns false when rating belongs to different user');
  });

  test('deleteRating sets hasUserRating to false', async function (assert) {
    let controller = this.owner.lookup('controller:albums/detail');
    controller.hasUserRating = true;

    const store = this.owner.lookup('service:store');
    const rating = store.createRecord('rating', {});
    rating.destroyRecord = function() {
      assert.step('destroyRecord called');
      return Promise.resolve();
    };

    await controller.deleteRating(rating);

    assert.false(controller.hasUserRating, 'hasUserRating is set to false');
    assert.verifySteps(['destroyRecord called']);
  });

  test('addRating resets form after saving', async function (assert) {
    class MockSessionService extends Service {
      data = {
        authenticated: {
          data: {
            relationships: {
              account: {
                data: { id: '1' }
              }
            }
          }
        }
      };
    }
    this.owner.register('service:session', MockSessionService);

    let controller = this.owner.lookup('controller:albums/detail');
    const store = this.owner.lookup('service:store');

    const useraccount = store.createRecord('useraccount', { id: '1' });
    const album = store.createRecord('album', {});

    store.findRecord = function() {
      return Promise.resolve(useraccount);
    };

    let createdRating = null;
    store.createRecord = function(modelName, attrs) {
      if (modelName === 'rating') {
        createdRating = {
          ...attrs,
          save: function() {
            assert.step('rating saved');
            return Promise.resolve();
          }
        };
        return createdRating;
      }
      return store.createRecord.call(store, modelName, attrs);
    };

    controller.model = album;
    controller.newRatingText = 'Great album!';
    controller.newRatingScore = 5;

    await controller.addRating();

    assert.strictEqual(controller.newRatingText, '', 'text is reset');
    assert.strictEqual(controller.newRatingScore, 0, 'score is reset');
    assert.true(controller.hasUserRating, 'hasUserRating is set to true');
    assert.verifySteps(['rating saved']);
  });
});
