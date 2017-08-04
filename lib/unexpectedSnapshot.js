const { getState } = require('jest-matchers');

const startsAndEndsWithQuoteRegex = /^\n"[\s\S]*"\n$/;
const newlineQuoteRegex = /^\n"|"\n$/g;

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

                    let { actual, expected } = snapshotState.match(
                        currentTestName || '',
                        subject
                    );

                    if (
                        startsAndEndsWithQuoteRegex.test(actual) &&
                        startsAndEndsWithQuoteRegex.test(expected)
                    ) {
                        actual = actual.replace(newlineQuoteRegex, '');
                        expected = expected.replace(newlineQuoteRegex, '');
                    }

                    return expect(actual, 'to equal', expected);
                });
            }
        );
    }
};
