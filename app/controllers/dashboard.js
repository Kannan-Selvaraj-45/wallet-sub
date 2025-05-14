import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DashboardController extends Controller {
  @service router;
  @service wallet;
  @service subscriptions;

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
