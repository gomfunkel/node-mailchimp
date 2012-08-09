var http = require('http'),
    request = require('request'),
    helpers = require('./helpers');

/**
 * MailChimp API wrapper for the API version 1.3. This object should not be 
 * instantiated directly but by using the version wrapper {@link MailChimpAPI}.
 * 
 * @param apiKey The API key to access the MailChimp API with
 * @param options Configuration options
 * @return Instance of {@link MailChimpAPI_v1_3}
 */
function MailChimpAPI_v1_3 (apiKey, options) {
	
	if (!options) 
		var options = {};
	
	this.version     = '1.3';
	this.apiKey      = apiKey;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.datacenter  = apiKey.split('-');
	this.datacenter  = this.datacenter[1];
	this.httpHost    = this.datacenter+'.api.mailchimp.com';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80'; 
	this.userAgent   = options.userAgent+' ' || '';
	
}

module.exports = MailChimpAPI_v1_3;

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
MailChimpAPI_v1_3.prototype.execute = function (method, availableParams, givenParams, callback) {

	var finalParams = { apikey : this.apiKey };
	var currentParam;
	
	for (var i = 0; i < availableParams.length; i++) {
		currentParam = availableParams[i];
		if (typeof givenParams[currentParam] !== 'undefined')
			finalParams[currentParam] = givenParams[currentParam];
	}
	
	request({
		uri : this.httpUri+'/'+this.version+'/?method='+method,
		method: 'POST',
		headers : { 'User-Agent' : this.userAgent+'node-mailchimp/'+this.packageInfo['version'] },
		body : JSON.stringify(finalParams)
	}, function (error, response, body) {
		var parsedResponse;
		if (error) {
			callback(new Error('Unable to connect to the MailChimp API endpoint.'));
		} else {
			
			try {
				parsedResponse = JSON.parse(body); 
			} catch (error) {
				callback(new Error('Error parsing JSON answer from MailChimp API.'));
				return;
			}
			
			if (parsedResponse.error) {
				callback(helpers.createMailChimpError(parsedResponse.error, parsedResponse.code));
				return;
			}
			
			callback(null, parsedResponse);
			
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
 * @see http://www.mailchimp.com/api/1.3/campaigncontent.func.php
 */
MailChimpAPI_v1_3.prototype.campaignContent = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignContent', [
		'cid', 
		'for_archive',
	], params, callback);
}

/**
 * Create a new draft campaign to send. You can not have more than 32,000 
 * campaigns in your account.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigncreate.func.php
 */
MailChimpAPI_v1_3.prototype.campaignCreate = function (params, callback) {
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
 * Delete a campaign. Seriously, "poof, gone!" - be careful!
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigndelete.func.php
 */
MailChimpAPI_v1_3.prototype.campaignDelete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignDelete', [
	    'cid',
	], params, callback);
}

/**
 * Attach Ecommerce Order Information to a Campaign. This will generall be used
 * by ecommerce package plugins that MailChimp provides or by 3rd part system 
 * developers.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignecommorderadd.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEcommOrderAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommOrderAdd', [
	    'order',
	], params, callback);
}

/**
 * Pause an AutoResponder or RSS campaign from sending.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignpause.func.php
 */
MailChimpAPI_v1_3.prototype.campaignPause = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignPause', [
	    'cid',
	], params, callback);
}

/**
 * Replicate a campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignreplicate.func.php
 */
MailChimpAPI_v1_3.prototype.campaignReplicate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignReplicate', [
	    'cid',
	], params, callback);
}

/**
 * Resume sending an AutoResponder or RSS campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignresume.func.php
 */
MailChimpAPI_v1_3.prototype.campaignResume = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignResume', [
	    'cid',
	], params, callback);
}

/**
 * Schedule a campaign to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignschedule.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSchedule = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignsegmenttest.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSegmentTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSegmentTest', [
		'list_id',
		'options',
	], params, callback);
}

/**
 * Send a given campaign immediately. For RSS campaigns, this will "start" 
 * them.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsendnow.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSendNow = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendNow', [
		'cid',
	], params, callback);
}

/**
 * Send a test of this campaign to the provided email address.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsendtest.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSendTest = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignsharereport.func.php
 */
