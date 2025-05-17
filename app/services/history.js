import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HistoryService extends Service {
  @tracked transactions = [
    {
      id: '1',
      title: 'Salary',
      category: 'Income',
      date: new Date(2025,6,12).toDateString(),
      amount: '5000',
      type: 'credit',
      paymentMethod:'Wallet'
    },
  ];

  
}
