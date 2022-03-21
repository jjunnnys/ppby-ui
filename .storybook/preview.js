import React from 'react';
import '@field-share/styles/dist/css/main.css';
import '../src/components/Toast/styles.css';

export const decorators = [
    (Story) => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2em',
            }}
        >
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
