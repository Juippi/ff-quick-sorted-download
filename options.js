/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Currently active rules
var rules = [[], ""];

// Convenience function for getting internationalized strings
function _i18n(key) {
    return browser.i18n.getMessage(key);
}

// Internationalize static strings in options.html
function doI18n() {
    var items = [
	{selector: "#addrule", message: "addRule"},
	{selector: "#save", message: "save"},
	{selector: "#rules_title", message: "rulesTableTitle"},
	{selector: "#rules_hdr_pattern", message: "rulesTablePatternColTitle"},
	{selector: "#rules_hdr_dir", message: "rulesTableDirectoryColTitle"},
	{selector: "#hints", message: "ruleHints"}
    ];
    for (var i = 0; i < items.length; i++) {
	var node = document.querySelector(items[i].selector);
	while (node.firstChild) {
	    node.removeChild(node.firstChild);
	}
	node.appendChild(document.createTextNode(_i18n(items[i].message)));
    }
}

function updateRulesFromUI() {
    var new_rules = []
    for (var i = 0;; i++) {
	var regex_input = document.querySelector("#regex-" + i);
	var dir = document.querySelector("#dir-" + i);
	if (regex_input == null || dir == null) {
	    break;
	}
	var regex_list = regex_input.value.split(",");
	new_rules.push([regex_list, dir.value]);
    }
    rules = new_rules;
}

// Event handler for Save button
function saveSettings(e) {
    e.preventDefault();
    updateRulesFromUI();

    var rules_str = JSON.stringify(rules);
    console.log("saveSettings, rules: " + rules_str);
    var options = {
	rules: rules_str
    }
    browser.storage.local.set(options);
}

// Event handler for Add Rule button
function addRule(e) {
    updateRulesFromUI();
    rules.push( [[], ""] );
    updateOptionsUI(rules);
}

// Event handle for delete rule buttons
function makeDeleteRuleHandler(index) {

    function handler() {
	// console.log("delete from index " + index);
	// console.log("before: " + rules);
	rules.splice(index, 1);
	// console.log("after: " + rules);
	updateOptionsUI(rules);
    }

    return handler;
}

function appendRuleRow(idx, pattern, dir) {
    var table = document.querySelector("#rules");
    var tr = document.createElement("tr");
    tr.id = "rules-row-" + idx;

    var td1 = document.createElement("td");
    var in1 = document.createElement("input");
    in1.value = pattern;
    in1.type = "text";
    in1.id = "regex-" + idx;
    td1.appendChild(in1);
    tr.appendChild(td1);

    var td2 = document.createElement("td");
    var in2 = document.createElement("input");
    in2.value = dir;
    in2.type = "text";
    in2.id = "dir-" + idx;
    td2.appendChild(in2);
    tr.appendChild(td2);

    var td3 = document.createElement("td");
    var del = document.createElement("button");
    del.appendChild(document.createTextNode(_i18n("removeThisRule")));
    del.type = "button";
    del.id = "del-" + idx;
    del.addEventListener("click", makeDeleteRuleHandler(idx));
    td3.appendChild(del);
    tr.appendChild(td3);

    table.appendChild(tr);
}

// Update options page UI to match contents of the global rules array
function updateOptionsUI(rules) {
    var table = document.querySelector("#rules");

    for (var i = table.children.length - 1; i > 0; i--) {
	table.removeChild(table.children[i]);
    }

    for (var i = 0; i < rules.length; i++) {
	appendRuleRow(i, rules[i][0].join(","), rules[i][1]);
    }
}

// Load settings from local storage
function loadSettings() {

    function onError(error) {
	console.log("Error loading settings: " + error);
    }

    function useLoadedRules(result) {
	if (result != null) {
	    // console.log("useLoadedRules " + typeof(result.rules) + " " + result.rules);
	    var parsed_rules = JSON.parse(result.rules);
	    rules = parsed_rules;
	    updateOptionsUI(rules);
	}
    }

    var get = browser.storage.local.get();
    get.then(useLoadedRules, onError);
}

doI18n();

document.addEventListener("DOMContentLoaded", loadSettings);
document.querySelector("#save").addEventListener("click", saveSettings);
document.querySelector("#addrule").addEventListener("click", addRule);