MailChimpAPI_v1_3.prototype.campaignShareReport = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignShareReport', [
		'cid',
		'opts',
	], params, callback);
}

/**
 * Get the HTML template content sections for a campaign. Note that this will
 * return very jagged, non-standard results based on the template a campaign is
 * using. You only want to use this if you want to allow editing template
 * sections in your applicaton.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigntemplatecontent.func.php
 */
MailChimpAPI_v1_3.prototype.campaignTemplateContent = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignTemplateContent', [
		'cid',
	], params, callback);
}

/**
 * Unschedule a campaign that is scheduled to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignunschedule.func.php
 */
MailChimpAPI_v1_3.prototype.campaignUnschedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnschedule', [
		'cid',
	], params, callback);
}

/**
 * Update just about any setting for a campaign that has not been sent. See 
 * campaignCreate() for details.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignupdate.func.php
 */
MailChimpAPI_v1_3.prototype.campaignUpdate = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaigns.func.php
 */
MailChimpAPI_v1_3.prototype.campaigns = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignabusereports.func.php
 */
MailChimpAPI_v1_3.prototype.campaignAbuseReports = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignadvice.func.php
 */
MailChimpAPI_v1_3.prototype.campaignAdvice = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAdvice', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the Google Analytics data MailChimp has collected for this 
 * campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignanalytics.func.php
 */
MailChimpAPI_v1_3.prototype.campaignAnalytics = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAnalytics', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the most recent full bounce message for a specific email address
 * on the given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignbouncemessage.func.php
 */
MailChimpAPI_v1_3.prototype.campaignBounceMessage = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignBounceMessage', [
	    'cid',
	    'email',
	], params, callback);
}

/**
 * Retrieve the full bounce messages for the given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignbouncemessages.func.php
 */
MailChimpAPI_v1_3.prototype.campaignBounceMessages = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignclickstats.func.php
 */
MailChimpAPI_v1_3.prototype.campaignClickStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickStats', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the Ecommerce Orders tracked by campaignEcommOrderAdd().
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignecommorders.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEcommOrders = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaigneepurlstats.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEepUrlStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEepUrlStats', [
	    'cid',
	], params, callback);
}

/**
 * Get the top 5 performing email domains for this campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignemaildomainperformance.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEmailDomainPerformance = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailDomainPerformance', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the countries and number of opens tracked for each.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigngeoopens.func.php
 */
MailChimpAPI_v1_3.prototype.campaignGeoOpens = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpens', [
	    'cid',
	], params, callback);
}

/**
 * Retrieve the regions and number of opens tracked for a certain country.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigngeoopensforcountry.func.php
 */
MailChimpAPI_v1_3.prototype.campaignGeoOpensForCountry = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpensForCountry', [
	    'cid',
	    'code',
	], params, callback);
}

/**
 * @deprecated Get all email addresses with Hard Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignhardbounces.func.php
 */
MailChimpAPI_v1_3.prototype.campaignHardBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignHardBounces', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Get all email addresses the campaign was successfully sent to (ie, no 
 * bounces).
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignmembers.func.php
 */
MailChimpAPI_v1_3.prototype.campaignMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignMembers', [
	    'cid',
	    'status',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * @deprecated Get all email addresses with Soft Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsoftbounces.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSoftBounces = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignstats.func.php
 */
MailChimpAPI_v1_3.prototype.campaignStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignStats', [
	    'cid',
	], params, callback);
}

/**
 * Get all unsubscribed email addresses for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignunsubscribes.func.php
 */
MailChimpAPI_v1_3.prototype.campaignUnsubscribes = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnsubscribes', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
}

/*****************************************************************************/
/*********************** Campaign Report Data Methods  ***********************/
/*****************************************************************************/

/**
 * Return the list of email addresses that clicked on a given url, and how many
 * times they clicked.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignclickdetailaim.func.php
 */
MailChimpAPI_v1_3.prototype.campaignClickDetailAIM = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignemailstatsaim.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEmailStatsAIM = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignemailstatsaimall.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEmailStatsAIMAll = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignnotopenedaim.func.php
 */
