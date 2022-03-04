import React, { useLayoutEffect } from 'react';

export default function Global() {
    useLayoutEffect(() => {
        if (!document) return;
        const template = `
        <link href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css" rel="stylesheet" type="text/css" />
    <link
    href="//drive.google.com/uc?export=view&id=1mFOBytFrzhvs3F382FwZvcoJUTk4YI7q"
    rel="stylesheet"
    type="text/css"
    />`;
        document.head.insertAdjacentHTML('beforeend', template);
    }, []);
    return <></>;
}
