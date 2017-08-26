var http = require('http'),
    request = require('request'),
    helpers = require('./helpers');

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
	this.userAgent   = options.userAgent+' ' || '';
	this.proxy       = options.proxy;

}

module.exports = MailChimpAPI_v1_2;

/**
 * Sends a given request as a JSON object to the MailChimp API and finally
 * calls the given callback function with the resulting JSON object. This
 * method should not be called directly but will be used internally by all API
 * methods defined.
 *
 * @param method MailChimp API method to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the MailChimp API with
 * @param callback Callback function to call on success
 */
MailChimpAPI_v1_2.prototype.execute = function (method, availableParams, givenParams, callback) {

	var finalParams = { apikey : this.apiKey };
	var currentParam;

	for (var i = 0; i < availableParams.length; i++) {
		currentParam = availableParams[i];
		if (typeof givenParams[currentParam] !== 'undefined')
			finalParams[currentParam] = givenParams[currentParam];
	}

	request({
		uri : this.httpUri+'/'+this.version+'/?output=json&method='+method,
		method: 'POST',
		headers : { 'User-Agent' : this.userAgent+'node-mailchimp/'+this.packageInfo['version'] },
		body : encodeURIComponent(JSON.stringify(finalParams)),
		proxy : this.proxy,
	}, function (error, response, body) {
		helpers.handleMailChimpResponse(error, response, body, callback);
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
	this.execute('campaignContent', [
		'cid',
		'for_archive',
	], params, callback);
}

/**
 * Create a new draft campaign to send.
 *
 * @see http://www.mailchimp.com/api/1.2/campaigncreate.func.php
 */
MailChimpAPI_v1_2.prototype.campaignCreate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignCreate', [
	    'type',
	    'options',
	    'content',
	    'segment_opts',
	    'type_opts',
	], params, callback);
}

/**
 * Delete a campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaigndelete.func.php
 */
MailChimpAPI_v1_2.prototype.campaignDelete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignDelete', [
	    'cid',
	], params, callback);
}

/**
 * Attach Ecommerce Order Information to a Campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignecommaddorder.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEcommAddOrder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommAddOrder', [
	    'order',
	], params, callback);
}

/**
 * List all the folders for a user account.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignfolders.func.php
 */
MailChimpAPI_v1_2.prototype.campaignFolders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignFolders', [
	], params, callback);
}

/**
 * Pause an AutoResponder or RSS campaign from sending.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignpause.func.php
 */
MailChimpAPI_v1_2.prototype.campaignPause = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignPause', [
	    'cid',
	], params, callback);
}

/**
 * Replicate a campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignreplicate.func.php
 */
MailChimpAPI_v1_2.prototype.campaignReplicate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignReplicate', [
	    'cid',
	], params, callback);
}

/**
 * Resume sending an AutoResponder or RSS campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignresume.func.php
 */
MailChimpAPI_v1_2.prototype.campaignResume = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignResume', [
	    'cid',
	], params, callback);
}

/**
 * Schedule a campaign to be sent in the future.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignschedule.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSchedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSchedule', [
	    'cid',
	    'schedule_time',
	    'schedule_time_b',
	], params, callback);
}

/**
 * Allows one to test their segmentation rules before creating a campaign using
 * them.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignsegmenttest.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSegmentTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSegmentTest', [
		'list_id',
		'options',
	], params, callback);
}

/**
 * Send a given campaign immediately.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignsendnow.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSendNow = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendNow', [
		'cid',
	], params, callback);
}

/**
 * Send a test of this campaign to the provided email address.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignsendtest.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSendTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendTest', [
		'cid',
		'test_emails',
		'send_type',
	], params, callback);
}

/**
 * Get the URL to a customized VIP Report for the specified campaign and
 * optionally send an email to someone with links to it.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignsharereport.func.php
 */
MailChimpAPI_v1_2.prototype.campaignShareReport = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignShareReport', [
		'cid',
		'opts',
	], params, callback);
}

/**
 * Retrieve all templates defined for your user account.
 *
 * @see http://www.mailchimp.com/api/1.2/campaigntemplates.func.php
 */
