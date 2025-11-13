import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AlbumsDetailRoute extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('album', params.album_id, {
      include: 'ratings,ratings.useraccount',
    });
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.newRatingText = '';
      controller.newRatingScore = 0;
      controller.showDeleteModal = false;
      controller.hasUserRating = false;
    }
  }
}
