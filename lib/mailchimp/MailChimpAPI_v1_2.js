var http = require('http'),
    request = require('request');

/**
 * MailChimp API wrapper for the API version 1.2. This object should not be 
 * instantiated directly but by using the version wrapper {@link MailChimpAPI}.
 * 
 * @param apiKey The API key to access the MailChimp API with
 * @param options Configuration options
 * @return Instance of {@link MailChimpAPI_v1_2}
 */
function MailChimpAPI_v1_2 (apiKey, options) {
	
	if (!options) 
		var options = {};
	
	this.version     = '1.2';
	this.apiKey      = apiKey;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.datacenter  = apiKey.split('-');
	this.datacenter  = this.datacenter[1];
	this.httpHost    = this.datacenter+'.api.mailchimp.com';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80'; 
	
}

module.exports = MailChimpAPI_v1_2;

/**
 * Sends a given request as a JSON object to the MailChimp API and finally
 * calls the given callback function with the resulting JSON object. This 
 * method should not be called directly but will be used internally by all API
 * methods defined.
 * 
 * @param method MailChimp API method to call
 * @param params Parameters to call the MailChimp API with
 * @param callback Callback function to call on success 
 */
MailChimpAPI_v1_2.prototype.execute = function (method, params, callback) {
	
	params.apikey = this.apiKey;
	
	for (param in params)
		if (params[param] === null)
			delete params[param];
	
	request({
		uri : this.httpUri+'/'+this.version+'/?output=json&method='+method,
		method: 'POST',
		headers : { 'User-Agent' : 'node-mailchimp/'+this.packageInfo['version'] },
		body : JSON.stringify(params)
	}, function (error, response, body) {
		if (error) {
			callback({ 'error' : 'Unable to connect to the MailChimp API endpoint.', 'code' : 'xxx'})
		} else {
			callback(JSON.parse(body));
		}
	});

}

/*****************************************************************************/
/************************* Campaign Related Methods **************************/
/*****************************************************************************/

/**
 * Get the content (both html and text) for a campaign either as it would 
 * appear in the campaign archive or as the raw, original content.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigncontent.func.php
 */
MailChimpAPI_v1_2.prototype.campaignContent = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignContent', {
		cid         : ((params.cid !== undefined) ? params.cid : null),
		for_archive : ((params.for_archive !== undefined) ? params.for_archive : null),
	}, callback);
}

/**
 * Create a new draft campaign to send.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigncreate.func.php
 */
MailChimpAPI_v1_2.prototype.campaignCreate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignCreate', {
	    type         : ((params.type !== undefined) ? params.type : null),
	    options      : ((params.options !== undefined) ? params.options : null),
	    content      : ((params.content !== undefined) ? params.content : null),
	    segment_opts : ((params.segment_opts !== undefined) ? params.segment_opts : null),
	    type_opts    : ((params.type_opts !== undefined) ? params.type_opts : null),
	}, callback);
}

/**
 * Delete a campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigndelete.func.php
 */
MailChimpAPI_v1_2.prototype.campaignDelete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignDelete', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Attach Ecommerce Order Information to a Campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignecommaddorder.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEcommAddOrder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommAddOrder', {
	    order : ((params.order !== undefined) ? params.order : null),
	}, callback);
}

/**
 * List all the folders for a user account.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignfolders.func.php
 */
MailChimpAPI_v1_2.prototype.campaignFolders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignFolders', {
	}, callback);
}

/**
 * Pause an AutoResponder or RSS campaign from sending.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignpause.func.php
 */
MailChimpAPI_v1_2.prototype.campaignPause = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignPause', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Replicate a campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignreplicate.func.php
 */
MailChimpAPI_v1_2.prototype.campaignReplicate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignReplicate', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Resume sending an AutoResponder or RSS campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignresume.func.php
 */
MailChimpAPI_v1_2.prototype.campaignResume = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignResume', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Schedule a campaign to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignschedule.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSchedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSchedule', {
	    cid             : ((params.cid !== undefined) ? params.cid : null),
	    schedule_time   : ((params.schedule_time !== undefined) ? params.schedule_time : null),
	    schedule_time_b : ((params.schedule_time_b !== undefined) ? params.schedule_time_b : null),
	}, callback);
}

