import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AlbumsDetailRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('album', params.album_id, {
      include: 'artists,ratings'
    });
  }
}
