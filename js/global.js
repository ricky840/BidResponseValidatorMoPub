const BIDDER_DOMAIN = "bidder.datswatsup.com";

const GET_STATUS = `http://${BIDDER_DOMAIN}/mopub_bid/status`;
const POST_BID_RESPONSE_URL = `http://${BIDDER_DOMAIN}/mopub_bid/update`;
const POST_BID_RESPONSE_DELETE_URL = `http://${BIDDER_DOMAIN}/mopub_bid/delete`;

const USERID_HEADER_NAME = "X-MoPub-Ext-Ifa";
const AUTH_HEADER_NAME = "X-MoPub-Ext-Auth";
const AUTH_HEADER_VALUE = "aWFtc2xlZXB5";

const MPX_VERBOSE_LINK_TEXT = "Link to mpx verbose";

const ADUNIT_KEYS = {
	banner: "a481fb97f4fe4b2ebef81ab7cc20d145",
	mrec: "01d0a7c48b9f43f1bbf7d64915205bd9",
	fullscreen: "bed1b1dd026f4e16a2e833f38a108045",
	rv: "c91f6828c4c54dba8f54f5a42728c968",
	rewarded: "6385da39bc224d7bb3a7562cc1f6f81c",
	native: "8f395fa4fd1c485e99d86e6ba87d967e",
	native_video: "c7b4c51e057e43d9a91eef6034ea9af1"
};

// var AdRequestUrls = {};
var AdRequestBodys = {};

var UserId = "";

var AdRequestBody = {
	// "ifa": "A0000000-0000-0000-0000-588598991981",
	// "skadn_hash": "c759e289e274545e3f30b9fe87bcadcd9ceea1c02abd08ff8b0f7b4db779e950",
	// "skadn_last_send_ts": "1620967123",
	// "skadn_last_send_av": "5.16.2",
	// "id": "a481fb97f4fe4b2ebef81ab7cc20d145",
	// "adunit": "a481fb97f4fe4b2ebef81ab7cc20d145",
	// "backoff_reason": "unfilled",
	// "backoff_ms": "60000",

  // Don't send safe area. If needed, then make it was dh, dw (device)
	// "ch": "500",
	// "cw": "828",
  // "ch": "1628", (original safe area)
	// "cw": "828", (original safe area)

	"z": "+0800",
	"ats": "1",
	"gdpr_applies": "0",
	"vver": "1.3.4-Mopub",
	"h": "1792",
	"w": "828",
	"bundle": "com.mopub.sample-ricky",
	"dn": "iPhone11,8",
	"mr": "1",
	"av": "5.16.2",
	"o": "p",
	"ct": "2",
	"vv": "4",
	"las": "unknown",
	"ifv": "67D6286E-390B-4FDC-B9EF-FDE816D440CF",
	"os": "ios",
	"mid": "710E8530-0C28-4E28-9534-FCBD7C143F23",
	"current_consent_status": "unknown",
	"nv": "5.16.2",
	"v": "8",
	"force_gdpr_applies": "0",
	"tas": "authorized",
	"sc": "2.0",
  "admin_debug_mode": "1"
};

const DEFAULT_AD_REQUEST_URL = "https://ads.mopub.com/m/ad?bid_response_validator=1";

