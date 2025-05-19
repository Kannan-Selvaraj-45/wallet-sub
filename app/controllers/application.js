import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class ApplicationController extends Controller {
  @tracked isSidebarCollapsed = true;
  @service flashMessages;

  @action
  handleSidebarToggle(isCollapsed) {
    this.isSidebarCollapsed = isCollapsed;
  }

  @action
  removeFlashMessage(flash) {
    this.flashMessages.queue = this.flashMessages.queue.filter(
      (msg) => msg !== flash,
    );
  }
}
