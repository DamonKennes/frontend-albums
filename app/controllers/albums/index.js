import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AlbumsIndexController extends Controller {
  @service session;

  @tracked albumInput = '';
  @tracked artistInput = '';
  @tracked ratedFilter = false;

  @action
  resetFilters() {
    this.albumInput = '';
    this.artistInput = '';
    this.ratedFilter = false;
  }

  get filteredAlbums() {
    let albums = this.model;

    if (this.ratedFilter) {
      albums = albums.filter((item) => {
        let ratings = item.hasMany('ratings').value();
        return (
          ratings &&
          ratings.some(
            (rating) =>
              rating.useraccount.id ===
              this.session.data.authenticated.data.relationships.account.data
                .id,
          )
        );
      });
    }

    return albums.filter(
      (a) =>
        a.title.toLowerCase().includes(this.albumInput.toLowerCase()) &&
        a.artists.some((artist) =>
          artist.name.toLowerCase().includes(this.artistInput.toLowerCase()),
        ),
    );
  }
}
