import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class WalletService extends Service {
  @tracked amount = '';
  @tracked balance = 0;
  @tracked monthlyIn = 0;
  
  get percentage() {
    if (this.monthlyIn <= 0) return 100;
    const spent = this.monthlyIn - this.balance;
    return Math.min(Math.max(Math.round((spent / this.monthlyIn) * 100), 0), 100);
  }
}
