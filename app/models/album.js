import Model, { attr, hasMany } from '@ember-data/model';

export default class AlbumModel extends Model {
  @attr('string') title;
  @attr('date') releasedate;
  @attr('string') cover;
  @attr('string') genre;
  @attr('number') averagerating;


  @hasMany('artist', { async: false, inverse: 'albums' }) artists;
  @hasMany('rating', { async: true, inverse: 'album' }) ratings;
}