MailChimpAPI_v1_2.prototype.campaignTemplates = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignTemplates', [
	], params, callback);
}

/**
 * Unschedule a campaign that is scheduled to be sent in the future.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignunschedule.func.php
 */
MailChimpAPI_v1_2.prototype.campaignUnschedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnschedule', [
		'cid',
	], params, callback);
}

/**
 * Update just about any setting for a campaign that has not been sent.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignupdate.func.php
 */
MailChimpAPI_v1_2.prototype.campaignUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUpdate', [
		'cid',
		'name',
		'value',
	], params, callback);
}

/**
 * Get the list of campaigns and their details matching the specified filters.
 *
 * @see http://www.mailchimp.com/api/1.2/campaigns.func.php
 */
MailChimpAPI_v1_2.prototype.campaigns = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaigns', [
	    'filters',
	    'start',
	    'limit',
	], params, callback);
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
	this.execute('campaignAbuseReports', [
	    'cid',
	    'since',
	    'start',
	    'limit',
	], params, callback);
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
	this.execute('campaignAdvice', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the Google Analytics data MailChimp has collected for this
 * campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignanalytics.func.php
 */
MailChimpAPI_v1_2.prototype.campaignAnalytics = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAnalytics', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the full bounce messages for the given campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignbouncemessages.func.php
 */
MailChimpAPI_v1_2.prototype.campaignBounceMessages = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignBounceMessages', [
	    'cid',
	    'start',
	    'limit',
	    'since',
	], params, callback);
}

/**
 * Get an array of the urls being tracked, and their click counts for a given
 * campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignclickstats.func.php
 */
MailChimpAPI_v1_2.prototype.campaignClickStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickStats', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the Ecommerce Orders tracked by campaignEcommAddOrder().
 *
 * @see http://www.mailchimp.com/api/1.2/campaignecommorders.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEcommOrders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommOrders', [
	    'cid',
	    'start',
	    'limit',
	    'since',
	], params, callback);
}

/**
 * Retrieve the tracked eepurl mentions on Twitter.
 *
 * @see http://www.mailchimp.com/api/1.2/campaigneepurlstats.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEepUrlStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEepUrlStats', [
	    'cid',
	], params, callback);
}

/**
 * Get the top 5 performing email domains for this campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignemaildomainperformance.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEmailDomainPerformance = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailDomainPerformance', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the countries and number of opens tracked for each.
 *
 * @see http://www.mailchimp.com/api/1.2/campaigngeoopens.func.php
 */
MailChimpAPI_v1_2.prototype.campaignGeoOpens = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpens', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the regions and number of opens tracked for a certain country.
 *
 * @see http://www.mailchimp.com/api/1.2/campaigngeoopensforcountry.func.php
 */
MailChimpAPI_v1_2.prototype.campaignGeoOpensForCountry = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpensForCountry', [
	    'cid',
	    'code',
	], params, callback);
}

/**
 * Get all email addresses with Hard Bounces for a given campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignhardbounces.func.php
 */
MailChimpAPI_v1_2.prototype.campaignHardBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignHardBounces', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Get all email addresses with Soft Bounces for a given campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignsoftbounces.func.php
 */
MailChimpAPI_v1_2.prototype.campaignSoftBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSoftBounces', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Given a list and a campaign, get all the relevant campaign statistics
 * (opens, bounces, clicks, etc.).
 *
 * @see http://www.mailchimp.com/api/1.2/campaignstats.func.php
 */
MailChimpAPI_v1_2.prototype.campaignStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignStats', [
	    'cid',
	], params, callback);
}

/**
 * Get all unsubscribed email addresses for a given campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignunsubscribes.func.php
 */
