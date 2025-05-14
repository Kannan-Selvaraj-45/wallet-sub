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

  @tracked newSubscription = {};

  serviceClasses = {
    Netflix: 'netflix',
    Spotify: 'spotify',
    'Amazon Prime': 'amazon-prime',
    'Disney+': 'disney-plus',
    'YouTube': 'youtube-premium',
    'Apple Music': 'apple-music',
  };

  get threePlans() {
    let [a, b, c] = [...this.subscriptions.popularPlans];
    return [a, b, c];
  }
  @tracked allPlans = [...this.subscriptions.popularPlans];

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
  addSubscription() {
    if (!this.newSubscription.title || !this.newSubscription.planPrice) {
      return;
    }

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
      startDate: new Date().toISOString(),
      discount: this.newSubscription.discount,
    };

    if (this.wallet.balance > newSub.planPrice) {
      this.subscriptions.userSubscriptions = [
        ...this.subscriptions.userSubscriptions,
        newSub,
      ];

      if (newSub.discount) {
        this.subscriptions.totalDiscounts += newSub.discount;
      }

      let date = new Date().toISOString();

      if (newSub.startDate >= date) {
        this.subscriptions.activeSubscriptions += 1;
      } else {
        this.subscriptions.inActiveSubscriptions += 1;
      }
      this.wallet.balance -= newSub.planPrice;

      this.wallet.calculateMonthlyExpense();

      this.flashMessages.success('Subscribed successfully!');
    } else {
      this.flashMessages.info('Insufficient Balance!');
      this.closeAddSubscriptionModal();
    }

    this.closeAddSubscriptionModal();
    console.log(this.subscriptions.userSubscriptions);
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
  discoverMore() {}

  @action
  subscribe(serviceTitle,serviceCycle) {
    console.log(serviceCycle)
    const plan = this.subscriptions.popularPlans.find(
      (p) => p.title === serviceTitle && p.planCycle===serviceCycle,
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
      };
      this.showAddSubscriptionModal = true;
    }
  }
}
