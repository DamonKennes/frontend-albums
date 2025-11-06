import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AlbumsIndexRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('album', { include: 'artists,ratings,ratings.gebruiker' });
  }
}
