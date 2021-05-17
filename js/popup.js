$(".version").html(`v${chrome.runtime.getManifest().version}`);

$(document).ready(function() {

	init();

	// Init accordion
	$('.ui.accordion').accordion();

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
    let submitBtnObj = $(this);
		submitBtnObj.addClass("loading");

		let adReqBody = getAdRequestBody(values.adformat);
		let bidResponse = values["bid-response"];

		let verifyUpload = function(uploadResult) {
			if (uploadResult.statusCode != 200) {
				messageManager.show({
					header: "Upload Failed",
					content: `Entered bid response was not uploaded - ${uploadResult.statusCode}`
				}, "negative");
				submitBtnObj.removeClass("loading");
				return false;
			}
			makeAdRequest(adReqBody);
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

	// Update Info Segment
	$(".device-id").html(UserId);
	$(".banner-adunit-key").html(ADUNIT_KEYS.banner);
	$(".mrec-adunit-key").html(ADUNIT_KEYS.mrec);
	$(".fullscreen-adunit-key").html(ADUNIT_KEYS.fullscreen);
	$(".rewarded-adunit-key").html(ADUNIT_KEYS.rewarded);
	$(".rv-adunit-key").html(ADUNIT_KEYS.rv);
	$(".native-adunit-key").html(ADUNIT_KEYS.native);
	$(".native-video-adunit-key").html(ADUNIT_KEYS.native_video);
}

function initAdUnitUrls() {
	for (let type in ADUNIT_KEYS) {
		let body = jQuery.extend(true, {}, AdRequestBody);
		body["ifa"] = UserId;
		body["id"] = ADUNIT_KEYS[type]; 
		body["adunit"] = ADUNIT_KEYS[type];
		AdRequestBodys[type] = body;
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

async function makeAdRequest(adReqBody) {
	let headers = {	
		"Content-Type": "application/json; charset=utf-8"
	};

	let request = {	
		"url": DEFAULT_AD_REQUEST_URL,
		"data": adReqBody,
		"headers": headers
	};

	try {
		let result = await http.postRequest(request);
		let link = findMPXVerboseLink(result.responseText);
		console.log(link);

		// remove loader
		$(".ui.response-submit").removeClass("loading");

		// See if link is a valid URL, if it is delete existing bid response and open tab
		if (!_.isEmpty(link)) {
			chrome.tabs.create({ url: link });
      // console.log(request.url);
      // console.log(link);
		} else {
			messageManager.show({
				header: "MPX Verbose Link is not available",
				content: "Are you connected to VPN? MPX Verbose Link only available in <b>full</b> vpn mode"
			}, "negative");
		}
	} catch (error) {
		messageManager.show({
			header: "Error making ad request",
			content: "Make sure you are connected to the internet"
		}, "negative");

		// remove loader
		$(".ui.response-submit").removeClass("loading");
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

function getAdRequestBody(adFormat) {
	let body;
	switch(adFormat) {
		case "banner":
			body = AdRequestBodys.banner;	
			break;
		case "mrec":
			body = AdRequestBodys.mrec;	
			break;
		case "fullscreen":
			body = AdRequestBodys.fullscreen;	
			break;
		case "rewarded":
			body = AdRequestBodys.rewarded;	
			break;
		case "rv":
			body = AdRequestBodys.rv;	
			break;
		case "native":
			body = AdRequestBodys.native;	
			break;
		case "native_video":
			body = AdRequestBodys.native_video;	
			break;
		default:
			body = "";
			break;
	}
	return JSON.stringify(body);
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
