import {
  discoverEmberDataModels,
  // applyEmberDataSerializers,
} from 'ember-cli-mirage';
import { createServer } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    // Remove discoverEmberDataModels if you do not want ember-cli-mirage to auto discover the ember models
    models: {
      ...discoverEmberDataModels(config.store),
      ...config.models
    },
    // uncomment to opt into ember-cli-mirage to auto discover ember serializers
    // serializers: applyEmberDataSerializers(config.serializers),
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.timing = 0; // No delay during testing

  // Album routes
  this.get('/albums');
  this.get('/albums/:id');
  this.post('/albums');
  this.patch('/albums/:id');
  this.del('/albums/:id');

  // Artist routes
  this.get('/artists');
  this.get('/artists/:id');
  this.post('/artists');
  this.patch('/artists/:id');
  this.del('/artists/:id');

  // Rating routes
  this.get('/ratings');
  this.get('/ratings/:id');
  this.post('/ratings');
  this.patch('/ratings/:id');
  this.del('/ratings/:id');

  // Useraccount routes
  this.get('/useraccounts');
  this.get('/useraccounts/:id');
}
