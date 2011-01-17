var http = require('http');

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
	
	this.version    = '1.3';
	this.apiKey     = apiKey;
	this.secure     = options.secure || false;
	this.datacenter = apiKey.split('-');
	this.datacenter = this.datacenter[1];
	this.httpHost   = this.datacenter+'.api.mailchimp.com';
	this.httpPort   = (this.secure) ? 443 : 80;
	this.httpClient = http.createClient(this.httpPort, this.httpHost, this.secure);
	
}

module.exports = MailChimpAPI_v1_3;

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
MailChimpAPI_v1_3.prototype.execute = function (method, params, callback) {
	
	params.apikey = this.apiKey;
	
	for (param in params)
		if (params[param] === null)
			delete params[param];
	
	var payload = JSON.stringify(params); 
	
	var request = this.httpClient.request('POST', '/'+this.version+'/?method='+method, {'Host' : this.httpHost, 'User-Agent' : 'node-mailchimp/'+this.version, 'Content-Length' : payload.length });
	request.write(payload, 'utf8');
	request.end();
	
	request.on('response', function (response) {
		var responseBody = '';
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			responseBody += chunk;
		});
		response.on('end', function () {
			callback(JSON.parse(responseBody));
		});
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
	this.execute('campaignContent', {
		cid         : params.cid || null,
		for_archive : params.for_archive || null,
	}, callback);
}

/**
 * Create a new draft campaign to send. You can not have more than 32,000 
 * campaigns in your account.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigncreate.func.php
 */
MailChimpAPI_v1_3.prototype.campaignCreate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignCreate', {
	    type         : params.type || null,
	    options      : params.options || null,
	    content      : params.content || null,
	    segment_opts : params.segment_opts || null,
	    type_opts    : params.type_opts || null,
	}, callback);
}

/**
 * Delete a campaign. Seriously, "poof, gone!" - be careful!
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigndelete.func.php
 */
MailChimpAPI_v1_3.prototype.campaignDelete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignDelete', {
	    cid : params.cid || null,
	}, callback);
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
	this.execute('campaignEcommOrderAdd', {
	    order : params.order || null,
	}, callback);
}

/**
 * Pause an AutoResponder or RSS campaign from sending.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignpause.func.php
 */
MailChimpAPI_v1_3.prototype.campaignPause = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignPause', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Replicate a campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignreplicate.func.php
 */
MailChimpAPI_v1_3.prototype.campaignReplicate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignReplicate', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Resume sending an AutoResponder or RSS campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignresume.func.php
 */
MailChimpAPI_v1_3.prototype.campaignResume = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignResume', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Schedule a campaign to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignschedule.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSchedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSchedule', {
	    cid             : params.cid || null,
	    schedule_time   : params.schedule_time || null,
	    schedule_time_b : params.schedule_time_b || null,
	}, callback);
}

/**
 * Allows one to test their segmentation rules before creating a campaign using
 * them.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsegmenttest.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSegmentTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSegmentTest', {
		list_id : params.list_id || null,
		options : params.options || null,
	}, callback);
}

/**
 * Send a given campaign immediately. For RSS campaigns, this will "start" 
 * them.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsendnow.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSendNow = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendNow', {
		cid : params.cid || null,
	}, callback);
}

/**
 * Send a test of this campaign to the provided email address.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsendtest.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSendTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendTest', {
		cid         : params.cid || null,
		test_emails : params.test_emails || null,
		send_type   : params.send_type || null,
	}, callback);
}

/**
 * Get the URL to a customized VIP Report for the specified campaign and
 * optionally send an email to someone with links to it.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsharereport.func.php
 */
MailChimpAPI_v1_3.prototype.campaignShareReport = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignShareReport', {
		cid  : params.cid || null,
		opts : params.opts || null,
	}, callback);
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
	this.execute('campaignTemplateContent', {
		cid : params.cid || null,
	}, callback);
}

/**
 * Unschedule a campaign that is scheduled to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignunschedule.func.php
 */
MailChimpAPI_v1_3.prototype.campaignUnschedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnschedule', {
		cid : params.cid || null,
	}, callback);
}

