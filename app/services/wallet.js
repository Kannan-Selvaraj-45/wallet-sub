import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class WalletService extends Service {
  @tracked amount = '';
  @tracked balance = 5000;
  @tracked monthlyIn = 5000;
  @tracked monthlyEx = 0;

  calculateMonthlyExpense() {
    this.monthlyEx = this.monthlyIn - this.balance;
    console.log(this.monthlyEx);
  }

  @tracked recentTransactions = [];

  get percentage() {
    if (this.monthlyIn <= 0) return 100;
    const spent = this.monthlyIn - this.balance;
    return Math.min(
      Math.max(Math.round((spent / this.monthlyIn) * 100), 0),
      100,
    );
  }
}
