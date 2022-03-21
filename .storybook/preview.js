import React from 'react';
import '../src/styles/index.css';
import '../src/components/Toast/styles.css';

export const decorators = [
    (Story) => (
        <div style={{ padding: '2em' }}>
            <Story />
        </div>
    ),
];

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        expanded: true,
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
