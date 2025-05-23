import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DashboardController extends Controller {
  @service router;
  @service wallet;
  @service history;
  @service subscriptions;

  get totDiscounts() {
    let tot = parseFloat(this.subscriptions.totalDiscounts).toFixed(2);
    return tot;
  }

  get totMonthlyExpenses() {
    return parseFloat(this.wallet.monthlyEx).toFixed(2);
  }

  get anyActiveSubsriptionFound() {
    return this.subscriptions.userSubscriptions.some((item) => item.isActive);
  }
  get recentSubscriptions() {
    let onlyActiveSubscriptions = this.subscriptions.userSubscriptions.filter(
      (item) => item.isActive,
    );
    if (onlyActiveSubscriptions) {
      return onlyActiveSubscriptions.slice(-3).reverse();
       
    }
  }

  get recentTransactions() {
    if (this.history.transactions) {
      return this.history.transactions.slice(-3).reverse();
    }
  }

  get trend() {
    let monthlyIn = this.wallet.monthlyIn;
    let fifteenOfMonthlyIn = (15 / 100) * monthlyIn;
    if (this.subscriptions.totalDiscounts > fifteenOfMonthlyIn) {
      return { color: 'green', icon: 'up' };
    } else {
      return { color: 'black', icon: 'down' };
    }
  }

  get topCategory() {
    let findActiveCategory = this.subscriptions.userSubscriptions.filter(
      (item) => item.isActive,
    );

    if (
      this.subscriptions.userSubscriptions.length &&
      findActiveCategory.length
    ) {
      let currCategoryPrice = this.subscriptions.userSubscriptions[0].planPrice;
      let findCategory = this.subscriptions.userSubscriptions.find(
        (sub) => sub.planPrice > currCategoryPrice,
      );
      if (findCategory) {
        return findCategory.category;
      }
      return this.subscriptions.userSubscriptions[0].category;
    } else {
      return 'None';
    }
  }

  offers = [
    {
      title: 'Netflix',
      plan: 'Netflix Premium Plan',
      devices: 'Watch on 4 devices simultaneously in Ultra HD.',
      offerPrice: 699,
      actualPrice: 799,
      image:
        'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80',
      colors: ['#D62525', '#9C1B1B'],
    },
    {
      title: 'Spotify',
      plan: 'Spotify Family',
      devices: 'Premium for up to 6 family members living under one roof.',
      offerPrice: 199,
      actualPrice: '',
      image:
        'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80',
      colors: ['#22C25D', '#168841'],
    },
    {
      title: 'Youtube',
      plan: 'Youtube Premium',
      devices: 'Ad-free videos, background play & downloads.',
      offerPrice: 129,
      actualPrice: '',
      image:
        'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/07/reasons-youtube-premium-is-worth-subscribing-to.jpg',
      colors: ['#D62525', '#9C1B1B'],
    },
  ];

  get positiveIn() {
    return this.wallet.monthlyIn > 0;
  }

  @action
  transitionToRoute(route) {
    this.router.transitionTo(route);
  }
}