/**
 * Update just about any setting for a campaign that has not been sent. See 
 * campaignCreate() for details.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignupdate.func.php
 */
MailChimpAPI_v1_3.prototype.campaignUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUpdate', {
		cid   : params.cid || null,
		name  : params.name || null,
		value : params.value || null,
	}, callback);
}

/**
 * Get the list of campaigns and their details matching the specified filters.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigns.func.php
 */
MailChimpAPI_v1_3.prototype.campaigns = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaigns', {
	    filters : params.filters || null,
	    start   : params.start || null,
	    limit   : params.limit || null,
	}, callback);
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
	this.execute('campaignAbuseReports', {
	    cid   : params.cid || null,
	    since : params.since || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
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
	this.execute('campaignAdvice', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Retrieve the Google Analytics data MailChimp has collected for this 
 * campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignanalytics.func.php
 */
MailChimpAPI_v1_3.prototype.campaignAnalytics = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAnalytics', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Retrieve the most recent full bounce message for a specific email address
 * on the given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignbouncemessage.func.php
 */
MailChimpAPI_v1_3.prototype.campaignBounceMessage = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignBounceMessage', {
	    cid   : params.cid || null,
	    email : params.email || null,
	}, callback);
}

/**
 * Retrieve the full bounce messages for the given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignbouncemessages.func.php
 */
MailChimpAPI_v1_3.prototype.campaignBounceMessages = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignBounceMessages', {
	    cid   : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	    since : params.since || null,
	}, callback);
}

/**
 * Get an array of the urls being tracked, and their click counts for a given 
 * campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignclickstats.func.php
 */
MailChimpAPI_v1_3.prototype.campaignClickStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickStats', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Retrieve the Ecommerce Orders tracked by campaignEcommOrderAdd().
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignecommorders.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEcommOrders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommOrders', {
	    cid   : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	    since : params.since || null,
	}, callback);
}

/**
 * Retrieve the tracked eepurl mentions on Twitter.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigneepurlstats.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEepUrlStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEepUrlStats', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Get the top 5 performing email domains for this campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignemaildomainperformance.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEmailDomainPerformance = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailDomainPerformance', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Retrieve the countries and number of opens tracked for each.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigngeoopens.func.php
 */
MailChimpAPI_v1_3.prototype.campaignGeoOpens = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpens', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Retrieve the regions and number of opens tracked for a certain country.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaigngeoopensforcountry.func.php
 */
MailChimpAPI_v1_3.prototype.campaignGeoOpensForCountry = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignGeoOpensForCountry', {
	    cid  : params.cid || null,
	    code : params.code || null,
	}, callback);
}

/**
 * @deprecated Get all email addresses with Hard Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignhardbounces.func.php
 */
MailChimpAPI_v1_3.prototype.campaignHardBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignHardBounces', {
	    cid   : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
}

/**
 * Get all email addresses the campaign was successfully sent to (ie, no 
 * bounces).
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignmembers.func.php
 */
MailChimpAPI_v1_3.prototype.campaignMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignMembers', {
	    cid    : params.cid || null,
	    status : params.status || null,
	    start  : params.start || null,
	    limit  : params.limit || null,
	}, callback);
}

/**
 * @deprecated Get all email addresses with Soft Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignsoftbounces.func.php
 */
MailChimpAPI_v1_3.prototype.campaignSoftBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSoftBounces', {
	    cid   : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
}

/**
 * Given a list and a campaign, get all the relevant campaign statistics
 * (opens, bounces, clicks, etc.).
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignstats.func.php
 */
MailChimpAPI_v1_3.prototype.campaignStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignStats', {
	    cid : params.cid || null,
	}, callback);
}

/**
 * Get all unsubscribed email addresses for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignunsubscribes.func.php
 */
