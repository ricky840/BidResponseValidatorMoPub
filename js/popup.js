$(".version").html(`v${chrome.runtime.getManifest().version}`);

$(document).ready(function() {

	init();

	// Validate JSON input
	$("#bid-response").keyup(function(event) {
		let inputJSON = $(this).val().trim();
		if (jsonValidator(inputJSON) || _.isEmpty(inputJSON)) {
			$(this).parent().removeClass("error");	
		} else {
			$(this).parent().addClass("error");	
		}
	});

	// Submit button
	$(".response-submit").click(function(event) {
		let values = $(".ui.form").form('get values');
		if (!validateInput(values)) return false;

		// Button loader
		$(this).addClass("loading");

		let adReqUrl = getAdRequestUrl(values.adformat);
		let bidResponse = values["bid-response"];

		let verifyUpload = function(uploadResult) {
			if (uploadResult.statusCode != 200) {
				messageManager.show({
					header: "Upload Failed",
					content: `Entered bid response was not uploaded - ${uploadResult.statusCode}`
				}, "negative");
				$(this).removeClass("loading");
				return false;
			}
			makeAdRequest(adReqUrl);
		};

		// Upload bid response
		uploadBidResponse(bidResponse, verifyUpload);
	});
});

async function init() {
	try {
		UserId = await getUserId();
	} catch (error) {
		messageManager.show({
			header: "User Id does not exist",
			content: "Try refreshing the extension in 'chrome://extensions/' or reinstall"
		}, "negative");
		console.log(error);
	}
	initAdUnitUrls();
	checkBidderStatus();
}

function initAdUnitUrls() {
	for (let type in ADUNIT_KEYS) {
		AdRequestUrls[type] = DEFAULT_AD_REQUEST_URL + `&id=${ADUNIT_KEYS[type]}&udid=ifa:${UserId}`;
	}
}

function getUserId() {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get("userId", function(result) {
			let userId = result["userId"];
			if (!_.isEmpty(userId)){
				resolve(userId);
			} else {
				reject();
			}
		});
	});
}

async function checkBidderStatus() {
	let headers = {	
		[AUTH_HEADER_NAME]: AUTH_HEADER_VALUE,
		[USERID_HEADER_NAME]: UserId,
	};
	let request = { 
		url: GET_STATUS,
		headers: headers
	};
	try {
		let result = await http.getRequest(request);
		if (result.statusCode == 200) {
			$("#bidder-status").html("<h5 class='ui header green'>Running</h5>");
			$(".ui.response-submit").removeClass("disabled");
		} else {
			throw `Invalid Response Code - ${result.statusCode}`;
		}
	} catch (error) {
		$("#bidder-status").html("<h5 class='ui header red'>Down</h5>");
		messageManager.show({
			header: "Bidder is currently not available",
			content: "contact jaejun@twitter.com"
		}, "negative");
		console.log(error);
	}
}

async function makeAdRequest(adReqUrl) {
	let request = {	url: adReqUrl };
	try {
		let result = await http.getRequest(request);
		let link = findMPXVerboseLink(result.responseText);
		console.log(link);

		// remove loader
		$(".ui.response-submit").removeClass("loading");

		// See if link is a valid URL, if it is delete existing bid response and open tab
		if (!_.isEmpty(link)) {
			chrome.tabs.create({ url: link });
		} else {
			messageManager.show({
				header: "MPX Verbose Link is not available",
				content: "Are you connected to VPN? MPX Verbose Link only available in <b>full</b> vpn mode"
			}, "negative");
		}
	} catch (error) {
		console.log(error);
	}
}

async function uploadBidResponse(bidResponseText, callback) {
	let headers = {	
		[AUTH_HEADER_NAME]: AUTH_HEADER_VALUE,
		[USERID_HEADER_NAME]: UserId,
		"Content-Type": "application/json; charset=utf-8"
	};
	let request = {
		url: POST_BID_RESPONSE_URL,
		data: bidResponseText,
		headers: headers
	};
	try {
		let result = await http.postRequest(request);
		callback(result);
	} catch (error) {
		console.log(error);
		callback(error);
	}
}

function getAdRequestUrl(adFormat) {
	let url;
	switch(adFormat) {
		case "banner":
			url = AdRequestUrls.banner;	
			break;
		case "fullscreen":
			url = AdRequestUrls.fullscreen;	
			break;
		case "rv":
			url = AdRequestUrls.rv;	
			break;
		case "native":
			url = AdRequestUrls.native;	
			break;
		case "native_video":
			url = AdRequestUrls.native_video;	
			break;
		default:
			url = "";
			break;
	}
	return url;
}

function validateInput(values) {
	let result = true;
	if (_.isEmpty(values.adformat)) {
		$(".adformat-dropdown").addClass("error");
		result = false;
	}
	if (_.isEmpty(values["bid-response"]) || !jsonValidator(values["bid-response"])) {
		$("#bid-response").parent().addClass("error");
		result = false;
	}
	return result;
}

function jsonValidator(jsonTxt) {
	try {
		JSON.parse(jsonTxt);
		return true;
	} catch(error) {
		return false;
	}
}

function findMPXVerboseLink(adminDebugHtml) {
	let html = $($.parseHTML(adminDebugHtml));
	let mpxUrl = html.find(`a:contains('${MPX_VERBOSE_LINK_TEXT}')`).attr('href');
	return mpxUrl;
}

// dropdown
$(".adformat-dropdown").dropdown({
	clearable: true,
	onChange: function(value, text, element) {
		dropdownDomJObj = $($(this)[0]);
		if (_.isEmpty(value)) {
			dropdownDomJObj.addClass("error");
		} else {
			dropdownDomJObj.removeClass("error");
		}
	}
});

$('.message .close').on('click', function() {
	$(this).closest('.message').transition('fade');
});
