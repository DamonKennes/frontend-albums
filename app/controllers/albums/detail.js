import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AlbumsDetailController extends Controller {
  @service store;
  @service router;

  @tracked newRatingText = '';
  @tracked newRatingScore = 5;

  @action
  addRating(e) {
    e?.preventDefault?.();
    const rating = this.store.createRecord('rating', {
      score: Number(this.newRatingScore),
      text: this.newRatingText,
      creationdate: new Date(),
      album: this.model,
    });
    rating.save();
    this.newRatingText = '';
    this.newRatingScore = 5;
  }

  @action
  async removeAlbum(e) {
    e.preventDefault();

    const ratings = await this.model.ratings;
    await Promise.all(ratings.map((rating) => rating.destroyRecord()));

    await this.model.destroyRecord();

    this.router.transitionTo('albums.index');
  }
}
