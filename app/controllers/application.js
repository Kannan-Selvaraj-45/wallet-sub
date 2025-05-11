import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked isSidebarCollapsed = false;

  @action
  handleSidebarToggle(isCollapsed) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
