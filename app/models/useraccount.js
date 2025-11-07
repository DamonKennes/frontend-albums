import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class UseraccountModel extends Model {
  @attr('date') created;
  @attr('date') modified;
  @attr('string') accountname;

  @belongsTo('gebruiker', { async: true, inverse: 'useraccount' }) gebruiker;
  @hasMany('rating', { async: true, inverse: 'useraccount' }) ratings;
}
