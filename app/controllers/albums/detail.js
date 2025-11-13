import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class AlbumsDetailController extends Controller {
  @service store;
  @service router;
  @service session;

  @tracked newRatingText = '';
  @tracked newRatingScore = 0;
  @tracked showDeleteModal = false;
  @tracked hasUserRating = false;

  @action
  updateRatingScore(score) {
    this.newRatingScore = score;
  }

  @action async addRating(e) {
    e?.preventDefault?.();
    const useraccountID = this.session.data.authenticated.data.relationships.account.data.id;
    const useraccount = await this.store.findRecord('useraccount', useraccountID);
    const rating = this.store.createRecord('rating', {
      score: Number(this.newRatingScore),
      text: this.newRatingText,
      creationdate: new Date(),
      album: this.model,
      useraccount: useraccount,
    });
    await rating.save();
    this.newRatingText = '';
    this.newRatingScore = 0;
    this.hasUserRating = true;
  }

  @action
  showDeleteConfirmation(e) {
    e?.preventDefault?.();
    this.showDeleteModal = true;
  }

  @action
  cancelDelete() {
    this.showDeleteModal = false;
  }

  @action
  checkRating(rating) {
    if(!this.session.isAuthenticated){
      return false
    }

    if(rating.useraccount.id === this.session.data.authenticated.data.relationships.account.data.id){
      this.hasUserRating = true;
    }

    return rating.useraccount.id === this.session.data.authenticated.data.relationships.account.data.id;;
  }

  @action
  async confirmDelete() {
    this.showDeleteModal = false;
    const ratings = await this.model.ratings;
    await Promise.all(ratings.map((rating) => rating.destroyRecord()));
    await this.model.destroyRecord();
    this.router.transitionTo('albums.index');
  }

  @action
  async deleteRating(rating) {
    rating.destroyRecord();
    this.hasUserRating = false;
  }
}
