import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SubscriptionsController extends Controller {
  @service router;
  @service subscriptions;
  @service flashMessages;
  @service wallet;
  @tracked showAddSubscriptionModal = false;
  @tracked showThreePlans = true;
  @tracked activeTab = 'all';
  @tracked isEditing = false;
  @tracked editingSubscriptionId = null;

  @tracked searchQuery = '';

  get filteredSubscriptions() {
    if (this.subscriptions.userSubscriptions.length) {
      let filtered = this.subscriptions.userSubscriptions.filter((sub) =>
        sub.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
      return filtered;
    }
  }

  @action searchTitle(event) {
    this.searchQuery = event.target.value;
  }

  @tracked newSubscription = {};

  @tracked allPlans = [...this.subscriptions.popularPlans];

  serviceClasses = {
    Netflix: 'netflix',
    Spotify: 'spotify',
    'Amazon Prime': 'amazon-prime',
    'Disney+': 'disney-plus',
    YouTube: 'youtube-premium',
    'Apple Music': 'apple-music',
  };

  get threePlans() {
    let [a, b, c] = [...this.subscriptions.popularPlans];
    return [a, b, c];
  }
  get inactiveSubscriptions() {
    const anyInactive = this.subscriptions.userSubscriptions.some(
      (item) => !item.isActive,
    );
  }

  @action nextDue(currDate, plan) {
    let date = currDate;


    if (plan === 'monthly') {
      let nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      return nextMonth.toISOString().split('T')[0];
    } 
    if (plan === 'quarterly') {
      let nextThreeMonth = new Date(date);
      nextThreeMonth.setMonth(date.getMonth() + 3);
      return nextThreeMonth.toISOString().split('T')[0];
    } 
    else if (plan === 'yearly') {
      let nextYear = new Date(date);
      nextYear.setFullYear(nextYear.getFullYear()+1);
      return nextYear.toISOString().split('T')[0];
    }
     
  }

  @action
  toggleDiscover() {
    this.showThreePlans = !this.showThreePlans;
  }

  @action
  transitionToRoute() {
    this.router.transitionTo('dashboard');
  }

  @action
  removeFlashMessage(flash) {
    this.flashMessages.queue = this.flashMessages.queue.filter(
      (msg) => msg !== flash,
    );
  }

  get isAllActive() {
    return this.activeTab === 'all';
  }
  get isActiveTabActive() {
    return this.activeTab === 'active';
  }
  get isInactiveActive() {
    return this.activeTab === 'inactive';
  }

  get hasSubscriptions() {
    return this.subscriptions.userSubscriptions.length > 0;
  }

  @action
  setActiveTab(tab) {
    this.activeTab = tab;
  }

  @action
  getServiceClass(title) {
    return this.serviceClasses[title] || 'default-service';
  }

  @action
  openAddSubscriptionModal() {
    this.showAddSubscriptionModal = true;
  }

  @action
  closeAddSubscriptionModal() {
    this.showAddSubscriptionModal = false;
  }

  @action
  updateSubscriptionName(event) {
    this.newSubscription.title = event.target.value;
  }

  @action
  updateSubscriptionPlan(event) {
    this.newSubscription.plan = event.target.value;
  }

  @action
  updateBillingCycle(event) {
    this.newSubscription.planCycle = event.target.value;
  }

  @action
  updateAmount(event) {
    this.newSubscription.planPrice = event.target.value;
  }

  @action
  updateCategory(event) {
    this.newSubscription.category = event.target.value;
  }

  @action
  updatePaymentMethod(event) {
    this.newSubscription.paymentMethod = event.target.value;
  }

  @action
  saveSubscription() {
    if (!this.newSubscription.title || !this.newSubscription.planPrice) {
      return;
    }

    if (this.isEditing) {
      const updateSubscriptions = this.subscriptions.userSubscriptions.map(
        (sub) => {
          if (sub.id === this.editingSubscriptionId) {
            return {
              ...sub,
              category: this.newSubscription.category,
              paymentMethod: this.newSubscription.paymentMethod,
              logo: this.newSubscription.title[0],
              isActive: true,
            };
          }
          return sub;
        },
      );
      this.flashMessages.info('Subsription edited successfully!');
      this.subscriptions.userSubscriptions = updateSubscriptions;
      this.isEditing = false;
      this.newSubscription = {};
    } else {
      let findSubscriptionExists = this.subscriptions.userSubscriptions.some(
        (sub) => sub.title === this.newSubscription.title,
      );
      if (!findSubscriptionExists) {
        const newSub = {
          id: Date.now(),
          title: this.newSubscription.title,
          plan: this.newSubscription.plan,
          planCycle: this.newSubscription.planCycle,
          planPrice: parseFloat(this.newSubscription.planPrice),
          category: this.newSubscription.category,
          paymentMethod: this.newSubscription.paymentMethod,
          logo: this.newSubscription.title[0],
          isActive: true,
          startDate: new Date().toISOString().split('T')[0],
          discount: this.newSubscription.discount,
          nextDue: this.nextDue(new Date(), this.newSubscription.planCycle),
        };

        if (this.wallet.balance > newSub.planPrice) {
          this.subscriptions.userSubscriptions = [
            ...this.subscriptions.userSubscriptions,
            newSub,
          ];

          if (newSub.discount) {
            this.subscriptions.totalDiscounts = parseFloat(
              (this.subscriptions.totalDiscounts + newSub.discount).toFixed(2),
            );
          }

          if (newSub.startDate >= new Date().toISOString().split('T')[0]) {
            this.subscriptions.activeSubscriptions += 1;
          } else {
            this.subscriptions.inActiveSubscriptions += 1;
          }
          this.wallet.balance -= newSub.planPrice;

          this.wallet.calculateMonthlyExpense();

          this.newSubscription = {};

          this.flashMessages.success('Subscribed successfully!');
        } else {
          this.flashMessages.info('Insufficient Balance!');
          this.closeAddSubscriptionModal();
        }
      } else {
        this.flashMessages.warning(
          `${this.newSubscription.title} subscription already exists!`,
        );
      }
    }
    this.closeAddSubscriptionModal();
  }

  @action
  subscribe(serviceTitle, serviceCycle) {
    const plan = this.subscriptions.popularPlans.find(
      (p) => p.title === serviceTitle && p.planCycle === serviceCycle,
    );
    if (plan) {
      this.newSubscription = {
        title: plan.title,
        plan: 'Standard',
        planCycle: plan.planCycle,
        planPrice: plan.planPrice,
        category: plan.category,
        paymentMethod: 'Wallet',
        logo: plan.title[0],
        discount: plan.discount,
        startDate: new Date().toISOString().split('T')[0],
        nextDue: this.nextDue(new Date()),
      };
      this.showAddSubscriptionModal = true;
    }
  }

  @action
  editSubscription(subscription) {
    this.openEditModal(subscription);
  }

  @action
  openEditModal(subscription) {
    this.isEditing = true;
    this.editingSubscriptionId = subscription.id;
    this.newSubscription = {
      title: subscription.title,
      plan: 'Standard',
      planCycle: subscription.planCycle,
      planPrice: subscription.planPrice,
      category: subscription.category,
      paymentMethod: 'Wallet',
      logo: subscription.title[0],
      discount: subscription.discount,
    };
    this.showAddSubscriptionModal = true;
  }

  @action
  deleteSubscription(subscription) {
    this.subscriptions.userSubscriptions =
      this.subscriptions.userSubscriptions.filter(
        (sub) => sub.id !== subscription.id,
      );
    this.wallet.balance += subscription.planPrice;
    this.wallet.calculateMonthlyExpense();
    this.flashMessages.info('Subscription deleted!');

    if (subscription.discount) {
      this.subscriptions.totalDiscounts = parseFloat(
        (this.subscriptions.totalDiscounts - subscription.discount).toFixed(2),
      );
    }
    if (this.subscriptions.userSubscriptions.length >= 0) {
      this.subscriptions.activeSubscriptions -= 1;
    }
  }
}
