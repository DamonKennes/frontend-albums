import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalConfirmComponent extends Component {
  @action
  stopPropagation(event) {
    event.stopPropagation();
  }
}