import { Model, hasMany } from 'miragejs';

export default Model.extend({
  albums: hasMany(),
});