MailChimpAPI_v1_2.prototype.campaignUnsubscribes = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnsubscribes', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
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
	this.execute('campaignClickDetailAIM', [
	    'cid',
	    'url',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Given a campaign and email address, return the entire click and open history
 * with timestamps, ordered by time.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignemailstatsaim.func.php
 */
MailChimpAPI_v1_2.prototype.campaignEmailStatsAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailStatsAIM', [
	    'cid',
	    'email_address',
	], params, callback);
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
	this.execute('campaignEmailStatsAIMAll', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Retrieve the list of email addresses that did not open a given campaign.
 *
 * @see http://www.mailchimp.com/api/1.2/campaignnotopenedaim.func.php
 */
MailChimpAPI_v1_2.prototype.campaignNotOpenedAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignNotOpenedAIM', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
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
	this.execute('campaignOpenedAIM', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
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
	this.execute('chimpChatter', [
	], params, callback);
}

/**
 * Create a new folder to file campaigns in.
 *
 * @see http://www.mailchimp.com/api/1.2/createfolder.func.php
 */
MailChimpAPI_v1_2.prototype.createFolder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createFolder', [
		'name',
	], params, callback);
}

/**
 * Import Ecommerce Order Information to be used for Segmentation.
 *
 * @see http://www.mailchimp.com/api/1.2/ecommaddorder.func.php
 */
MailChimpAPI_v1_2.prototype.ecommAddOrder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createFolder', [
		'order',
	], params, callback);
}

/**
 * Have HTML content auto-converted to a text-only format.
 *
 * @see http://www.mailchimp.com/api/1.2/generatetext.func.php
 */
MailChimpAPI_v1_2.prototype.generateText = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('generateText', [
	    'type',
	    'content',
	], params, callback);
}

/**
 * Retrieve lots of account information including payments made, plan info,
 * some account stats, installed modules, contact info, and more.
 *
 * @see http://www.mailchimp.com/api/1.2/getaccountdetails.func.php
 */
MailChimpAPI_v1_2.prototype.getAccountDetails = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAccountDetails', [
	], params, callback);
}

/**
 * @deprecated Retrieve your User Unique Id and your Affiliate link to display/
 * use for Monkey Rewards.
 *
 * @see http://www.mailchimp.com/api/1.2/getaffiliateinfo.func.php
 */
MailChimpAPI_v1_2.prototype.getAffiliateInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAffiliateInfo', [
	], params, callback);
}

/**
 * Send your HTML content to have the CSS inlined and optionally remove the
 * original styles.
 *
 * @see http://www.mailchimp.com/api/1.2/inlinecss.func.php
 */
MailChimpAPI_v1_2.prototype.inlineCss = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inlineCss', [
	    'html',
	    'strip_css',
	], params, callback);
}

/**
 * Retrieve all List Ids a member is subscribed to.
 *
 * @see http://www.mailchimp.com/api/1.2/listsforemail.func.php
 */
MailChimpAPI_v1_2.prototype.listsForEmail = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listsForEmail', [
	    'email_address',
	], params, callback);
}

/**
 * "Ping" the MailChimp API - a simple method you can call that will return a
 * constant value as long as everything is good.
 *
 * @see http://www.mailchimp.com/api/1.2/ping.func.php
 */
MailChimpAPI_v1_2.prototype.ping = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ping', [
	], params, callback);
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
	this.execute('listAbuseReports', [
	    'id',
	    'start',
	    'limit',
	    'since',
	], params, callback);
}

/**
 * Save a segment against a list for later use.
 *
 * @see http://www.mailchimp.com/api/1.2/listaddstaticsegment.func.php
 */
MailChimpAPI_v1_2.prototype.listAddStaticSegment = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listAddStaticSegment', [
	    'id',
	    'name',
	], params, callback);
}

/**
 * Subscribe a batch of email addresses to a list at once.
 *
 * @see http://www.mailchimp.com/api/1.2/listbatchsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listBatchSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchSubscribe', [
	    'id',
	    'batch',
	    'double_optin',
	    'update_existing',
	    'replace_interests',
	], params, callback);
}

/**
 * Unsubscribe a batch of email addresses to a list.
 *
 * @see http://www.mailchimp.com/api/1.2/listbatchunsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listBatchUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchUnsubscribe', [
	    'id',
	    'emails',
	    'delete_member',
	    'send_goodbye',
	    'send_notify',
	], params, callback);
}

/**
 * Delete a static segment.
 *
 * @see http://www.mailchimp.com/api/1.2/listdelstaticsegment.func.php
 */
