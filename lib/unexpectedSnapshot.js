const util = require('util');
const { getState } = require('jest-matchers');

const startsAndEndsWithQuotesAndNewlinesRegex = /^\n"[\s\S]*"\n$/;
const newlineQuoteRegex = /^\n"|"\n$/g;

const startsAndEndsWithQuotesRegex = /^"[\s\S]*"$/;
const quoteRegex = /^"|"$/g;

const trimJestSnapshotOutput = ({ actual, expected }) => {
    if (
        startsAndEndsWithQuotesAndNewlinesRegex.test(actual) &&
        startsAndEndsWithQuotesAndNewlinesRegex.test(expected)
    ) {
        actual = actual.replace(newlineQuoteRegex, '');
        expected = expected.replace(newlineQuoteRegex, '');
    } else if (
        startsAndEndsWithQuotesRegex.test(actual) &&
        startsAndEndsWithQuotesRegex.test(expected)
    ) {
        actual = actual.replace(quoteRegex, '');
        expected = expected.replace(quoteRegex, '');
    }

    return { actual, expected };
};

const serializeObject = obj => util.inspect(obj, { depth: null });

module.exports = {
    name: 'unexpected-snapshot',
    installInto: expect => {
        expect.addAssertion('<object> to match snapshot', (expect, subject) => {
            const { snapshotState, currentTestName } = getState();
            const result = snapshotState.match(
                currentTestName || '',
                serializeObject(subject)
            );
            const { actual, expected } = trimJestSnapshotOutput(result);

            return expect(actual, 'to equal', expected);
        });

        expect.addAssertion('<string> to match snapshot', (expect, subject) => {
            const { snapshotState, currentTestName } = getState();
            const result = snapshotState.match(currentTestName || '', subject);
            const { actual, expected } = trimJestSnapshotOutput(result);

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

                    const result = snapshotState.match(
                        currentTestName || '',
                        subject
                    );

                    const { actual, expected } = trimJestSnapshotOutput(result);

                    return expect(actual, 'to equal', expected);
                });
            }
        );
    }
};
