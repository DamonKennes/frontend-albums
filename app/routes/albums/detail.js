import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AlbumsDetailRoute extends Route {
  @service store;
  @service currentUser;

  async beforeModel() {
    await this.currentUser.load();
  }

  async model(params) {
    return this.store.findRecord('album', params.album_id, {
      include: 'ratings,ratings.gebruiker',
    });
  }

  async setupController(controller, model) {
    super.setupController(controller, model);
    const ratings = await model.ratings;

    const ratingsArray = ratings.slice();
    await Promise.all(ratingsArray.map(rating => rating.gebruiker));

    const userRating = ratingsArray.find(rating => {
      return rating.belongsTo('gebruiker').id() === this.currentUser.user?.id;
    });

    controller.hasUserRating = !!userRating;
  }
}