/**
 * Allows one to test their segmentation rules before creating a campaign using
 * them.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignsegmenttest.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSegmentTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSegmentTest', {
		list_id : ((params.list_id !== undefined) ? params.list_id : null),
		options : ((params.options !== undefined) ? params.options : null),
	}, callback);
}

/**
 * Send a given campaign immediately.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignsendnow.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSendNow = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendNow', {
		cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Send a test of this campaign to the provided email address.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignsendtest.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSendTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendTest', {
		cid         : ((params.cid !== undefined) ? params.cid : null),
		test_emails : ((params.test_emails !== undefined) ? params.test_emails : null),
		send_type   : ((params.send_type !== undefined) ? params.send_type : null),
	}, callback);
}

/**
 * Get the URL to a customized VIP Report for the specified campaign and
 * optionally send an email to someone with links to it.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignsharereport.func.php
 */
MailChimpAPI_v1_2.prototype.campaignShareReport = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignShareReport', {
		cid  : ((params.cid !== undefined) ? params.cid : null),
		opts : ((params.opts !== undefined) ? params.opts : null),
	}, callback);
}

/**
 * Retrieve all templates defined for your user account.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigntemplates.func.php
 */
MailChimpAPI_v1_2.prototype.campaignTemplates = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignTemplates', {
	}, callback);
}

/**
 * Unschedule a campaign that is scheduled to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignunschedule.func.php
 */
MailChimpAPI_v1_2.prototype.campaignUnschedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnschedule', {
		cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Update just about any setting for a campaign that has not been sent.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignupdate.func.php
 */
MailChimpAPI_v1_2.prototype.campaignUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUpdate', {
		cid   : ((params.cid !== undefined) ? params.cid : null),
		name  : ((params.name !== undefined) ? params.name : null),
		value : ((params.value !== undefined) ? params.value : null),
	}, callback);
}

/**
 * Get the list of campaigns and their details matching the specified filters.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigns.func.php
 */
MailChimpAPI_v1_2.prototype.campaigns = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaigns', {
	    filters : ((params.filters !== undefined) ? params.filters : null),
	    start   : ((params.start !== undefined) ? params.start : null),
	    limit   : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/*****************************************************************************/
/************************** Campaign Stats Methods ***************************/
/*****************************************************************************/

/**
 * Get all email addresses that complained about a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignabusereports.func.php
 */
MailChimpAPI_v1_2.prototype.campaignAbuseReports = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAbuseReports', {
	    cid   : ((params.cid !== undefined) ? params.cid : null),
	    since : ((params.since !== undefined) ? params.since : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/**
 * Retrieve the text presented in the MailChimp app for how a campaign
 * performed and any advice MailChimp may have for you - best suited for 
 * display in customized reports pages.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignadvice.func.php
 */
MailChimpAPI_v1_2.prototype.campaignAdvice = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAdvice', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Retrieve the Google Analytics data MailChimp has collected for this 
 * campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignanalytics.func.php
 */
MailChimpAPI_v1_2.prototype.campaignAnalytics = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAnalytics', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Retrieve the full bounce messages for the given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignbouncemessages.func.php
 */
MailChimpAPI_v1_2.prototype.campaignBounceMessages = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignBounceMessages', {
	    cid   : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	    since : params.since || null,	    
	}, callback);
}

/**
 * Get an array of the urls being tracked, and their click counts for a given 
 * campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignclickstats.func.php
 */
MailChimpAPI_v1_2.prototype.campaignClickStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickStats', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Retrieve the Ecommerce Orders tracked by campaignEcommAddOrder().
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignecommorders.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEcommOrders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommOrders', {
	    cid   : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	    since : ((params.since !== undefined) ? params.since : null),
	}, callback);
}

