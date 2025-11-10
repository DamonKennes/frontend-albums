import { Model, hasMany } from 'miragejs';

export default Model.extend({
  artists: hasMany(),
  ratings: hasMany(),
});
