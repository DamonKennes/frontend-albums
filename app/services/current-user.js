import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';


export default class CurrentUserService extends Service {
  @service store;
  @service session;

  @tracked user = null;

  async load() {
    if (this.user || !this.session.isAuthenticated) {
      return this.user;
    }

    try {
      const data = this.session.data;
      const accountID = data.authenticated.data.relationships.account.data.id
      const account = await this.store.findRecord('useraccount', accountID, {
        include: 'gebruiker'
      });
      this.user = await account.gebruiker;
      return this.user;
    } catch (error) {
      console.error('Failed to load current user:', error);
      this.user = null;
      throw error;
    }
  }

  clear() {
    this.user = null;
  }
}