/**
 * Retrieve the tracked eepurl mentions on Twitter.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigneepurlstats.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEepUrlStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEepUrlStats', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Get the top 5 performing email domains for this campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignemaildomainperformance.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEmailDomainPerformance = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailDomainPerformance', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Retrieve the countries and number of opens tracked for each.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigngeoopens.func.php
 */
MailChimpAPI_v1_2.prototype.campaignGeoOpens = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpens', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Retrieve the regions and number of opens tracked for a certain country.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaigngeoopensforcountry.func.php
 */
MailChimpAPI_v1_2.prototype.campaignGeoOpensForCountry = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpensForCountry', {
	    cid  : ((params.cid !== undefined) ? params.cid : null),
	    code : ((params.code !== undefined) ? params.code : null),
	}, callback);
}

/**
 * Get all email addresses with Hard Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignhardbounces.func.php
 */
MailChimpAPI_v1_2.prototype.campaignHardBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignHardBounces', {
	    cid   : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/**
 * Get all email addresses with Soft Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignsoftbounces.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSoftBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSoftBounces', {
	    cid   : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/**
 * Given a list and a campaign, get all the relevant campaign statistics
 * (opens, bounces, clicks, etc.).
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignstats.func.php
 */
MailChimpAPI_v1_2.prototype.campaignStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignStats', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	}, callback);
}

/**
 * Get all unsubscribed email addresses for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignunsubscribes.func.php
 */
MailChimpAPI_v1_2.prototype.campaignUnsubscribes = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnsubscribes', {
	    cid   : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/*****************************************************************************/
/*************************** Campaign AIM Methods  ***************************/
/*****************************************************************************/

/**
 * Return the list of email addresses that clicked on a given url, and how many
 * times they clicked.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignclickdetailaim.func.php
 */
MailChimpAPI_v1_2.prototype.campaignClickDetailAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickDetailAIM', {
	    cid   : ((params.cid !== undefined) ? params.cid : null),
	    url   : ((params.url !== undefined) ? params.url : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/**
 * Given a campaign and email address, return the entire click and open history
 * with timestamps, ordered by time.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignemailstatsaim.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEmailStatsAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailStatsAIM', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	    email_address : ((params.email_address !== undefined) ? params.email_address : null),
	}, callback);
}

/**
 * Given a campaign and correct paging limits, return the entire click and open
 * history with timestamps, ordered by time, for every user a campaign was 
 * delivered to.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignemailstatsaimall.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEmailStatsAIMAll = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailStatsAIMAll', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/**
 * Retrieve the list of email addresses that did not open a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignnotopenedaim.func.php
 */
MailChimpAPI_v1_2.prototype.campaignNotOpenedAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignNotOpenedAIM', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/**
 * Retrieve the list of email addresses that opened a given campaign with how
 * many times they opened - note: this AIM function is free and does not 
 * actually require the AIM module to be installed.
 * 
 * @see http://www.mailchimp.com/api/1.2/campaignopenedaim.func.php
 */
MailChimpAPI_v1_2.prototype.campaignOpenedAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignOpenedAIM', {
	    cid : ((params.cid !== undefined) ? params.cid : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/*****************************************************************************/
/****************************** Helper Methods *******************************/
/*****************************************************************************/

/**
 * Return the current Chimp Chatter messages for an account.
 * 
 * @see http://www.mailchimp.com/api/1.2/chimpchatter.func.php
 */
MailChimpAPI_v1_2.prototype.chimpChatter = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('chimpChatter', {
	}, callback);
}

/**
 * Create a new folder to file campaigns in.
 * 
 * @see http://www.mailchimp.com/api/1.2/createfolder.func.php
 */
MailChimpAPI_v1_2.prototype.createFolder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createFolder', {
		name : ((params.name !== undefined) ? params.name : null),
	}, callback);
}

/**
 * Import Ecommerce Order Information to be used for Segmentation.
 * 
 * @see http://www.mailchimp.com/api/1.2/ecommaddorder.func.php
 */
MailChimpAPI_v1_2.prototype.ecommAddOrder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createFolder', {
		order : ((params.order !== undefined) ? params.order : null),
	}, callback);
}