MailChimpAPI_v1_3.prototype.campaignNotOpenedAIM = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/campaignopenedaim.func.php
 */
MailChimpAPI_v1_3.prototype.campaignOpenedAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignOpenedAIM', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
}

/*****************************************************************************/
/****************************  Ecommerce Methods *****************************/
/*****************************************************************************/

/**
 * Import Ecommerce Order Information to be used for Segmentation.
 * 
 * @see http://www.mailchimp.com/api/1.3/ecommorderadd.func.php
 */
MailChimpAPI_v1_3.prototype.ecommOrderAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ecommOrderAdd', [
	    'order',
	], params, callback);
}

/**
 * Delete Ecommerce Order Information used for segmentation.
 * 
 * @see http://www.mailchimp.com/api/1.3/ecommorderdel.func.php
 */
MailChimpAPI_v1_3.prototype.ecommOrderDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ecommOrderDel', [
	    'store_id',
	    'order_id',
	], params, callback);
}

/**
 * Retrieve the Ecommerce Orders for an account.
 * 
 * @see http://www.mailchimp.com/api/1.3/ecommorders.func.php
 */
MailChimpAPI_v1_3.prototype.ecommOrders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ecommOrders', [
	    'start',
	    'limit',
	    'since',
	], params, callback);
}

/*****************************************************************************/
/************************** Folder Related Methods ***************************/
/*****************************************************************************/

/**
 * Add a new folder to file campaigns or autoresponders in.
 * 
 * @see http://www.mailchimp.com/api/1.3/folderadd.func.php
 */
MailChimpAPI_v1_3.prototype.folderAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('folderAdd', [
	    'name',
	    'type',
	], params, callback);
}

/**
 * Delete a campaign or autoresponder folder.
 * 
 * @see http://www.mailchimp.com/api/1.3/folderdel.func.php
 */
MailChimpAPI_v1_3.prototype.folderDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('folderDel', [
		'fid',
	    'type',
	], params, callback);
}

/**
 * Update the name of a folder for campaigns or autoresponders.
 * 
 * @see http://www.mailchimp.com/api/1.3/folderupdate.func.php
 */
MailChimpAPI_v1_3.prototype.folderUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('folderUpdate', [
	    'fid',
	    'name',
	    'type',
	], params, callback);
}

/**
 * List all the folders for a user account.
 * 
 * @see http://www.mailchimp.com/api/1.3/folders.func.php
 */
MailChimpAPI_v1_3.prototype.folders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('folders', [
	    'type',
	], params, callback);
}

/*****************************************************************************/
/****************************** Helper Methods *******************************/
/*****************************************************************************/

/**
 * Retrieve all Campaigns Ids a member was sent.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsforemail.func.php
 */
MailChimpAPI_v1_3.prototype.campaignsForEmail = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignsForEmail', [
	    'email_address',
	], params, callback);
}

/**
 * Return the current Chimp Chatter messages for an account.
 * 
 * @see http://www.mailchimp.com/api/1.3/chimpchatter.func.php
 */
MailChimpAPI_v1_3.prototype.chimpChatter = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('chimpChatter', [
	], params, callback);
}

/**
 * Have HTML content auto-converted to a text-only format.
 * 
 * @see http://www.mailchimp.com/api/1.3/generatetext.func.php
 */
MailChimpAPI_v1_3.prototype.generateText = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/getaccountdetails.func.php
 */
MailChimpAPI_v1_3.prototype.getAccountDetails = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAccountDetails', [
	], params, callback);
}

/**
 * Send your HTML content to have the CSS inlined and optionally remove the
 * original styles.
 * 
 * @see http://www.mailchimp.com/api/1.3/inlinecss.func.php
 */
MailChimpAPI_v1_3.prototype.inlineCss = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inlineCss', [
	    'html',
	    'strip_css',
	], params, callback);
}

/**
 * Retrieve all List Ids a member is subscribed to.
 * 
 * @see http://www.mailchimp.com/api/1.3/listsforemail.func.php
 */
MailChimpAPI_v1_3.prototype.listsForEmail = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listsForEmail', [
	    'email_address',
	], params, callback);
}

