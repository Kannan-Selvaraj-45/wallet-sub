import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SubscriptionsController extends Controller {
  @service router;
  @service subscriptions;
  @service flashMessages;
  @service wallet;
  @service history;

  @tracked showAddSubscriptionModal = false;
  @tracked showThreePlans = true;
  @tracked activeTab = 'all';
  @tracked isEditing = false;
  @tracked editingSubscriptionId = null;

  @tracked newSubscription = {};

  @tracked allPlans = [...this.subscriptions.popularPlans];

  @tracked searchQuery = '';

  @tracked payType = '';

  get selectUpi() {
    return this.payType === 'upi';
  }

  get selectDebit() {
    return this.payType === 'debit';
  }

  get selectNet() {
    return this.payType === 'net';
  }

  get selectWallet() {
    return this.payType === 'wallet';
  }

  @action setPayType(type) {
    this.payType = type;
  }

  get filteredSubscriptions() {
    if (this.subscriptions.userSubscriptions.length) {
      const filtered = this.subscriptions.userSubscriptions.filter((sub) =>
        sub.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
      return filtered.reverse();
    }
    return this.subscriptions.userSubscriptions.reverse();
  }

  get anyActiveSubscriptions() {
    if (this.subscriptions.userSubscriptions.length) {
      const active = this.subscriptions.userSubscriptions.some(
        (item) => item.isActive,
      );
      return active;
    }
  }

  get amountPaid() {
    if (this.subscriptions.paidPrice) {
      return this.subscriptions.paidPrice;
    } else {
      if (this.newSubscription.planPrice > 0) {
        return this.newSubscription.planPrice;
      } else {
        return 0;
      }
    }
  }

  @action searchTitle(event) {
    this.searchQuery = event.target.value;
  }

  serviceClasses = {
    Netflix: 'netflix',
    Spotify: 'spotify',
    'Amazon Prime': 'amazon-prime',
    'Disney+': 'disney-plus',
    YouTube: 'youtube-premium',
    'Apple Music': 'apple-music',
  };

  get threePlans() {
    const [a, b, c] = [...this.subscriptions.popularPlans];
    return [a, b, c];
  }
  get inactiveSubscriptions() {
    const anyInactive = this.subscriptions.userSubscriptions.filter(
      (item) => !item.isActive,
    );
    return anyInactive;
  }

  @action nextDue(currDate, plan) {
    const date = currDate;

    if (plan === 'weekly') {
      const nextWeek = new Date(date);
      nextWeek.setDate(date.getDate() + 7);
      return nextWeek.toISOString().split('T')[0];
    }

    if (plan === 'monthly') {
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      return nextMonth.toISOString().split('T')[0];
    }
    if (plan === 'quarterly') {
      const nextThreeMonth = new Date(date);
      nextThreeMonth.setMonth(date.getMonth() + 3);
      return nextThreeMonth.toISOString().split('T')[0];
    } else if (plan === 'yearly') {
      const nextYear = new Date(date);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
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

  autoFillAmount() {
    const { title, plan, planCycle } = this.newSubscription;
    if (title) {
      const matchedService = this.subscriptions.subsPlans.find(
        (s) =>
          s.service.split(' ')[0].toLowerCase() ===
          title.split(' ')[0].toLowerCase(),
      );

      if (matchedService) {
        const matchedPlan = matchedService.plans.find(
          (p) => p.planName === plan,
        );

        if (matchedPlan && matchedPlan.price[planCycle]) {
          this.newSubscription.planPrice = matchedPlan.price[planCycle];
          this.subscriptions.paidPrice = matchedPlan.price[planCycle];
        }
      }
    }
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
    this.newSubscription = {
      ...this.newSubscription,
      paymentMethod: null,
    };
  }

  @action
  closeAddSubscriptionModal() {
    this.showAddSubscriptionModal = false;
    this.isEditing = false;
    this.newSubscription = {};
    this.payType = '';
  }

  @action
  updateSubscriptionName(event) {
    this.newSubscription.title = event.target.value;
    this.autoFillAmount();
  }

  @action
  updateSubscriptionPlan(event) {
    this.newSubscription.plan = event.target.value;
    this.autoFillAmount();
  }

  @action
  updateBillingCycle(event) {
    this.newSubscription.planCycle = event.target.value;
    this.autoFillAmount();
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

  @tracked subscriptionTimers = [];

  @action getTimerDuration(planCycle) {
    switch (planCycle) {
      case 'weekly':
        return 5 * 1000;
      case 'monthly':
        return 10 * 1000;
      case 'quarterly':
        return 12 * 1000;
      case 'yearly':
        return 15 * 1000;
      default:
        return 15 * 1000;
    }
  }

  @action processAutoRenewal(subscriptionId) {
    const subscription = this.subscriptions.userSubscriptions.find(
      (sub) => sub.id === subscriptionId,
    );

    if (!subscription || !subscription.isActive) {
      return;
    }

    if (this.wallet.balance < subscription.planPrice) {
      this.flashMessages.danger(
        `Insufficient funds for auto-renewal of ${subscription.title} subscription. Please add funds to your wallet.`,
      );
      return;
    }

    this.wallet.balance -= subscription.planPrice;

    const updatedSubscriptions = this.subscriptions.userSubscriptions.map(
      (sub) => {
        return sub.id === subscriptionId ? { ...sub, isActive: false } : sub;
      },
    );

    const newSubscriptionId = Date.now();

    const newSubscription = {
      ...subscription,
      id: newSubscriptionId,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      nextDue: this.nextDue(new Date(), subscription.planCycle),
    };

    this.subscriptions.userSubscriptions = [
      ...updatedSubscriptions,
      newSubscription,
    ];

    const newTransaction = {
      id: newSubscriptionId,
      title: subscription.title,
      category: subscription.category,
      date: new Date().toDateString(),
      amount: subscription.planPrice,
      type: 'debit',
      paymentMethod: 'Wallet',
    };

    this.history.transactions = [...this.history.transactions, newTransaction];

    this.wallet.calculateMonthlyExpense();

    this.flashMessages.success(
      `Auto-renewal successful for ${subscription.title} subscription.`,
    );

    this.clearTimerForSubscription(subscriptionId);

    this.setupAutoRenewalTimer(newSubscriptionId);
  }

  @action setupAutoRenewalTimer(subscriptionId) {
    const subscription = this.subscriptions.userSubscriptions.find(
      (sub) => sub.id === subscriptionId,
    );

    if (
      !subscription ||
      subscription.paymentMethod !== 'Wallet' ||
      !subscription.isActive
    ) {
      return;
    }

    this.clearTimerForSubscription(subscriptionId);

    const timerDuration = this.getTimerDuration(subscription.planCycle);

    const timerId = setTimeout(() => {
      this.processAutoRenewal(subscriptionId);
    }, timerDuration);

    this.subscriptionTimers.push({
      subscriptionId,
      timerId,
    });
  }

  @action clearTimerForSubscription(subscriptionId) {
    const timerObj = this.subscriptionTimers.find(
      (timer) => timer.subscriptionId === subscriptionId,
    );

    if (timerObj) {
      clearTimeout(timerObj.timerId);
      this.subscriptionTimers = this.subscriptionTimers.filter(
        (timer) => timer.subscriptionId !== subscriptionId,
      );
    }
  }

  @action
  saveSubscription() {
    if (
      !this.newSubscription.title ||
      !this.newSubscription.planPrice ||
      !this.newSubscription.paymentMethod
    ) {
      this.showAddSubscriptionModal = false;
      this.payType = '';

      this.flashMessages.warning('Please fill all required fields!');
      return;
    }

    if (this.isEditing) {
      const originalSubscription = this.subscriptions.userSubscriptions.find(
        (sub) => sub.id === this.editingSubscriptionId,
      );

      if (originalSubscription.isOffer) {
        this.flashMessages.danger('Offer Subscriptions can not be edited!');
        this.closeAddSubscriptionModal();
        return;
      }

      const updateSubscriptions = this.subscriptions.userSubscriptions.map(
        (sub) => {
          if (sub.id === this.editingSubscriptionId) {
            if (originalSubscription.paymentMethod === 'Wallet') {
              this.wallet.balance += originalSubscription.planPrice;
            }

            if (this.newSubscription.paymentMethod === 'Wallet') {
              if (this.wallet.balance < this.newSubscription.planPrice) {
                this.flashMessages.info('Insufficient Balance!');
                return sub;
              }
              this.wallet.balance -= this.newSubscription.planPrice;
            }

            this.flashMessages.info('Subscription edited successfully!');
            return {
              ...sub,
              planCycle: this.newSubscription.planCycle,
              planPrice: this.newSubscription.planPrice,
              category: this.newSubscription.category,
              paymentMethod: this.newSubscription.paymentMethod,
              logo: this.newSubscription.title[0],
              isActive: true,
              offerPlan: this.newSubscription.offerPlan,
              isOffer: this.newSubscription.isOffer,
              nextDue: this.nextDue(new Date(), this.newSubscription.planCycle),
            };
          }

          return sub;
        },
      );

      const updateTransaction = this.history.transactions.map((transact) => {
        if (transact.title === this.newSubscription.title) {
          return {
            ...transact,
            category: this.newSubscription.category,
            amount: this.newSubscription.planPrice,
            paymentMethod: this.newSubscription.paymentMethod,
          };
        }
        return transact;
      });
      this.history.transactions = updateTransaction;

      this.subscriptions.userSubscriptions = updateSubscriptions;

      const editedSub = this.subscriptions.userSubscriptions.find(
        (sub) => sub.id === this.editingSubscriptionId,
      );

      if (
        editedSub &&
        editedSub.isActive &&
        editedSub.paymentMethod === 'Wallet'
      ) {
        this.clearTimerForSubscription(editedSub.id);
        this.setupAutoRenewalTimer(editedSub.id);
      }

      this.wallet.calculateMonthlyExpense();
      this.isEditing = false;
      this.newSubscription = {};
      this.payType = '';
      this.subscriptions.paidPrice = 0;
    } else {
      const findSubscriptionExists = this.subscriptions.userSubscriptions.some(
        (sub) => sub.title === this.newSubscription.title && sub.isActive,
      );

      if (!findSubscriptionExists) {
        const newSub = {
          id: Date.now(),
          title: this.newSubscription.title,
          plan: this.newSubscription.plan,
          planCycle: this.newSubscription.planCycle,
          planPrice: Number.parseFloat(this.newSubscription.planPrice),
          category: this.newSubscription.category,
          paymentMethod: this.newSubscription.paymentMethod,
          logo: this.newSubscription.title[0],
          isActive: true,
          startDate: new Date().toISOString().split('T')[0],
          discount: this.newSubscription.discount,
          nextDue: this.nextDue(new Date(), this.newSubscription.planCycle),
          isOffer: this.newSubscription.isOffer,
        };

        const newTransaction = {
          id: newSub.id,
          title: newSub.title,
          category: newSub.category,
          date: new Date(`${newSub.startDate}`).toDateString(),
          amount: newSub.planPrice,
          type: 'debit',
          paymentMethod: this.newSubscription.paymentMethod,
        };

        if (newSub.paymentMethod === 'Wallet') {
          if (this.wallet.balance < newSub.planPrice) {
            this.flashMessages.info('Insufficient Balance!');
            this.closeAddSubscriptionModal();
            return;
          }

          this.wallet.balance -= newSub.planPrice;
        }

        this.subscriptions.userSubscriptions = [
          ...this.subscriptions.userSubscriptions,
          newSub,
        ];

        this.history.transactions = [
          ...this.history.transactions,
          newTransaction,
        ];

        if (newSub.discount) {
          this.subscriptions.totalDiscounts =
            this.subscriptions.totalDiscounts + newSub.discount;
        }

        if (newSub.startDate >= new Date().toISOString().split('T')[0]) {
          this.subscriptions.activeSubscriptions += 1;
        } else {
          this.subscriptions.inActiveSubscriptions += 1;
        }

        if (newSub.paymentMethod === 'Wallet' && newSub.isActive) {
          this.setupAutoRenewalTimer(newSub.id);
        }

        this.wallet.calculateMonthlyExpense();
        this.newSubscription = {};
        this.payType = '';
        this.subscriptions.paidPrice = 0;
        this.flashMessages.success('Subscribed successfully!');
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
    if (plan.isOffer) {
      this.newSubscription = {
        title: plan.title,
        plan: plan.plan,
        planCycle: plan.planCycle,
        planPrice: plan.planPrice,
        category: plan.category,
        paymentMethod: this.newSubscription.paymentMethod,
        logo: plan.title[0],
        discount: plan.discount,
        startDate: new Date().toISOString().split('T')[0],
        nextDue: this.nextDue(new Date()),
        isOffer: plan.isOffer,
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
      plan: subscription.plan,
      planCycle: subscription.planCycle,
      planPrice: subscription.planPrice,
      category: subscription.category,
      paymentMethod: subscription.paymentMethod,
      logo: subscription.title[0],
      discount: subscription.discount,
    };
    this.autoFillAmount();

    this.showAddSubscriptionModal = true;
  }

  @action
  deleteSubscription(subscription) {
    this.clearTimerForSubscription(subscription.id);
    this.subscriptions.userSubscriptions =
      this.subscriptions.userSubscriptions.filter(
        (sub) => sub.id !== subscription.id,
      );

    if (subscription.paymentMethod === 'Wallet') {
      this.wallet.balance += subscription.planPrice;
    }

    const newTransaction = {
      id: subscription.id || new Date(),
      title: subscription.title,
      category: subscription.category,
      date: new Date(`${subscription.startDate}`).toDateString(),
      amount: subscription.planPrice,
      type: 'refunded',
      paymentMethod: subscription.paymentMethod,
    };

    this.history.transactions = [...this.history.transactions, newTransaction];

    this.subscriptions.totalRefund += subscription.planPrice;
    this.wallet.calculateMonthlyExpense();
    this.flashMessages.info('Subscription deleted!');

    if (subscription.discount) {
      this.subscriptions.totalDiscounts =
        this.subscriptions.totalDiscounts - subscription.discount;
      if (this.subscriptions.totalDiscounts < 0) {
        this.subscriptions.totalDiscounts = 0;
      }
    }
    if (this.subscriptions.userSubscriptions.length >= 0) {
      this.subscriptions.activeSubscriptions -= 1;
    }
  }
}
