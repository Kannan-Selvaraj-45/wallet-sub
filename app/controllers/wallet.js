import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WalletController extends Controller {
  @service wallet;
  @tracked activeTab = 'overview';
  
  get positiveIn() {
    return this.wallet.monthlyIn > 0;
  }

  get isOverviewActive() {
    return this.activeTab === 'overview';
  }

  get isAddMoneyActive() {
    return this.activeTab === 'addMoney';
  }

  get isValidAmount() {
    const amount = parseFloat(this.wallet.amount);
   
    return !isNaN(amount) && amount > 0;
  }

  @action
  setActiveTab(tab) {
    this.activeTab = tab;
  }

  @action
  updateAmount(event) {
    this.wallet.amount = event.target.value;
  }

  @action
  addMoney() {
    if (this.isValidAmount) {
      const amount = parseFloat(this.wallet.amount);
      this.processAddMoney(amount);
      this.wallet.amount = '';
    }
  }

  @action
  quickAdd(amount) {
    this.processAddMoney(amount);
  }

  @action
  viewAllTransactions() {
    this.router.transitionTo('history');
  }

  @action
  openAddMoneyTab() {
    this.setActiveTab('addMoney');
  }

  processAddMoney(amount) {
    this.wallet.balance += amount;
    this.wallet.monthlyIn += amount;
  }
}
