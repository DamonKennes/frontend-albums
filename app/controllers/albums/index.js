import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AlbumsIndexController extends Controller {
  @service session;

  @tracked albumInput = '';
  @tracked artistInput = '';

  @action
  resetFilters() {
    this.albumInput = '';
    this.artistInput = '';
  }

  get filteredAlbums() {
    return this.model.filter(
      (a) =>
        a.title.toLowerCase().includes(this.albumInput.toLowerCase()) &&
        a.artists.some((artist) =>
          artist.name.toLowerCase().includes(this.artistInput.toLowerCase()),
        ),
    );
  }
}
