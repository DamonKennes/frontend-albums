import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AlbumsNewController extends Controller {
  @service store;
  @service router;

  @tracked newTitle = '';
  @tracked newReleaseDate = '';
  @tracked newCoverUrl = '';
  @tracked newGenre = '';
  @tracked newArtistName = '';

  @action
  async createAlbum(e) {
    e.preventDefault();

    let artist = null;
    if (this.newArtistName.trim()) {
      const artistName = this.newArtistName.trim();

      const existingArtists = await this.store.query('artist', {
        filter: { name: artistName },
      });

      if (existingArtists.length > 0) {
        artist = existingArtists[0];
      } else {
        artist = this.store.createRecord('artist', { name: artistName });
        await artist.save();
      }
    }

    const attrs = {
      title: this.newTitle,
      releasedate: this.newReleaseDate ? new Date(this.newReleaseDate) : null,
      cover: this.newCoverUrl,
      genre: this.newGenre,
      averagerating: 0
    };

    const album = this.store.createRecord('album', attrs);

    if (artist) {
      console.log("test")
      const artists = await album.artists;
      artists.push(artist);
    }

    await album.save();

    this.newTitle = '';
    this.newReleaseDate = '';
    this.newCoverUrl = '';
    this.newGenre = '';
    this.newArtistName = '';

    this.router.transitionTo('albums.detail', album.id);
  }

  @action
  cancel() {
    this.router.transitionTo('albums.index');
  }
}