/**
 * Have HTML content auto-converted to a text-only format.
 * 
 * @see http://www.mailchimp.com/api/1.2/generatetext.func.php
 */
MailChimpAPI_v1_2.prototype.generateText = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('generateText', {
	    type    : ((params.type !== undefined) ? params.type : null),
	    content : ((params.content !== undefined) ? params.content : null),
	}, callback);
}

/**
 * Retrieve lots of account information including payments made, plan info, 
 * some account stats, installed modules, contact info, and more.
 * 
 * @see http://www.mailchimp.com/api/1.2/getaccountdetails.func.php
 */
MailChimpAPI_v1_2.prototype.getAccountDetails = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAccountDetails', {
	}, callback);
}

/**
 * @deprecated Retrieve your User Unique Id and your Affiliate link to display/
 * use for Monkey Rewards.
 * 
 * @see http://www.mailchimp.com/api/1.2/getaffiliateinfo.func.php
 */
MailChimpAPI_v1_2.prototype.getAffiliateInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAffiliateInfo', {
	}, callback);
}

/**
 * Send your HTML content to have the CSS inlined and optionally remove the
 * original styles.
 * 
 * @see http://www.mailchimp.com/api/1.2/inlinecss.func.php
 */
MailChimpAPI_v1_2.prototype.inlineCss = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inlineCss', {
	    html      : ((params.html !== undefined) ? params.html : null),
	    strip_css : ((params.strip_css !== undefined) ? params.strip_css : null),
	}, callback);
}

/**
 * Retrieve all List Ids a member is subscribed to.
 * 
 * @see http://www.mailchimp.com/api/1.2/listsforemail.func.php
 */
MailChimpAPI_v1_2.prototype.listsForEmail = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listsForEmail', {
	    email_address : ((params.email_address !== undefined) ? params.email_address : null),
	}, callback);
}

/**
 * "Ping" the MailChimp API - a simple method you can call that will return a
 * constant value as long as everything is good.
 * 
 * @see http://www.mailchimp.com/api/1.2/ping.func.php
 */
MailChimpAPI_v1_2.prototype.ping = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ping', {
	}, callback);
}

/*****************************************************************************/
/*************************** List Related Methods ****************************/
/*****************************************************************************/

/**
 * Get all email addresses that complained about a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.2/listabusereports.func.php
 */
MailChimpAPI_v1_2.prototype.listAbuseReports = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listAbuseReports', {
	    id    : ((params.id !== undefined) ? params.id : null),
	    start : ((params.start !== undefined) ? params.start : null),
	    limit : ((params.limit !== undefined) ? params.limit : null),
	    since : ((params.since !== undefined) ? params.since : null),
	}, callback);
}

/**
 * Save a segment against a list for later use.
 * 
 * @see http://www.mailchimp.com/api/1.2/listaddstaticsegment.func.php
 */
MailChimpAPI_v1_2.prototype.listAddStaticSegment = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listAddStaticSegment', {
	    id   : ((params.id !== undefined) ? params.id : null),
	    name : ((params.name !== undefined) ? params.name : null),
	}, callback);
}

/**
 * Subscribe a batch of email addresses to a list at once.
 * 
 * @see http://www.mailchimp.com/api/1.2/listbatchsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listBatchSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchSubscribe', {
	    id                : ((params.id !== undefined) ? params.id : null),
	    batch             : ((params.batch !== undefined) ? params.batch : null),
	    double_optin      : ((params.double_optin !== undefined) ? params.double_optin : null),
	    update_existing   : ((params.update_existing !== undefined) ? params.update_existing : null),
	    replace_interests : ((params.replace_interests !== undefined) ? params.replace_interests : null),
	}, callback);
}

/**
 * Unsubscribe a batch of email addresses to a list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listbatchunsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listBatchUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchUnsubscribe', {
	    id            : ((params.id !== undefined) ? params.id : null),
	    emails        : ((params.emails !== undefined) ? params.emails : null),
	    delete_member : ((params.delete_member !== undefined) ? params.delete_member : null),
	    send_goodbye  : ((params.send_goodbye !== undefined) ? params.send_goodbye : null),
	    send_notify   : ((params.send_notify !== undefined) ? params.send_notify : null),
	}, callback);
}

/**
 * Delete a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.2/listdelstaticsegment.func.php
 */
