// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import { authentication } from 'wix-members';

import wixLocationFrontend from 'wix-location-frontend';

import { local } from "wix-storage";

import { lightbox } from 'wix-window-frontend';

$w.onReady(function () {

    const data = lightbox.getContext();

    if (typeof data === "boolean" && data === true) {
        local.removeItem("sessionId");
        authentication.logout();

    }

    wixLocationFrontend.to(wixLocationFrontend.baseUrl);

});