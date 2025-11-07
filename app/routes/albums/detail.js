import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AlbumsDetailRoute extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('album', params.album_id, {
      include: 'ratings,ratings.useraccount',
    });
  }
}
