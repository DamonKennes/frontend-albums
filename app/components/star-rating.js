import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class StarRatingComponent extends Component {
  @tracked hoverRating = 0;

  stars = [1, 2, 3, 4, 5];

  @action
  selectRating(rating) {
    if (this.args.onChange) {
      this.args.onChange(rating);
    }
  }

  @action
  setHover(rating) {
    this.hoverRating = rating;
  }

  @action
  clearHover() {
    this.hoverRating = 0;
  }
}