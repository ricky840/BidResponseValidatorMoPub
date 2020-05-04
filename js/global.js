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
	fullscreen: "bed1b1dd026f4e16a2e833f38a108045",
	rv: "c91f6828c4c54dba8f54f5a42728c968",
	native: "8f395fa4fd1c485e99d86e6ba87d967e",
	native_video: "c7b4c51e057e43d9a91eef6034ea9af1"
}

var AdRequestUrls = {};

var UserId = "";

const AD_REQUEST_PARMS = [
	"ats=1",
	"av=1.0",
	"cn=Verizon",
	"ct=2",
	"current_consent_status=unknown",
	"dn=iPhone10,1",
	"force_gdpr_applies=0",
	"gdpr_applies=0",
	"h=1334",
	"iso=us",
	"mcc=311",
	"mnc=480",
	"mr=1",
	"nv=5.11.0",
	"o=p",
	"sc=2.0",
	"v=8",
	"vv=3",
	"w=750",
	"z=-0700",
	"ua=Mozilla%2F5.0%20%28iPhone%3B%20CPU%20iPhone%20OS%2011_4_1%20like%20Mac%20OS%20X%29%20AppleWebKit%2F605.1.15%20%28KHTML%2C%20like%20Gecko%29%20Mobile%2F15G77",
	"admin_debug_mode=1"
].join("&");

const DEFAULT_AD_REQUEST_URL = "https://ads.mopub.com/m/ad?" + AD_REQUEST_PARMS;