MailChimpAPI_v1_3.prototype.campaignUnsubscribes = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnsubscribes', {
	    cid   : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
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
	this.execute('campaignClickDetailAIM', {
	    cid   : params.cid || null,
	    url   : params.url || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
}

/**
 * Given a campaign and email address, return the entire click and open history
 * with timestamps, ordered by time.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignemailstatsaim.func.php
 */
MailChimpAPI_v1_3.prototype.campaignEmailStatsAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailStatsAIM', {
	    cid : params.cid || null,
	    email_address : params.email_address || null,
	}, callback);
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
	this.execute('campaignEmailStatsAIMAll', {
	    cid : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
}

/**
 * Retrieve the list of email addresses that did not open a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.3/campaignnotopenedaim.func.php
 */
MailChimpAPI_v1_3.prototype.campaignNotOpenedAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignNotOpenedAIM', {
	    cid : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
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
	this.execute('campaignOpenedAIM', {
	    cid : params.cid || null,
	    start : params.start || null,
	    limit : params.limit || null,
	}, callback);
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
	this.execute('ecommOrderAdd', {
	    order : params.order || null,
	}, callback);
}

/**
 * Delete Ecommerce Order Information used for segmentation.
 * 
 * @see http://www.mailchimp.com/api/1.3/ecommorderdel.func.php
 */
MailChimpAPI_v1_3.prototype.ecommOrderDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ecommOrderDel', {
	    store_id : params.store_id || null,
	    order_id : params.order_id || null,
	}, callback);
}

/**
 * Retrieve the Ecommerce Orders for an account.
 * 
 * @see http://www.mailchimp.com/api/1.3/ecommorders.func.php
 */
MailChimpAPI_v1_3.prototype.ecommOrders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ecommOrders', {
	    start : params.start || null,
	    limit : params.limit || null,
	    since : params.since || null,
	}, callback);
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
	this.execute('folderAdd', {
	    name : params.name || null,
	    type : params.type || null,
	}, callback);
}

/**
 * Delete a campaign or autoresponder folder.
 * 
 * @see http://www.mailchimp.com/api/1.3/folderdel.func.php
 */
MailChimpAPI_v1_3.prototype.folderDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('folderDel', {
		fid  : params.fid || null,
	    type : params.type || null,
	}, callback);
}

/**
 * Update the name of a folder for campaigns or autoresponders.
 * 
 * @see http://www.mailchimp.com/api/1.3/folderupdate.func.php
 */
MailChimpAPI_v1_3.prototype.folderUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('folderUpdate', {
	    fid  : params.fid || null,
	    name : params.name || null,
	    type : params.type || null,
	}, callback);
}

/**
 * List all the folders for a user account.
 * 
 * @see http://www.mailchimp.com/api/1.3/folders.func.php
 */
MailChimpAPI_v1_3.prototype.folders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('folders', {
	    type : params.type || null,
	}, callback);
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
	this.execute('campaignsForEmail', {
	    email_address : params.email_address || null,
	}, callback);
}

/**
 * Return the current Chimp Chatter messages for an account.
 * 
 * @see http://www.mailchimp.com/api/1.3/chimpchatter.func.php
 */
MailChimpAPI_v1_3.prototype.chimpChatter = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('chimpChatter', {
	}, callback);
}

/**
 * Have HTML content auto-converted to a text-only format.
 * 
 * @see http://www.mailchimp.com/api/1.3/generatetext.func.php
 */
MailChimpAPI_v1_3.prototype.generateText = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('generateText', {
	    type    : params.type || null,
	    content : params.content || null,
	}, callback);
}

/**
 * Retrieve lots of account information including payments made, plan info, 
 * some account stats, installed modules, contact info, and more.
 * 
 * @see http://www.mailchimp.com/api/1.3/getaccountdetails.func.php
 */
MailChimpAPI_v1_3.prototype.getAccountDetails = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAccountDetails', {
	}, callback);
}

/**
 * Send your HTML content to have the CSS inlined and optionally remove the
 * original styles.
 * 
 * @see http://www.mailchimp.com/api/1.3/inlinecss.func.php
 */
MailChimpAPI_v1_3.prototype.inlineCss = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inlineCss', {
	    html      : params.html || null,
	    strip_css : params.strip_css || null,
	}, callback);
}

/**
 * Retrieve all List Ids a member is subscribed to.
 * 
 * @see http://www.mailchimp.com/api/1.3/listsforemail.func.php
 */
MailChimpAPI_v1_3.prototype.listsForEmail = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listsForEmail', {
	    email_address : params.email_address || null,
	}, callback);
}