/**
 * "Ping" the MailChimp API - a simple method you can call that will return a
 * constant value as long as everything is good.
 * 
 * @see http://www.mailchimp.com/api/1.3/ping.func.php
 */
MailChimpAPI_v1_3.prototype.ping = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listabusereports.func.php
 */
MailChimpAPI_v1_3.prototype.listAbuseReports = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listAbuseReports', [
	    'id',
	    'start',
	    'limit',
	    'since',
	], params, callback);
}

/**
 * Access up to the previous 180 days of daily detailed aggregated activity 
 * stats for a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listactivity.func.php
 */
MailChimpAPI_v1_3.prototype.listActivity = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listActivity', [
	    'id',
	], params, callback);
}

/**
 * Subscribe a batch of email addresses to a list at once.
 * 
 * @see http://www.mailchimp.com/api/1.3/listbatchsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listBatchSubscribe = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listbatchunsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listBatchUnsubscribe = function (params, callback) {
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
 * Retrieve the clients that the list's subscribers have been tagged as being
 * used based on user agents seen.
 * 
 * @see http://www.mailchimp.com/api/1.3/listclients.func.php
 */
MailChimpAPI_v1_3.prototype.listClients = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listClients', [
	    'id',
	], params, callback);
}

/**
 * Access the Growth History by Month for a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listgrowthhistory.func.php
 */
MailChimpAPI_v1_3.prototype.listGrowthHistory = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listGrowthHistory', [
	    'id',
	], params, callback);
}

/**
 * Add a single Interest Group - if interest groups for the List are not yet
 * enabled, adding the first group will automatically turn them on.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupadd.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupAdd', [
	    'id',
	    'group_name',
	    'grouping_id',
	    'optional',
	], params, callback);
}

/**
 * Delete a single Interest Group - if the last group for a list is deleted, 
 * this will also turn groups for the list off.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupdel.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupDel', [
	    'id',
	    'group_name',
	    'grouping_id',
	], params, callback);
}

/**
 * Change the name of an Interest Group.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupupdate.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupUpdate = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupingadd.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupingAdd = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupingdel.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupingDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingDel', [
	    'grouping_id',
	], params, callback);
}

/**
 * Update an existing Interest Grouping.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupingupdate.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupingUpdate = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupings.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupings = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupings', [
	    'id',
	], params, callback);
}

/**
 * Retrieve the locations (countries) that the list's subscribers have been
 * tagged to based on geocoding their IP address.
 * 
 * @see http://www.mailchimp.com/api/1.3/listlocations.func.php
 */
MailChimpAPI_v1_3.prototype.listLocations = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listLocations', [
	    'id',
	], params, callback);
}

/**
 * Get the most recent 100 activities for particular list members (open, click,
 * bounce, unsub, abuse, sent to).
 * 
 * @see http://www.mailchimp.com/api/1.3/listmemberactivity.func.php
 */
MailChimpAPI_v1_3.prototype.listMemberActivity = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberActivity', [
	    'id',
	    'email_address',
	], params, callback);
}

/**
 * Get all the information for particular members of a list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmemberinfo.func.php
 */
MailChimpAPI_v1_3.prototype.listMemberInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberInfo', [
	    'id',
	    'email_address',
	], params, callback);
}

/**
 * Get all of the list members for a list that are of a particular status.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmembers.func.php
 */
MailChimpAPI_v1_3.prototype.listMembers = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listmergevaradd.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVarAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarAdd', [
	    'id',
	    'tag',
	    'name',
	    'options',
	], params, callback);
}

/**
 * Delete a merge tag from a given list and all its members.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmergevardel.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVarDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarDel', [
	    'id',
	    'tag',
	], params, callback);
}

/**
 * Update most parameters for a merge tag on a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmergevarupdate.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVarUpdate = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listmergevars.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVars = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVars', [
	    'id',
	], params, callback);
}

/**
 * Save a segment against a list for later use.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentadd.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentAdd', [
	    'id',
	    'name',
	], params, callback);
}

/**
 * Delete a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentdel.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentDel', [
	    'id',
	    'seg_id',
	], params, callback);
}

/**
 * Add list members to a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentmembersadd.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentMembersAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentMembersAdd', [
	    'id',
	    'seg_id',
	    'batch',
	], params, callback);
}

/**
 * Remove list members from a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentmembersdel.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentMembersDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentMembersDel', [
	    'id',
	    'seg_id',
	    'batch',
	], params, callback);
}

/**
 * Resets a static segment - removes all members from the static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentreset.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentReset = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentReset', [
	    'id',
	    'seg_id',
	], params, callback);
}

/**
 * Retrieve all of the Static Segments for a list.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegments.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegments = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegments', [
	    'id',
	], params, callback);
}

/**
 * Subscribe the provided email to a list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listSubscribe = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listunsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listUnsubscribe = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listupdatemember.func.php
 */
