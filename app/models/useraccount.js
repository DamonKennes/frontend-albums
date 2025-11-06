import Model, { attr, belongsTo } from '@ember-data/model';

export default class UseraccountModel extends Model {
  @attr('date') created;
  @attr('date') modified;
  @attr('string') accountname;

  @belongsTo('gebruiker', { async: true, inverse: 'useraccount' }) gebruiker;
}
