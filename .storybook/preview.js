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
            <div id="wds-modal"></div>
            <div id="wds-alert-modal"></div>
            <div id="wds-toast"></div>
            <div id="wds-pop-box"></div>
            <div id="wds-move-info"></div>
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