MailChimpAPI_v1_2.prototype.listDelStaticSegment = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listDelStaticSegment', {
	    id     : ((params.id !== undefined) ? params.id : null),
	    seg_id : ((params.seg_id !== undefined) ? params.seg_id : null),
	}, callback);
}

/**
 * Access the Growth History by Month for a given list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listgrowthhistory.func.php
 */
MailChimpAPI_v1_2.prototype.listGrowthHistory = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listGrowthHistory', {
	    id : ((params.id !== undefined) ? params.id : null),
	}, callback);
}

/**
 * Add a single Interest Group - if interest groups for the List are not yet
 * enabled, adding the first group will automatically turn them on.
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupadd.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupAdd', {
	    id          : ((params.id !== undefined) ? params.id : null),
	    group_name  : ((params.group_name !== undefined) ? params.group_name : null),
	    grouping_id : ((params.grouping_id !== undefined) ? params.grouping_id : null),
	}, callback);
}

/**
 * Delete a single Interest Group - if the last group for a list is deleted, 
 * this will also turn groups for the list off.
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupdel.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupDel', {
	    id          : ((params.id !== undefined) ? params.id : null),
	    group_name  : ((params.group_name !== undefined) ? params.group_name : null),
	    grouping_id : ((params.grouping_id !== undefined) ? params.grouping_id : null),
	    optional    : ((params.optional !== undefined) ? params.optional : null),
	}, callback);
}

/**
 * Change the name of an Interest Group.
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupupdate.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupUpdate', {
	    id          : ((params.id !== undefined) ? params.id : null),
	    old_name    : ((params.old_name !== undefined) ? params.old_name : null),
	    new_name    : ((params.new_name !== undefined) ? params.new_name : null),
	    grouping_id : ((params.grouping_id !== undefined) ? params.grouping_id : null),
	    optional    : ((params.optional !== undefined) ? params.optional : null),
	}, callback);
}

/**
 * Add a new Interest Grouping - if interest groups for the List are not yet
 * enabled, adding the first grouping will automatically turn them on.
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupingadd.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupingAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingAdd', {
	    id     : ((params.id !== undefined) ? params.id : null),
	    name   : ((params.name !== undefined) ? params.name : null),
	    type   : ((params.type !== undefined) ? params.type : null),
	    groups : ((params.groups !== undefined) ? params.groups : null),
	}, callback);
}

/**
 * Delete an existing Interest Grouping - this will permanently delete all
 * contained interest groups and will remove those selections from all list 
 * members.
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupingdel.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupingDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingDel', {
	    grouping_id : ((params.grouping_id !== undefined) ? params.grouping_id : null),
	}, callback);
}

/**
 * Update an existing Interest Grouping.
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupingupdate.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupingUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingUpdate', {
		grouping_id : ((params.grouping_id !== undefined) ? params.grouping_id : null),
	    name        : ((params.name !== undefined) ? params.name : null),
	    value       : ((params.value !== undefined) ? params.value : null),
	}, callback);
}

/**
 * Get the list of interest groupings for a given list, including the label,
 * form information, and included groups for each.
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupings.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupings = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupings', {
	    id : ((params.id !== undefined) ? params.id : null),
	}, callback);
}

/**
 * @deprecated Get the list of interest groups for a given list, including the
 * label and form information
 * 
 * @see http://www.mailchimp.com/api/1.2/listinterestgroups.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroups = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroups', {
	    id : ((params.id !== undefined) ? params.id : null),
	}, callback);
}

/**
 * Get all the information for particular members of a list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listmemberinfo.func.php
 */
MailChimpAPI_v1_2.prototype.listMemberInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberInfo', {
	    id            : ((params.id !== undefined) ? params.id : null),
	    email_address : ((params.email_address !== undefined) ? params.email_address : null),
	}, callback);
}

