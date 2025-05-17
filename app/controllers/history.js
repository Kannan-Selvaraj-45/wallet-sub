import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HistoryController extends Controller {
  @service history;
  @service wallet;
  @service subscriptions;
  @tracked searchQuery = '';
  @tracked typeFilter = 'all';
  @tracked dateFilter = 'all';
  @tracked filteredLength;

  @tracked page = 1;
  @tracked perPage = 3;

  @tracked showTransactionDetails = false;
  @tracked selectedTransaction = null;

  @action updateSearchQuery(event) {
    this.searchQuery = event.target.value;
    this.page = 1;
  }
  @action
  updateDateFilter(event) {
    this.dateFilter = event.target.value;
    this.page = 1;
  }

  get filteredTransactions() {
    
    let transactions = this.history.transactions.filter(item=>item.paymentMethod==='Wallet');

    let searchQuery = this.searchQuery.toLowerCase();
    if (searchQuery) {
      transactions = transactions.filter(
        (transaction) =>
          transaction.title.toLowerCase().includes(searchQuery) ||
          transaction.category.toLowerCase().includes(searchQuery),
      );
    }

    if (this.typeFilter !== 'all') {
      transactions = transactions.filter(
        (transaction) => transaction.type === this.typeFilter,
      );
    }

    if (this.dateFilter !== 'all') {
      const now = new Date();
      let startDate, endDate;

      switch (this.dateFilter) {
        case 'today':
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          endDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
          );
          break;
        case 'week':
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - now.getDay(),
          );
          endDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + (6 - now.getDay()) + 1,
          );
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth());
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0);
          endDate = new Date(now.getFullYear() + 1, 0, 0);
          break;
      }
      if (startDate && endDate) {
        transactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate && transactionDate < endDate;
        });
      }
    }

    this.filteredLength = transactions.length;

    return transactions.slice(0, this.page * this.perPage);
  }
  get hasTransactions() {
    return this.filteredTransactions.length > 0;
  }

  get hasMoreTransactions() {
    const filteredCount = this.filteredLength;

    return this.page * this.perPage < filteredCount;
  }

  get totalBalance() {
    return this.wallet.balance;
  }

  get totalDebited() {
    return this.wallet.monthlyEx;
  }

  get totalCredited() {
    return this.wallet.monthlyIn;
  }

  get totalRefunded() {
    return this.subscriptions.totalRefund;
  }

  get showAllTypes() {
    return this.typeFilter === 'all';
  }

  get showDebit() {
    return this.typeFilter === 'debit';
  }

  get showCredit() {
    return this.typeFilter === 'credit';
  }

  get showRefunded() {
    return this.typeFilter === 'refunded';
  }

  @action
  setTypeFilter(type) {
    this.typeFilter = type;
    this.page = 1;
  }

  @action
  viewTransactionDetails(details) {
    this.showTransactionDetails = true;
    this.selectedTransaction = details;
  }

  @action
  closeTransactionDetails() {
    this.showTransactionDetails = false;
    this.selectedTransaction = null;
  }

  @action
  loadMoreTransactions() {
    this.page += 1;
  }
}