/**
 * "Ping" the MailChimp API - a simple method you can call that will return a
 * constant value as long as everything is good.
 * 
 * @see http://www.mailchimp.com/api/1.3/ping.func.php
 */
MailChimpAPI_v1_3.prototype.ping = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.3/listabusereports.func.php
 */
MailChimpAPI_v1_3.prototype.listAbuseReports = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listAbuseReports', {
	    id    : params.id || null,
	    start : params.start || null,
	    limit : params.limit || null,
	    since : params.since || null,
	}, callback);
}

/**
 * Access up to the previous 180 days of daily detailed aggregated activity 
 * stats for a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listactivity.func.php
 */
MailChimpAPI_v1_3.prototype.listActivity = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listActivity', {
	    id : params.id || null,
	}, callback);
}

/**
 * Subscribe a batch of email addresses to a list at once.
 * 
 * @see http://www.mailchimp.com/api/1.3/listbatchsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listBatchSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchSubscribe', {
	    id                : params.id || null,
	    batch             : params.batch || null,
	    double_optin      : params.double_optin || null,
	    update_existing   : params.update_existing || null,
	    replace_interests : params.replace_interests || null,
	}, callback);
}

/**
 * Unsubscribe a batch of email addresses to a list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listbatchunsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listBatchUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchUnsubscribe', {
	    id            : params.id || null,
	    emails        : params.emails || null,
	    delete_member : params.delete_member || null,
	    send_goodbye  : params.send_goodbye || null,
	    send_notify   : params.send_notify || null,
	}, callback);
}

/**
 * Retrieve the clients that the list's subscribers have been tagged as being
 * used based on user agents seen.
 * 
 * @see http://www.mailchimp.com/api/1.3/listclients.func.php
 */
MailChimpAPI_v1_3.prototype.listClients = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listClients', {
	    id : params.id || null,
	}, callback);
}

/**
 * Access the Growth History by Month for a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listgrowthhistory.func.php
 */
MailChimpAPI_v1_3.prototype.listGrowthHistory = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listGrowthHistory', {
	    id : params.id || null,
	}, callback);
}

/**
 * Add a single Interest Group - if interest groups for the List are not yet
 * enabled, adding the first group will automatically turn them on.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupadd.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupAdd', {
	    id          : params.id || null,
	    group_name  : params.group_name || null,
	    grouping_id : params.grouping_id || null,
	    optional    : params.optional || null,
	}, callback);
}

/**
 * Delete a single Interest Group - if the last group for a list is deleted, 
 * this will also turn groups for the list off.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupdel.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupDel', {
	    id          : params.id || null,
	    group_name  : params.group_name || null,
	    grouping_id : params.grouping_id || null,
	}, callback);
}

/**
 * Change the name of an Interest Group.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupupdate.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupUpdate', {
	    id          : params.id || null,
	    old_name    : params.old_name || null,
	    new_name    : params.new_name || null,
	    grouping_id : params.grouping_id || null,
	    optional    : params.optional || null,
	}, callback);
}

/**
 * Add a new Interest Grouping - if interest groups for the List are not yet
 * enabled, adding the first grouping will automatically turn them on.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupingadd.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupingAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingAdd', {
	    id     : params.id || null,
	    name   : params.name || null,
	    type   : params.type || null,
	    groups : params.groups || null,
	}, callback);
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
	this.execute('listInterestGroupingDel', {
	    grouping_id : params.grouping_id || null,
	}, callback);
}

/**
 * Update an existing Interest Grouping.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupingupdate.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupingUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupingUpdate', {
		grouping_id : params.grouping_id || null,
	    name        : params.name || null,
	    value       : params.value || null,
	}, callback);
}

/**
 * Get the list of interest groupings for a given list, including the label,
 * form information, and included groups for each.
 * 
 * @see http://www.mailchimp.com/api/1.3/listinterestgroupings.func.php
 */
MailChimpAPI_v1_3.prototype.listInterestGroupings = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupings', {
	    id : params.id || null,
	}, callback);
}

/**
 * Retrieve the locations (countries) that the list's subscribers have been
 * tagged to based on geocoding their IP address.
 * 
 * @see http://www.mailchimp.com/api/1.3/listlocations.func.php
 */
