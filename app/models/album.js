import Model, { attr, hasMany } from '@ember-data/model';

export default class AlbumModel extends Model {
  @attr('string') title;
  @attr('date') releasedate;
  @attr('string') cover;
  @attr('string') genre;

  @hasMany('artist', { async: true, inverse: 'albums' }) artists;
  @hasMany('rating', { async: true, inverse: 'album' }) ratings;
}
