// .storybook/YourTheme.js

import { create } from '@storybook/theming';

export default create({
    base: 'light',

    // colorPrimary: 'hotpink',
    // colorSecondary: 'deepskyblue',

    // UI
    //   appBg: "#000",
    //   appContentBg: "silver",
    //   appBorderColor: "grey",
    appBorderRadius: 4,

    // Typography
    // fontBase: '"Spoqa Han Sans Neo", sans-serif',
    // fontCode: "monospace",

    // Text colors
    //   textColor: "#191f28",
    //   textInverseColor: "rgba(255,255,255,0.9)",

    // Toolbar default and active colors
    //   barTextColor: "silver",
    //   barSelectedColor: "black",
    // barBg: '#E0E0E0',

    // Form colors
    //   inputBg: "white",
    //   inputBorder: "silver",
    //   inputTextColor: "black",
    inputBorderRadius: 4,

    brandTitle: 'WDS storybook',
    brandUrl: 'https://www.woojooins.com',
    brandImage: 'static/logo.svg',
});
