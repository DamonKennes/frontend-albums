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
  @tracked artistNames = [''];

  resetForm() {
    this.newTitle = '';
    this.newReleaseDate = '';
    this.newCoverUrl = '';
    this.newGenre = '';
    this.artistNames = [''];
  }

  @action
  addArtistField() {
    this.artistNames = [...this.artistNames, ''];
  }

  @action
  removeArtistField(index) {
    if (this.artistNames.length > 1) {
      this.artistNames = this.artistNames.filter((_, i) => i !== index);
    }
  }

  @action
  updateArtistName(index, event) {
    this.artistNames[index] = event.target.value;
  }

  @action
  async createAlbum(e) {
    e.preventDefault();

    const artistNamesTrimmed = this.artistNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const artists = [];
    for (const artistName of artistNamesTrimmed) {
      const existingArtists = await this.store.query('artist', {
        filter: { name: artistName },
      });

      let artist;
      if (existingArtists.length > 0) {
        artist = existingArtists[0];
      } else {
        artist = this.store.createRecord('artist', { name: artistName });
        await artist.save();
      }
      artists.push(artist);
    }

    const attrs = {
      title: this.newTitle,
      releasedate: this.newReleaseDate ? new Date(this.newReleaseDate) : null,
      cover: this.newCoverUrl,
      genre: this.newGenre,
      averagerating: 0,
    };

    const album = this.store.createRecord('album', attrs);

    if (artists.length > 0) {
      const albumArtists = await album.artists;
      artists.forEach((artist) => albumArtists.push(artist));
    }

    await album.save();
    this.resetForm();
    this.router.transitionTo('albums.detail', album.id);
  }

  @action
  cancel() {
    this.resetForm();
    this.router.transitionTo('albums.index');
  }
}