MailChimpAPI_v1_3.prototype.listLocations = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listLocations', {
	    id : params.id || null,
	}, callback);
}

/**
 * Get the most recent 100 activities for particular list members (open, click,
 * bounce, unsub, abuse, sent to).
 * 
 * @see http://www.mailchimp.com/api/1.3/listmemberactivity.func.php
 */
MailChimpAPI_v1_3.prototype.listMemberActivity = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberActivity', {
	    id            : params.id || null,
	    email_address : params.email_address || null,
	}, callback);
}

/**
 * Get all the information for particular members of a list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmemberinfo.func.php
 */
MailChimpAPI_v1_3.prototype.listMemberInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberInfo', {
	    id            : params.id || null,
	    email_address : params.email_address || null,
	}, callback);
}

/**
 * Get all of the list members for a list that are of a particular status.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmembers.func.php
 */
MailChimpAPI_v1_3.prototype.listMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMembers', {
	    id     : params.id || null,
	    status : params.status || null,
	    since  : params.since || null,
	    start  : params.start || null,
	    limit  : params.limit || null,
	}, callback);
}

/**
 * Add a new merge tag to a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmergevaradd.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVarAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarAdd', {
	    id      : params.id || null,
	    tag     : params.tag || null,
	    name    : params.name || null,
	    options : params.options || null,
	}, callback);
}

/**
 * Delete a merge tag from a given list and all its members.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmergevardel.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVarDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarDel', {
	    id  : params.id || null,
	    tag : params.tag || null,
	}, callback);
}

/**
 * Update most parameters for a merge tag on a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmergevarupdate.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVarUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarUpdate', {
	    id      : params.id || null,
	    tag     : params.tag || null,
	    options : params.options || null,
	}, callback);
}

/**
 * Get the list of merge tags for a given list, including their name, tag, and
 * required setting.
 * 
 * @see http://www.mailchimp.com/api/1.3/listmergevars.func.php
 */
MailChimpAPI_v1_3.prototype.listMergeVars = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVars', {
	    id : params.id || null,
	}, callback);
}

/**
 * Save a segment against a list for later use.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentadd.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentAdd', {
	    id   : params.id || null,
	    name : params.name || null,
	}, callback);
}

/**
 * Delete a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentdel.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentDel', {
	    id     : params.id || null,
	    seg_id : params.seg_id || null,
	}, callback);
}

/**
 * Add list members to a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentmembersadd.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentMembersAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentMembersAdd', {
	    id     : params.id || null,
	    seg_id : params.seg_id || null,
	    batch  : params.batch || null,
	}, callback);
}

/**
 * Remove list members from a static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentmembersdel.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentMembersDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentMembersDel', {
	    id     : params.id || null,
	    seg_id : params.seg_id || null,
	    batch  : params.batch || null,
	}, callback);
}

/**
 * Resets a static segment - removes all members from the static segment.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegmentreset.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegmentReset = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegmentReset', {
	    id     : params.id || null,
	    seg_id : params.seg_id || null,
	}, callback);
}

/**
 * Retrieve all of the Static Segments for a list.
 * 
 * @see http://www.mailchimp.com/api/1.3/liststaticsegments.func.php
 */
MailChimpAPI_v1_3.prototype.listStaticSegments = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listStaticSegments', {
	    id : params.id || null,
	}, callback);
}

/**
 * Subscribe the provided email to a list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listSubscribe', {
	    id                : params.id || null,
	    email_address     : params.email_address || null,
	    merge_vars        : params.merge_vars || null,
	    email_type        : params.email_type || null,
	    double_optin      : params.double_optin || null,
	    update_existing   : params.update_existing || null,
	    replace_interests : params.replace_interests || null,
	    send_welcome      : params.send_welcome || null,
	}, callback);
}

/**
 * Unsubscribe the given email address from the list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listunsubscribe.func.php
 */
MailChimpAPI_v1_3.prototype.listUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUnsubscribe', {
	    id            : params.id || null,
	    email_address : params.email_address || null,
	    delete_member : params.delete_member || null,
	    send_goodbye  : params.send_goodbye || null,
	    send_notify   : params.send_notify || null,
	}, callback);
}

