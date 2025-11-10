import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import {
  setupApplicationTest,
  authenticateSession,
  invalidateSession,
} from 'frontend-albums-rating/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | albums', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting the albums index page', async function (assert) {
    this.server.createList('album', 5);

    await visit('/albums');
    assert.strictEqual(currentURL(), '/albums', 'navigates to albums index');
  });

  test('viewing album details', async function (assert) {
    const artist = this.server.create('artist', {
      name: 'The Beatles',
    });

    const album = this.server.create('album', {
      title: 'Abbey Road',
      cover: 'https://example.com/abbey-road.jpg',
      releasedate: new Date('1969-09-26'),
      genre: 'Rock',
      averagerating: 4.8,
      artists: [artist],
    });

    await visit('/albums');
    assert.dom('.album-card').exists('album cards are displayed');

    await click(`a[href="/albums/${album.id}"]`);
    assert.strictEqual(
      currentURL(),
      `/albums/${album.id}`,
      'navigates to album detail page',
    );
    assert.dom('.album-detail').exists('album detail page is displayed');
    assert
      .dom('.album-detail-info h1')
      .hasText('Abbey Road', 'album title is displayed');
    assert
      .dom('.album-artist')
      .hasText('The Beatles', 'artist name is displayed');
    assert
      .dom('.album-detail-info')
      .containsText('Rock', 'genre is displayed');
    assert
      .dom('.album-detail-info')
      .containsText('4.8', 'average rating is displayed');
  });

  test('viewing album details as unauthenticated user', async function (assert) {
    await invalidateSession();

    const artist = this.server.create('artist', {
      name: 'The Beatles',
    });

    const album = this.server.create('album', {
      title: 'Abbey Road',
      cover: 'https://example.com/abbey-road.jpg',
      releasedate: new Date('1969-09-26'),
      genre: 'Rock',
      averagerating: 4.8,
      artists: [artist],
    });

    await visit(`/albums/${album.id}`);

    assert.dom('.album-detail').exists('album detail page is displayed');
    assert
      .dom('.album-detail-info h1')
      .hasText('Abbey Road', 'album title is displayed');

    assert
      .dom('.album-detail-info button')
      .doesNotExist('delete album button is not visible');
    assert
      .dom('.add-rating-form')
      .doesNotExist('add rating form is not visible');
    assert
      .dom('.album-ratings')
      .containsText(
        'Login to read user reviews!',
        'shows login prompt for reviews',
      );
  });

  test('viewing album details as authenticated user', async function (assert) {
    await authenticateSession();

    const artist = this.server.create('artist', {
      name: 'The Beatles',
    });

    const album = this.server.create('album', {
      title: 'Abbey Road',
      cover: 'https://example.com/abbey-road.jpg',
      releasedate: new Date('1969-09-26'),
      genre: 'Rock',
      averagerating: 4.8,
      artists: [artist],
    });

    await visit(`/albums/${album.id}`);

    assert.dom('.album-detail').exists('album detail page is displayed');
    assert
      .dom('.album-detail-info h1')
      .hasText('Abbey Road', 'album title is displayed');

    assert
      .dom('.album-detail-info button')
      .hasText('Delete Album', 'delete album button is visible');
    assert
      .dom('.add-rating-form')
      .exists('add rating form is visible to authenticated users');
    assert
      .dom('.add-rating-form h4')
      .hasText('Add Your Review', 'add review heading is displayed');
  });


  test('login and register pages redirect for authenticated users', async function (assert) {
    await authenticateSession();

    await visit(`/login`);
    assert.strictEqual(
      currentURL(),
      `/albums`,
      'redirect to albums',
    );

    await visit(`/register`);
    assert.strictEqual(
      currentURL(),
      `/albums`,
      'redirect to albums',
    );
  });

  test('login and register pages dont redirect for unauthenticated users', async function (assert) {
    await visit(`/login`);
    assert.strictEqual(
      currentURL(),
      `/login`,
      'login page is displayed',
    );

    await visit(`/register`);
    assert.strictEqual(
      currentURL(),
      `/register`,
      'register page is displayed',
    );
  });
});