MailChimpAPI_v1_2.prototype.listDelStaticSegment = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listDelStaticSegment', [
	    'id',
	    'seg_id',
	], params, callback);
}

/**
 * Access the Growth History by Month for a given list.
 *
 * @see http://www.mailchimp.com/api/1.2/listgrowthhistory.func.php
 */
MailChimpAPI_v1_2.prototype.listGrowthHistory = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listGrowthHistory', [
	    'id',
	], params, callback);
}

/**
 * Add a single Interest Group - if interest groups for the List are not yet
 * enabled, adding the first group will automatically turn them on.
 *
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupadd.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupAdd', [
	    'id',
	    'group_name',
	    'grouping_id',
	], params, callback);
}

/**
 * Delete a single Interest Group - if the last group for a list is deleted,
 * this will also turn groups for the list off.
 *
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupdel.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupDel', [
	    'id',
	    'group_name',
	    'grouping_id',
	    'optional',
	], params, callback);
}

/**
 * Change the name of an Interest Group.
 *
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupupdate.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupUpdate', [
	    'id',
	    'old_name',
	    'new_name',
	    'grouping_id',
	    'optional',
	], params, callback);
}

/**
 * Add a new Interest Grouping - if interest groups for the List are not yet
 * enabled, adding the first grouping will automatically turn them on.
 *
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupingadd.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupingAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingAdd', [
	    'id',
	    'name',
	    'type',
	    'groups',
	], params, callback);
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
	this.execute('listInterestGroupingDel', [
	    'grouping_id',
	], params, callback);
}

/**
 * Update an existing Interest Grouping.
 *
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupingupdate.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupingUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingUpdate', [
		'grouping_id',
	    'name',
	    'value',
	], params, callback);
}

/**
 * Get the list of interest groupings for a given list, including the label,
 * form information, and included groups for each.
 *
 * @see http://www.mailchimp.com/api/1.2/listinterestgroupings.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroupings = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupings', [
	    'id',
	], params, callback);
}

/**
 * @deprecated Get the list of interest groups for a given list, including the
 * label and form information
 *
 * @see http://www.mailchimp.com/api/1.2/listinterestgroups.func.php
 */
MailChimpAPI_v1_2.prototype.listInterestGroups = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroups', [
	    'id',
	], params, callback);
}

/**
 * Get all the information for particular members of a list.
 *
 * @see http://www.mailchimp.com/api/1.2/listmemberinfo.func.php
 */
MailChimpAPI_v1_2.prototype.listMemberInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberInfo', [
	    'id',
	    'email_address',
	], params, callback);
}

/**
 * Get all of the list members for a list that are of a particular status.
 *
 * @see http://www.mailchimp.com/api/1.2/listmembers.func.php
 */
MailChimpAPI_v1_2.prototype.listMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMembers', [
	    'id',
	    'status',
	    'since',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Add a new merge tag to a given list.
 *
 * @see http://www.mailchimp.com/api/1.2/listmergevaradd.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVarAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarAdd', [
	    'id',
	    'tag',
	    'name',
	    'req',
	], params, callback);
}

/**
 * Delete a merge tag from a given list and all its members.
 *
 * @see http://www.mailchimp.com/api/1.2/listmergevardel.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVarDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarDel', [
	    'id',
	    'tag',
	], params, callback);
}

/**
 * Update most parameters for a merge tag on a given list.
 *
 * @see http://www.mailchimp.com/api/1.2/listmergevarupdate.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVarUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarUpdate', [
	    'id',
	    'tag',
	    'options',
	], params, callback);
}

/**
 * Get the list of merge tags for a given list, including their name, tag, and
 * required setting.
 *
 * @see http://www.mailchimp.com/api/1.2/listmergevars.func.php
 */
MailChimpAPI_v1_2.prototype.listMergeVars = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVars', [
	    'id',
	], params, callback);
}

/**
 * Resets a static segment - removes all members from the static segment.
 *
 * @see http://www.mailchimp.com/api/1.2/listresetstaticsegment.func.php
 */
