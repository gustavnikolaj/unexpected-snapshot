const { getState } = require('jest-matchers');

module.exports = {
    name: 'unexpected-snapshot',
    installInto: expect => {
        expect.addAssertion('<string> to match snapshot', (expect, subject) => {
            const { snapshotState, currentTestName } = getState();
            const result = snapshotState.match(currentTestName || '', subject);
            let { actual, expected } = result;

            return expect(actual, 'to equal', expected);
        });

        expect.addAssertion(
            '<function> to throw error matching snapshot',
            (expect, subject) => {
                const { snapshotState, currentTestName } = getState();

                return expect(subject, 'to throw').then(thrown => {
                    let subject = thrown;

                    if (thrown && thrown.isUnexpected) {
                        subject = thrown
                            .getErrorMessage({ format: 'text' })
                            .toString();
                    }

                    const { actual, expected } = snapshotState.match(
                        currentTestName || '',
                        subject
                    );

                    return expect(actual, 'to equal', expected);
                });
            }
        );
    }
};
