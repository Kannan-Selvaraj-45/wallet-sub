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
      plan: 'Family',
      isOffer: true,
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
      plan: 'Standard',
      isOffer: true,
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
      plan: 'Premium',
      isOffer: true,
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
      plan: 'Standard',
      isOffer: true,
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
      plan: 'Family',
      isOffer: true,
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
      plan: 'Standard',
      isOffer: true,
    },
  ];

  subsPlans = [
    {
      service: 'Netflix',
      plans: [
        {
          planName: 'Basic',
          price: {
            weekly:99,
            monthly: 199,
            quarterly: 599,
            yearly: 1299,
          },
        },
        {
          planName: 'Standard',
          price: {
            weekly:99,
            monthly: 199,
            quarterly: 699,
            yearly: 1399,
          },
        },
        {
          planName: 'Premium',
          price: {
            weekly:99,
            monthly: 299,
            quarterly: 749,
            yearly: 1499,
          },
        },
        {
          planName: 'Family',
          price: {
            weekly:149,
            monthly: 199,
            quarterly: 1499,
            yearly: 2499,
          },
        },
      ],
      category: 'Entertainment',
    },
    {
      service: 'Spotify',
      plans: [
        {
          planName: 'Basic',
          price: {
            weekly:29,
            monthly: 49,
            quarterly: 149,
            yearly: 499,
          },
        },
        {
          planName: 'Standard',
          price: {
            weekly:39,
            monthly: 1,
            quarterly: 299,
            yearly: 799,
          },
        },
        {
          planName: 'Premium',
          price: {
            weekly:99,
            monthly: 299,
            quarterly: 749,
            yearly: 1499,
          },
        },
        {
          planName: 'Family',
          price: {
            weekly:149,
            monthly: 499,
            quarterly: 999,
            yearly: 1499,
          },
        },
      ],
      category: 'Music',
    },
    {
      service: 'Amazon',
      plans: [
        {
          planName: 'Basic',
          price: {
            weekly:99,
            monthly: 149,
            quarterly: 199,
            yearly: 399,
          },
        },
        {
          
          planName: 'Standard',
          price: {
            weekly:99,
            monthly: 199,
            quarterly: 499,
            yearly: 799,
          },
        },
        {
          
          planName: 'Premium',
          price: {
            weekly:99,
            monthly: 299,
            quarterly: 749,
            yearly: 1999,
          },
        },
        {
          planName: 'Family',
          price: {
            weekly:199,
            monthly: 999,
            quarterly: 1499,
            yearly: 3499,
          },
        },
      ],
      category: 'Entertainment',
    },
    {
      service: 'Apple Music',
      plans: [
        {
          planName: 'Basic',
          price: {
            weekly:99,
            monthly: 99,
            quarterly: 199,
            yearly: 599,
          },
        },
        {
          planName: 'Standard',
          price: {
            weekly:199,
            monthly: 629,
            quarterly: 1299,
            yearly: 3799,
          },
        },
        {
          planName: 'Premium',
          price: {
            weekly:199,
            monthly: 999,
            quarterly: 1699,
            yearly: 3299,
          },
        },
        {
          planName: 'Family',
          price: {
            weekly:199,
            monthly: 999,
            quarterly: 1499,
            yearly: 2999,
          },
        },
      ],
      category: 'Music',
    },
    {
      service: 'Disney+',
      plans: [
        {
          planName: 'Basic',
          price: {
            weekly:99,
            monthly: 149,
            quarterly: 199,
            yearly: 399,
          },
        },
        {
          planName: 'Standard',
          price: {
            weekly:199,
            monthly: 199,
            quarterly: 499,
            yearly: 799,
          },
        },
        {
          planName: 'Premium',
          price: {
            weekly:199,
            monthly: 299,
            quarterly: 749,
            yearly: 1499,
          },
        },
        {
          planName: 'Family',
          price: {
            weekly:199,
            monthly: 999,
            quarterly: 649.5,
            yearly: 2999,
          },
        },
      ],
      category: 'Entertainment',
    },
    {
      service: 'Youtube Premimum',
      plans: [
        {
          planName: 'Basic',
          price: {
            weekly:99,
            monthly: 149,
            quarterly: 199,
            yearly: 399,
          },
        },
        {
          planName: 'Standard',
          price: {
            weekly:99,
            monthly: 199,
            quarterly: 1,
            yearly: 799,
          },
        },
        {
          planName: 'Premium',
          price: {
            weekly:199,
            monthly: 299,
            quarterly: 749,
            yearly: 1499,
          },
        },
        {
          planName: 'Family',
          price: {
            weekly:199,
            monthly: 999,
            quarterly: 1999,
            yearly: 2499,
          },
        },
      ],
      category: 'Entertainment',
    },
  ];

  @tracked userSubscriptions = [];
  @tracked activeSubscriptions = 0;
  @tracked inActiveSubscriptions = 0;
  @tracked totalDiscounts = 0;

  @tracked paidPrice = 0;
}
