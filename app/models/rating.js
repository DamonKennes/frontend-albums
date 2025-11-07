import Model, { attr, belongsTo } from '@ember-data/model';

export default class RatingModel extends Model {
  @attr('number') score;
  @attr('string') text;
  @attr('date') creationdate;

  @belongsTo('album', { async: true, inverse: 'ratings' }) album;
  @belongsTo('useraccount', { async: true, inverse: 'ratings' }) useraccount;
}