/**
 * Get all of the list members for a list that are of a particular status.
 * 
 * @see http://www.mailchimp.com/api/1.2/listmembers.func.php
 */
MailChimpAPI_v1_2.prototype.listMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMembers', {
	    id     : ((params.id !== undefined) ? params.id : null),
	    status : ((params.status !== undefined) ? params.status : null),
	    since  : ((params.since !== undefined) ? params.since : null),
	    start  : ((params.start !== undefined) ? params.start : null),
	    limit  : ((params.limit !== undefined) ? params.limit : null),
	}, callback);
}

/**
 * Add a new merge tag to a given list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listmergevaradd.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVarAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarAdd', {
	    id   : ((params.id !== undefined) ? params.id : null),
	    tag  : ((params.tag !== undefined) ? params.tag : null),
	    name : ((params.name !== undefined) ? params.name : null),
	    req  : ((params.req !== undefined) ? params.req : null),
	}, callback);
}

/**
 * Delete a merge tag from a given list and all its members.
 * 
 * @see http://www.mailchimp.com/api/1.2/listmergevardel.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVarDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarDel', {
	    id  : ((params.id !== undefined) ? params.id : null),
	    tag : ((params.tag !== undefined) ? params.tag : null),
	}, callback);
}

/**
 * Update most parameters for a merge tag on a given list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listmergevarupdate.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVarUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarUpdate', {
	    id      : ((params.id !== undefined) ? params.id : null),
	    tag     : ((params.tag !== undefined) ? params.tag : null),
	    options : ((params.options !== undefined) ? params.options : null),
	}, callback);
}

/**
 * Get the list of merge tags for a given list, including their name, tag, and
 * required setting.
 * 
 * @see http://www.mailchimp.com/api/1.2/listmergevars.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVars = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVars', {
	    id : ((params.id !== undefined) ? params.id : null),
	}, callback);
}

/**
 * Resets a static segment - removes all members from the static segment.
 * 
 * @see http://www.mailchimp.com/api/1.2/listresetstaticsegment.func.php
 */
MailChimpAPI_v1_2.prototype.listResetStaticSegment = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listResetStaticSegment', {
	    id     : ((params.id !== undefined) ? params.id : null),
	    seg_id : ((params.seg_id !== undefined) ? params.seg_id : null),
	}, callback);
}

/**
 * Add list members to a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.2/liststaticsegmentaddmembers.func.php
 */
MailChimpAPI_v1_2.prototype.listStaticSegmentAddMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentAddMembers', {
	    id     : ((params.id !== undefined) ? params.id : null),
	    seg_id : ((params.seg_id !== undefined) ? params.seg_id : null),
	    batch  : ((params.batch !== undefined) ? params.batch : null),
	}, callback);
}

/**
 * Remove list members from a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.2/liststaticsegmentdelmembers.func.php
 */
MailChimpAPI_v1_2.prototype.listStaticSegmentDelMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentDelMembers', {
	    id     : ((params.id !== undefined) ? params.id : null),
	    seg_id : ((params.seg_id !== undefined) ? params.seg_id : null),
	    batch  : ((params.batch !== undefined) ? params.batch : null),
	}, callback);
}

/**
 * Retrieve all of the Static Segments for a list.
 * 
 * @see http://www.mailchimp.com/api/1.2/liststaticsegments.func.php
 */
MailChimpAPI_v1_2.prototype.listStaticSegments = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegments', {
	    id : ((params.id !== undefined) ? params.id : null),
	}, callback);
}

