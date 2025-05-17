import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WalletController extends Controller {
  @service wallet;
  @service router;
  @service history;
  @service flashMessages;
  @tracked activeTab = 'overview';
  @service subscriptions;


  get totMonthlyExpenses(){
    return parseFloat(this.wallet.monthlyEx).toFixed(2)
  }

   get recentTransactions(){
    if(this.history.transactions){
      let latest=this.history.transactions.reverse();
      if (latest.length < 3) {
        return latest;
      }
      let [first, second, third] = this.history.transactions.reverse();
      return [first, second, third];
    }
  }

  @action
  transitionToRoute() {
    this.router.transitionTo('dashboard');
  }

  @action
  transitionToHistory(){
    this.router.transitionTo('history')
  }

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
  removeFlashMessage(flash) {
    this.flashMessages.queue = this.flashMessages.queue.filter(
      (msg) => msg !== flash,
    );
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

  get incomeTitles() {
    let sources = [
      'Salary',
      'Loan',
      'Bonus and incentives',
      'Freelancing',
      'Commisson',
      'Sale',
      'Rental',
      'Stock Market',
    ];
    let index = Math.floor(Math.random() * sources.length);
    return sources[index];
  }

  processAddMoney(amount) {
    this.wallet.balance += amount;
    this.wallet.monthlyIn += amount;
    const newTransaction = {
      id: new Date(),
      title: this.incomeTitles,
      category: 'Income',
      date: new Date().toDateString(),
      amount: amount,
      type: 'credit',
      paymentMethod:'Wallet'
    };
    this.history.transactions = [...this.history.transactions, newTransaction];
    this.flashMessages.success(`Rs.${amount} added to wallet!`);
  }
}
