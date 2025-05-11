import { module, test } from 'qunit';
import { setupTest } from 'ember-subscription/tests/helpers';

module('Unit | Service | wallet', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:wallet');
    assert.ok(service);
  });
});