/**
 * Subscribe the provided email to a list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listSubscribe', {
	    id                : ((params.id !== undefined) ? params.id : null),
	    email_address     : ((params.email_address !== undefined) ? params.email_address : null),
	    merge_vars        : ((params.merge_vars !== undefined) ? params.merge_vars : null),
	    email_type        : ((params.email_type !== undefined) ? params.email_type : null),
	    double_optin      : ((params.double_optin !== undefined) ? params.double_optin : null),
	    update_existing   : ((params.update_existing !== undefined) ? params.update_existing : null),
	    replace_interests : ((params.replace_interests !== undefined) ? params.replace_interests : null),
	    send_welcome      : ((params.send_welcome !== undefined) ? params.send_welcome : null),
	}, callback);
}

/**
 * Unsubscribe the given email address from the list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listunsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUnsubscribe', {
	    id            : ((params.id !== undefined) ? params.id : null),
	    email_address : ((params.email_address !== undefined) ? params.email_address : null),
	    delete_member : ((params.delete_member !== undefined) ? params.delete_member : null),
	    send_goodbye  : ((params.send_goodbye !== undefined) ? params.send_goodbye : null),
	    send_notify   : ((params.send_notify !== undefined) ? params.send_notify : null),
	}, callback);
}

/**
 * Edit the email address, merge fields, and interest groups for a list member.
 * 
 * @see http://www.mailchimp.com/api/1.2/listupdatemember.func.php
 */
MailChimpAPI_v1_2.prototype.listUpdateMember = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUpdateMember', {
	    id                : ((params.id !== undefined) ? params.id : null),
	    email_address     : ((params.email_address !== undefined) ? params.email_address : null),
	    merge_vars        : ((params.merge_vars !== undefined) ? params.merge_vars : null),
	    email_type        : ((params.email_type !== undefined) ? params.email_type : null),
	    replace_interests : ((params.replace_interests !== undefined) ? params.replace_interests : null),
	}, callback);
}

/**
 * Add a new Webhook URL for the given list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listwebhookadd.func.php
 */
MailChimpAPI_v1_2.prototype.listWebhookAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhookAdd', {
	    id      : ((params.id !== undefined) ? params.id : null),
	    url     : ((params.url !== undefined) ? params.url : null),
	    actions : ((params.actions !== undefined) ? params.actions : null),
	    sources : ((params.sources !== undefined) ? params.sources : null),
	}, callback);
}

/**
 * Delete an existing Webhook URL from a given list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listwebhookdel.func.php
 */
MailChimpAPI_v1_2.prototype.listWebhookDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhookDel', {
	    id  : ((params.id !== undefined) ? params.id : null),
	    url : ((params.url !== undefined) ? params.url : null),
	}, callback);
}

/**
 * Return the Webhooks configured for the given list.
 * 
 * @see http://www.mailchimp.com/api/1.2/listwebhooks.func.php
 */
MailChimpAPI_v1_2.prototype.listWebhooks = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhooks', {
	    id : ((params.id !== undefined) ? params.id : null),
	}, callback);
}

/**
 * Retrieve all of the lists defined for your user account.
 * 
 * @see http://www.mailchimp.com/api/1.2/lists.func.php
 */
MailChimpAPI_v1_2.prototype.lists = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('lists', {
	}, callback);
}

/*****************************************************************************/
/************************* Security Related Methods **************************/
/*****************************************************************************/

/**
 * Add an API Key to your account.
 * 
 * @see http://www.mailchimp.com/api/1.2/apikeyadd.func.php
 */
MailChimpAPI_v1_2.prototype.apikeyAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyAdd', {
	    username : ((params.username !== undefined) ? params.username : null),
	    password : ((params.password !== undefined) ? params.password : null),
	}, callback);
}

/**
 * Expire a Specific API Key.
 * 
 * @see http://www.mailchimp.com/api/1.2/apikeyexpire.func.php
 */
MailChimpAPI_v1_2.prototype.apikeyExpire = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyExpire', {
	    username : ((params.username !== undefined) ? params.username : null),
	    password : ((params.password !== undefined) ? params.password : null),
	}, callback);
}

/**
 * Retrieve a list of all MailChimp API Keys for this User.
 * 
 * @see http://www.mailchimp.com/api/1.2/apikeys.func.php
 */
MailChimpAPI_v1_2.prototype.apikeys = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeys', {
	    username : ((params.username !== undefined) ? params.username : null),
	    password : ((params.password !== undefined) ? params.password : null),
	    expired  : ((params.expired !== undefined) ? params.expired : null),
	}, callback);
}