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

it('<object> to match snapshot simple', () => {
    expect({ foo: 'barfoo' }, 'to match snapshot');
});

it('<object> to match snapshot with circular reference', () => {
    const obj = { foo: { bar: 'baz' } };
    obj.obj = obj;

    expect(obj, 'to match snapshot');
});

it('<object> to match snapshot with functions', () => {
    const obj = {
        a: 'wholeLotOfFunctions',
        af: foo => foo + 'bar',
        afb: foo => {
            return foo + 'bar';
        },
        anf: function (foo) { return foo + 'bar'; }
    };

    expect(obj, 'to match snapshot');
});

it('to throw error matching snapshot native', () => {
    jestExpect(() =>
        expect('foobar', 'to equal', 'fooba')
    ).toThrowErrorMatchingSnapshot();
});