MailChimpAPI_v1_3.prototype.listUpdateMember = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listwebhookadd.func.php
 */
MailChimpAPI_v1_3.prototype.listWebhookAdd = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listwebhookdel.func.php
 */
MailChimpAPI_v1_3.prototype.listWebhookDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhookDel', [
	    'id',
	    'url',
	], params, callback);
}

/**
 * Return the Webhooks configured for the given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listwebhooks.func.php
 */
MailChimpAPI_v1_3.prototype.listWebhooks = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhooks', [
	    'id',
	], params, callback);
}

/**
 * Retrieve all of the lists defined for your user account.
 * 
 * @see http://www.mailchimp.com/api/1.3/lists.func.php
 */
MailChimpAPI_v1_3.prototype.lists = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('lists', [
	    'filters',
	    'start',
	    'limit',
	], params, callback);
}

/*****************************************************************************/
/************************* Security Related Methods **************************/
/*****************************************************************************/

/**
 * Add an API Key to your account.
 * 
 * @see http://www.mailchimp.com/api/1.3/apikeyadd.func.php
 */
MailChimpAPI_v1_3.prototype.apikeyAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyAdd', [
	    'username',
	    'password',
	], params, callback);
}

/**
 * Expire a Specific API Key.
 * 
 * @see http://www.mailchimp.com/api/1.3/apikeyexpire.func.php
 */
MailChimpAPI_v1_3.prototype.apikeyExpire = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyExpire', [
	    'username',
	    'password',
	], params, callback);
}

/**
 * Retrieve a list of all MailChimp API Keys for this User.
 * 
 * @see http://www.mailchimp.com/api/1.3/apikeys.func.php
 */
MailChimpAPI_v1_3.prototype.apikeys = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeys', [
	    'username',
	    'password',
	    'expired',
	], params, callback);
}

/*****************************************************************************/
/************************* Template Related Methods **************************/
/*****************************************************************************/

/**
 * Create a new user template, NOT campaign content.
 * 
 * @see http://www.mailchimp.com/api/1.3/templateadd.func.php
 */
MailChimpAPI_v1_3.prototype.templateAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateAdd', [
	    'name',
	    'html',
	], params, callback);
}

/**
 * Delete (deactivate) a user template.
 * 
 * @see http://www.mailchimp.com/api/1.3/templatedel.func.php
 */
MailChimpAPI_v1_3.prototype.templateDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateDel', [
	    'id',
	], params, callback);
}

/**
 * Pull details for a specific template to help support editing.
 * 
 * @see http://www.mailchimp.com/api/1.3/templateinfo.func.php
 */
MailChimpAPI_v1_3.prototype.templateInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateInfo', [
		'tid',
		'type',
	], params, callback);
}

/**
 * Undelete (reactivate) a user template.
 * 
 * @see http://www.mailchimp.com/api/1.3/templateundel.func.php
 */
MailChimpAPI_v1_3.prototype.templateUndel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateUndel', [
	    'id',
	], params, callback);
}

/**
 * Replace the content of a user template, NOT campaign content.
 * 
 * @see http://www.mailchimp.com/api/1.3/templateupdate.func.php
 */
MailChimpAPI_v1_3.prototype.templateUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateUpdate', [
	    'id',
	    'values',
	], params, callback);
}

/**
 * Retrieve various templates available in the system, allowing some thing
 * similar to our template gallery to be created.
 * 
 * @see http://www.mailchimp.com/api/1.3/templates.func.php
 */
MailChimpAPI_v1_3.prototype.templates = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates', [
	    'types',
	    'inactives',
	    'category',
	], params, callback);
}