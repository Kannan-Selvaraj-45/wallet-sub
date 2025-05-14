import { module, test } from 'qunit';
import { setupTest } from 'ember-subscription/tests/helpers';

module('Unit | Service | subscriptions', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:subscriptions');
    assert.ok(service);
  });
});
