import { clientsClaim } from 'workbox-core';
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

clientsClaim();
// Workbox replaces this placeholder with the production precache manifest.
// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST);

const appShellHandler = createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`);
registerRoute(
    new NavigationRoute(appShellHandler, {
        denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
    })
);
