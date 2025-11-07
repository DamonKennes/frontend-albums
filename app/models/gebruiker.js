import Model, { attr, belongsTo } from '@ember-data/model';

export default class GebruikerModel extends Model {
  @attr('date') created;
  @attr('date') modified;
  @attr('string') name;


  @belongsTo('useraccount', { async: true, inverse: 'gebruiker' }) useraccount;
}
