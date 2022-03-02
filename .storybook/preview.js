import React from 'react';

export const decorators = [
    (Story) => (
        <>
            <Story />
            <div id="wds-modal"></div>
            <div id="wds-alert-modal"></div>
            <div id="wds-toast"></div>
            <div id="wds-fixed-info"></div>
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
