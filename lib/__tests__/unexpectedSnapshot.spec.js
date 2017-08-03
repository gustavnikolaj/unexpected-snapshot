const expect = require('unexpected');
const unexpectedSnapshot = require('../unexpectedSnapshot');

it('should export a valid unexpected plugin', () => {
    expect(unexpectedSnapshot, 'to satisfy', {
        name: expect.it('to be a string').and('to match', /^unexpected-/),
        installInto: expect.it('to be a function')
    });
});

it('should install into an unexpected instance without errors', () => {
    const childExpect = expect.clone();

    expect(() => childExpect.use(unexpectedSnapshot), 'not to throw');
});
