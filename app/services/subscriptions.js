import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SubscriptionsService extends Service {
  popularPlans = [
    {
      id: 1,
      title: 'Netflix',
      offerPlan: '20% off first month',
      category: 'Entertainment',
      description:
        'Watch unlimited movies and TV shows on your mobile phone, tablet, laptop, and TV.',
      planPrice: 199,
      actualPrice: 249,
      planCycle: 'monthly',
      discount: 49.8,
    },
    {
      id: 2,
      title: 'Spotify',
      offerPlan: 'First month free',
      category: 'Music',
      description:
        'Ad free music and unlimited downloads.Get on your mobile phone, tablet, and laptop.',
      planPrice: 1,
      actualPrice: 119,
      planCycle: 'monthly',
      discount: 119,
    },
    {
      id: 3,
      title: 'Amazon Prime',
      offerPlan: '20% off on family pack',
      category: 'Entertainment',
      description:
        'Premium for up to 6 family members get on your mobile phone, tablet, laptop, and TV.',
      planPrice: 1999,
      actualPrice: 2499,
      planCycle: 'yearly',
      discount: 500,
    },
    {
      id: 4,
      title: 'Apple Music',
      offerPlan: '10% off',
      category: 'Music',
      description: 'All The Ways You Love Music. All in One Place.',
      planPrice: 629,
      actualPrice: 699,
      planCycle: 'monthly',
      discount: 69.9,
    },
    {
      id: 5,
      title: 'Disney+',
      offerPlan: '50% off on three months',
      category: 'Entertainment',
      description: 'No ads.No limits.Just pure magic. ',
      planPrice: 649.5,
      actualPrice: 1299,
      planCycle: 'quarterly',
      discount: 649.5,
    },
    {
      id: 6,
      title: 'YouTube',
      offerPlan: 'Free for 3 months',
      category: 'Entertainment',
      description: 'Hey Students - Youtube premium is FREE!.',
      planPrice: 1,
      actualPrice: 1499,
      planCycle: 'quarterly',
      discount: 1499,
    },
  ];

  @tracked userSubscriptions = [];
  @tracked activeSubscriptions = 0;
  @tracked inActiveSubscriptions = 0;
  @tracked totalDiscounts = 0;
}
