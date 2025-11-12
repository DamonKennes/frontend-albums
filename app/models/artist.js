import Model, { attr } from '@ember-data/model';
import { hasMany } from '@ember-data/model';

export default class ArtistModel extends Model {
  @attr('string') name;
  @hasMany('album', { async: false, inverse: 'artists' }) albums;
}
