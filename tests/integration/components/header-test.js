import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-albums-rating/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the logo', async function (assert) {
    await render(hbs`<Header />`);

    assert.dom('.header-logo h1').hasText('DoReMi', 'displays app name');
  });

  test('logo links to albums index', async function (assert) {
    await render(hbs`<Header />`);

    assert.dom('.header-logo').hasAttribute('href', '/albums', 'logo links to albums index');
  });

  test('it shows login and register links when not authenticated', async function (assert) {
    class MockSessionService extends Service {
      get isAuthenticated() {
        return false;
      }
    }
    this.owner.register('service:session', MockSessionService);

    await render(hbs`<Header />`);

    assert.dom('a.nav-link[href="/login"]').exists('login link exists');
    assert.dom('a.nav-link[href="/login"]').hasText('Login', 'login link has correct text');
    assert.dom('a.nav-link[href="/register"]').exists('register link exists');
    assert.dom('a.nav-link[href="/register"]').hasText('Register', 'register link has correct text');
    assert.dom('a.nav-link[href*="/albums/new"]').doesNotExist('add album link is hidden');
  });


  test('it shows add album link and logout button when authenticated', async function (assert) {
    class MockSessionService extends Service {
      get isAuthenticated() {
        return true;
      }
    }
    this.owner.register('service:session', MockSessionService);

    await render(hbs`<Header />`);

    assert.dom('a.nav-link[href*="/albums/new"]').exists('add album link exists');
    assert.dom('a.nav-link[href*="/albums/new"]').hasText('Add Album', 'add album link has correct text');
    assert.dom('a.nav-link[href="/login"]').doesNotExist('login link is hidden');
    assert.dom('a.nav-link[href="/register"]').doesNotExist('register link is hidden');
  });
});
