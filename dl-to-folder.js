/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Get path (relative to the default downloads directory) for fire originating
// from the URL. Return filename relative to the downloads dir.
// If there's no rule match, return just the filename, meaning the file will
// be saved to the root of the downloads dir.
async function getSavePath(url) {
    var rules = await browser.storage.local.get();
    var parsed = new URL(url);
    var fields = parsed.pathname.split("/");
    var filename = fields[fields.length - 1];
    var path = "";

    console.log("read rules " + rules.rules);
    rules = JSON.parse(rules.rules);
    console.log("getSavePath with rules " + rules);

    search:
    for (var i = 0; i < rules.length; i++) {
	var rule = rules[i];
	console.log("check rule " + rule);
	for (var k = 0; k < rule[0].length; k++) {
	    if (rule[0][k] != "" && url.match(rule[0][k]) != null) {
		console.log("MATCH " + rule[0][k]);
		path = rule[1];
		if (!path.endsWith("/")) {
		    path = path + "/";
		}
		break search;
	    }
	}
    }
    console.log("saving to: " + path + filename);
    return path + filename;
}

// Handler for our context menu item
async function onCtxMenuItemClicked(info, tab) {
    if (info.menuItemId == "dl-to-matching-folder") {
	var url;
	if (info.srcUrl != null) {
	    url = info.srcUrl;
	} else {
	    url = info.linkUrl;
	}
    }
    console.log("url " + url);

    var filename = await getSavePath(url);
    var dl = browser.downloads.download({
	url: url,
	filename: filename
    });
}

// Create the custom context menu item for links & media
browser.contextMenus.create({
    id: "dl-to-matching-folder",
    title: browser.i18n.getMessage("contextMenuItemLabel"),
    contexts: ["link", "image", "audio", "video"]
}, null);
browser.contextMenus.onClicked.addListener(onCtxMenuItemClicked);