/**
 * Edit the email address, merge fields, and interest groups for a list member.
 * 
 * @see http://www.mailchimp.com/api/1.3/listupdatemember.func.php
 */
MailChimpAPI_v1_3.prototype.listUpdateMember = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUpdateMember', {
	    id                : params.id || null,
	    email_address     : params.email_address || null,
	    merge_vars        : params.merge_vars || null,
	    email_type        : params.email_type || null,
	    replace_interests : params.replace_interests || null,
	}, callback);
}

/**
 * Add a new Webhook URL for the given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listwebhookadd.func.php
 */
MailChimpAPI_v1_3.prototype.listWebhookAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhookAdd', {
	    id      : params.id || null,
	    url     : params.url || null,
	    actions : params.actions || null,
	    sources : params.sources || null,
	}, callback);
}

/**
 * Delete an existing Webhook URL from a given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listwebhookdel.func.php
 */
MailChimpAPI_v1_3.prototype.listWebhookDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhookDel', {
	    id  : params.id || null,
	    url : params.url || null,
	}, callback);
}

/**
 * Return the Webhooks configured for the given list.
 * 
 * @see http://www.mailchimp.com/api/1.3/listwebhooks.func.php
 */
MailChimpAPI_v1_3.prototype.listWebhooks = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listWebhooks', {
	    id : params.id || null,
	}, callback);
}

/**
 * Retrieve all of the lists defined for your user account.
 * 
 * @see http://www.mailchimp.com/api/1.3/lists.func.php
 */
MailChimpAPI_v1_3.prototype.lists = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('lists', {
	    filters : params.filters || null,
	    start   : params.start || null,
	    limit   : params.limit || null,
	}, callback);
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
	this.execute('apikeyAdd', {
	    username : params.username || null,
	    password : params.password || null,
	}, callback);
}

/**
 * Expire a Specific API Key.
 * 
 * @see http://www.mailchimp.com/api/1.3/apikeyexpire.func.php
 */
MailChimpAPI_v1_3.prototype.apikeyExpire = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyExpire', {
	    username : params.username || null,
	    password : params.password || null,
	}, callback);
}

/**
 * Retrieve a list of all MailChimp API Keys for this User.
 * 
 * @see http://www.mailchimp.com/api/1.3/apikeys.func.php
 */
MailChimpAPI_v1_3.prototype.apikeys = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeys', {
	    username : params.username || null,
	    password : params.password || null,
	    expired  : params.expired || null,
	}, callback);
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
	this.execute('templateAdd', {
	    name : params.name || null,
	    html : params.html || null,
	}, callback);
}

/**
 * Delete (deactivate) a user template.
 * 
 * @see http://www.mailchimp.com/api/1.3/templatedel.func.php
 */
MailChimpAPI_v1_3.prototype.templateDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateDel', {
	    id : params.id || null,
	}, callback);
}

/**
 * Pull details for a specific template to help support editing.
 * 
 * @see http://www.mailchimp.com/api/1.3/templateinfo.func.php
 */
MailChimpAPI_v1_3.prototype.templateInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateInfo', {
		tid  : params.tid || null,
		type : params.type || null,
	}, callback);
}

/**
 * Undelete (reactivate) a user template.
 * 
 * @see http://www.mailchimp.com/api/1.3/templateundel.func.php
 */
MailChimpAPI_v1_3.prototype.templateUndel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateUndel', {
	    id : params.id || null,
	}, callback);
}

/**
 * Replace the content of a user template, NOT campaign content.
 * 
 * @see http://www.mailchimp.com/api/1.3/templateupdate.func.php
 */
MailChimpAPI_v1_3.prototype.templateUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templateUpdate', {
	    id     : params.id || null,
	    values : params.values || null,
	}, callback);
}

/**
 * Retrieve various templates available in the system, allowing some thing
 * similar to our template gallery to be created.
 * 
 * @see http://www.mailchimp.com/api/1.3/templates.func.php
 */
MailChimpAPI_v1_3.prototype.templates = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates', {
	    types     : params.types || null,
	    inactives : params.inactives || null,
	    category  : params.category || null,
	}, callback);
}