MailChimpAPI_v1_2.prototype.listResetStaticSegment = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listResetStaticSegment', [
	    'id',
	    'seg_id',
	], params, callback);
}

/**
 * Add list members to a static segment.
 *
 * @see http://www.mailchimp.com/api/1.2/liststaticsegmentaddmembers.func.php
 */
MailChimpAPI_v1_2.prototype.listStaticSegmentAddMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentAddMembers', [
	    'id',
	    'seg_id',
	    'batch',
	], params, callback);
}

/**
 * Remove list members from a static segment.
 *
 * @see http://www.mailchimp.com/api/1.2/liststaticsegmentdelmembers.func.php
 */
MailChimpAPI_v1_2.prototype.listStaticSegmentDelMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentDelMembers', [
	    'id',
	    'seg_id',
	    'batch',
	], params, callback);
}

/**
 * Retrieve all of the Static Segments for a list.
 *
 * @see http://www.mailchimp.com/api/1.2/liststaticsegments.func.php
 */
MailChimpAPI_v1_2.prototype.listStaticSegments = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegments', [
	    'id',
	], params, callback);
}

/**
 * Subscribe the provided email to a list.
 *
 * @see http://www.mailchimp.com/api/1.2/listsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listSubscribe', [
	    'id',
	    'email_address',
	    'merge_vars',
	    'email_type',
	    'double_optin',
	    'update_existing',
	    'replace_interests',
	    'send_welcome',
	], params, callback);
}

/**
 * Unsubscribe the given email address from the list.
 *
 * @see http://www.mailchimp.com/api/1.2/listunsubscribe.func.php
 */
MailChimpAPI_v1_2.prototype.listUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUnsubscribe', [
	    'id',
	    'email_address',
	    'delete_member',
	    'send_goodbye',
	    'send_notify',
	], params, callback);
}

/**
 * Edit the email address, merge fields, and interest groups for a list member.
 *
 * @see http://www.mailchimp.com/api/1.2/listupdatemember.func.php
 */
MailChimpAPI_v1_2.prototype.listUpdateMember = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUpdateMember', [
	    'id',
	    'email_address',
	    'merge_vars',
	    'email_type',
	    'replace_interests',
	], params, callback);
}

/**
 * Add a new Webhook URL for the given list.
 *
 * @see http://www.mailchimp.com/api/1.2/listwebhookadd.func.php
 */
MailChimpAPI_v1_2.prototype.listWebhookAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhookAdd', [
	    'id',
	    'url',
	    'actions',
	    'sources',
	], params, callback);
}

/**
 * Delete an existing Webhook URL from a given list.
 *
 * @see http://www.mailchimp.com/api/1.2/listwebhookdel.func.php
 */
MailChimpAPI_v1_2.prototype.listWebhookDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhookDel', [
	    'id',
	    'url',
	], params, callback);
}

/**
 * Return the Webhooks configured for the given list.
 *
 * @see http://www.mailchimp.com/api/1.2/listwebhooks.func.php
 */
MailChimpAPI_v1_2.prototype.listWebhooks = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhooks', [
	    'id',
	], params, callback);
}

/**
 * Retrieve all of the lists defined for your user account.
 *
 * @see http://www.mailchimp.com/api/1.2/lists.func.php
 */
MailChimpAPI_v1_2.prototype.lists = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('lists', [
	], params, callback);
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
	this.execute('apikeyAdd', [
	    'username',
	    'password',
	], params, callback);
}

/**
 * Expire a Specific API Key.
 *
 * @see http://www.mailchimp.com/api/1.2/apikeyexpire.func.php
 */
MailChimpAPI_v1_2.prototype.apikeyExpire = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyExpire', [
	    'username',
	    'password',
	], params, callback);
}

/**
 * Retrieve a list of all MailChimp API Keys for this User.
 *
 * @see http://www.mailchimp.com/api/1.2/apikeys.func.php
 */
MailChimpAPI_v1_2.prototype.apikeys = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeys', [
	    'username',
	    'password',
	    'expired',
	], params, callback);
}
