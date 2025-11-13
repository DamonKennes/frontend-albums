import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RegisterRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }
}
