import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-albums-rating/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | album-card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders album title', async function (assert) {
    const store = this.owner.lookup('service:store');
    const album = store.createRecord('album', {
      title: 'Abbey Road',
      cover: 'https://example.com/cover.jpg'
    });

    this.set('album', album);

    await render(hbs`<AlbumCard @album={{this.album}} />`);

    assert.dom('.album-card-title').hasText('Abbey Road', 'displays album title');
  });

  test('it renders album cover image when cover URL is provided', async function (assert) {
    const store = this.owner.lookup('service:store');
    const album = store.createRecord('album', {
      title: 'The Dark Side of the Moon',
      cover: 'https://example.com/dark-side.jpg'
    });

    this.set('album', album);

    await render(hbs`<AlbumCard @album={{this.album}} />`);

    assert.dom('.album-card-image img').exists('image element exists');
    assert.dom('.album-card-image img').hasAttribute('src', 'https://example.com/dark-side.jpg', 'image has src');
    assert.dom('.album-card-image img').hasAttribute('alt', 'The Dark Side of the Moon', 'image has alt');
  });

  test('it renders placeholder when no cover is provided', async function (assert) {
    const store = this.owner.lookup('service:store');
    const album = store.createRecord('album', {
      title: 'Unknown Album'
    });

    this.set('album', album);

    await render(hbs`<AlbumCard @album={{this.album}} />`);

    assert.dom('.album-card-placeholder').exists('placeholder exists');
    assert.dom('.album-card-placeholder').hasText('No Image', 'shows placeholder');
    assert.dom('.album-card-image img').doesNotExist('no image element');
  });

  test('it renders artist names', async function (assert) {
    const store = this.owner.lookup('service:store');
    const artist = store.createRecord('artist', {
      name: 'The Beatles'
    });
    const album = store.createRecord('album', {
      title: 'Abbey Road',
      artists: [artist]
    });

    this.set('album', album);

    await render(hbs`<AlbumCard @album={{this.album}} />`);

    assert.dom('.album-card-artist').hasText('The Beatles', 'displays artist');
  });

  test('it renders multiple artists', async function (assert) {
    const store = this.owner.lookup('service:store');
    const artist1 = store.createRecord('artist', {
      name: 'Daft Punk'
    });
    const artist2 = store.createRecord('artist', {
      name: 'Pharrell Williams'
    });
    const album = store.createRecord('album', {
      title: 'Random Access Memories',
      artists: [artist1, artist2]
    });

    this.set('album', album);

    await render(hbs`<AlbumCard @album={{this.album}} />`);

    assert.dom('.album-card-artist').exists({ count: 2 }, 'displays artists');
  });

  test('it renders as a link to album detail', async function (assert) {
    const store = this.owner.lookup('service:store');
    const album = store.createRecord('album', {
      id: '123',
      title: 'Test Album'
    });

    this.set('album', album);

    await render(hbs`<AlbumCard @album={{this.album}} />`);

    assert.dom('a.album-card').exists('card is a link');
    assert.dom('a.album-card').hasAttribute('href', '/albums/123', 'link points to detail');
  });
});
