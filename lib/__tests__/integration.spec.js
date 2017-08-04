const jestExpect = global.expect;
const expect = require('unexpected')
    .clone()
    .use(require('../unexpectedSnapshot'));

it('foo', () => {
    expect('foo', 'to match snapshot');
});

it('to throw error matching snapshot', () => {
    expect(
        () => expect('foobar', 'to equal', 'foo'),
        'to throw error matching snapshot'
    );
});

it('to throw error matching snapshot native', () => {
    jestExpect(() =>
        expect('foobar', 'to equal', 'fooba')
    ).toThrowErrorMatchingSnapshot();
});
