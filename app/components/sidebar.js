import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SidebarComponent extends Component {
  @service router;
  @tracked isCollapsed=true;

  @action
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    if (this.args.onToggle) {
      this.args.onToggle(this.isCollapsed);
    }
  }

  @action
  transitionToRoute(route) {
    this.router.transitionTo(route);
  }
}
