import EmberRouter from '@ember/routing/router';
import config from 'frontend-albums-rating/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('albums', function () {
    this.route('new');
    this.route('detail', { path: '/:album_id' });
  });

  this.route('login');
  this.route('register');
});
