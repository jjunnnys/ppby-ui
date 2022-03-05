import React from 'react';
import Global from '../src/shared/Global';

export const decorators = [
    (Story) => (
        <>
            <Global />
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
        </>
    ),
];

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
