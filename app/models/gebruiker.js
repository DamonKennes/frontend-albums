import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class GebruikerModel extends Model {
  @attr('date') created;
  @attr('date') modified;
  @attr('string') name;


  @belongsTo('useraccount', { async: true, inverse: 'gebruiker' }) useraccount;
  @hasMany('rating', { async: true, inverse: 'gebruiker' }) ratings;
}
