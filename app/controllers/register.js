import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RegisterController extends Controller {
  @service router;


  @tracked name = '';
  @tracked nickname = '';
  @tracked password = '';
  @tracked passwordConfirmation = '';
  @tracked loading = false;
  @tracked errorMessage = '';

  reset(){
    this.name = '';
    this.nickname = '';
    this.password = '';
    this.passwordConfirmation = '';
    this.errorMessage = '';
    this.loading = false;
  }

  @action
  register(event) {
    event.preventDefault();
    this.loading = true;
    this.errorMessage = '';

    const properties = {
      name: this.name,
      nickname: this.nickname,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
    };

    $.ajax({
      url: '/accounts',
      type: 'POST',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      data: JSON.stringify({
        data: {
          type: 'accounts',
          attributes: {
            name: properties['name'],
            nickname: properties['nickname'],
            password: properties['password'],
            'password-confirmation': properties['passwordConfirmation'],
          },
        },
      }),
    }).then(
      () => {
        this.reset();
        this.router.transitionTo('albums');
      },
      (reason) => {
        this.loading = false;
        var error = reason.responseJSON.errors[0].title;
        console.log('Registration failed: ' + error);
        this.errorMessage = error;
      }
    );
  }
}
