"use strict";

// Fire when ext installed
chrome.runtime.onInstalled.addListener(function(event) {
  initStorage();

  if (event.reason === 'install') {
    chrome.storage.local.set({freshInstalled: true, extUpdated: false}, function() {
      console.log("Extension Installed");
    });
  }
  if (event.reason === 'update') {
    chrome.storage.local.set({extUpdated: true, freshInstalled: false}, function() {
      console.log("Extension Updated");
    })
  }
});

// Fires when the ext starts(very first time) or when user clicks refresh button in extension page
chrome.runtime.onStartup.addListener(function() {
  initStorage();
});

// Fires when user clicks disable / enable button in extension page
window.onload = function() {
  initStorage();
};

function initStorage() {
  console.log("Initializing Storage");
  chrome.storage.local.get("userId", function(result) {
    if(_.isUndefined(result['userId']) || _.isEmpty(result['userId'])) {
      chrome.storage.local.set({ 
				userId: createIfa()
			});
		}
	});
}

function createIfa() {
	// Iphone
	// A0000000-0000-0000-0000-000000000000
	// AABU4PTE-MW1F-Y7NS-8GDU-588523208046
	// 7EA77E86-4C7D-4BEB-AA39-BD4B87C7140E
	// let ifa = `a${randomString(7)}-${randomString(4)}-${randomString(4)}-${randomString(4)}-${randomString(12)}`;
	let ifa = `A0000000-0000-0000-0000-${Date.now().toString().substring(1)}`;
	return ifa.toUpperCase();
}

function randomString(len) {
  let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
	for (let i=0; i < len; i++) {
    str += charset.charAt(Math.floor(Math.random() * charset.length));
	}
  return str;
}

/**
 *  Override User-Agent
 *  since somewhere around 2021 April, when GET ad request is deprecated
 *  the ad server started to validate the user-agent. It should always be mobile
 *  otherwise it won't run the auction
 **/

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
  // Only change User-Agent if URL has ?bid_response_validator=1
  const url = details.url;
  if (!url.includes("bid_response_validator")) return;

  let headers = details.requestHeaders;
  headers.push({
    name: "User-Agent",
    value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
  });
    return { "requestHeaders": headers };
  },
  {
    urls: [ 
      "https://ads.mopub.com/m/ad*",
    ]
  },
  ["requestHeaders", "extraHeaders", "blocking"]
);






