import { module, test } from 'qunit';
import { setupTest } from 'ember-subscription/tests/helpers';

module('Unit | Controller | subscriptions', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:subscriptions');
    assert.ok(controller);
  });
});
