module.exports = {
    name: 'unexpected-snapshot',
    installInto: expect => {
        expect.addAssertion('<string> to match snapshot', (expect, subject) => {
            // foo
            return expect(subject, 'to equal', subject);
        });
    }
};
