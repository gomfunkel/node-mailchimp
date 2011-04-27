var http = require('http'),
    request = require('request');

/**
 * MailChimp API wrapper for the API version 1.1. This object should not be 
 * instantiated directly but by using the version wrapper {@link MailChimpAPI}.
 * 
 * @param apiKey The API key to access the MailChimp API with
 * @param options Configuration options
 * @return Instance of {@link MailChimpAPI_v1_1}
 */
function MailChimpAPI_v1_1 (apiKey, options) {
	
	if (!options) 
		var options = {};
	
	this.version     = '1.1';
	this.apiKey      = apiKey;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.datacenter  = apiKey.split('-');
	this.datacenter  = this.datacenter[1];
	this.httpHost    = this.datacenter+'.api.mailchimp.com';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80'; 
	
}

module.exports = MailChimpAPI_v1_1;

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
MailChimpAPI_v1_1.prototype.execute = function (method, params, callback) {
	
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
 * @see http://www.mailchimp.com/api/1.1/campaigncontent.func.php
 */
MailChimpAPI_v1_1.prototype.campaignContent = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignContent', {
		cid         : ((typeof params.cid !== 'undefined') ? params.cid : null),
		for_archive : ((typeof params.for_archive !== 'undefined') ? params.for_archive : null),
	}, callback);
}

/**
 * Create a new draft campaign to send.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaigncreate.func.php
 */
MailChimpAPI_v1_1.prototype.campaignCreate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignCreate', {
	    type         : ((typeof params.type !== 'undefined') ? params.type : null),
	    options      : ((typeof params.options !== 'undefined') ? params.options : null),
	    content      : ((typeof params.content !== 'undefined') ? params.content : null),
	    segment_opts : ((typeof params.segment_opts !== 'undefined') ? params.segment_opts : null),
	    type_opts    : ((typeof params.type_opts !== 'undefined') ? params.type_opts : null),
	}, callback);
}

/**
 * Delete a campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaigndelete.func.php
 */
MailChimpAPI_v1_1.prototype.campaignDelete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignDelete', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Attach Ecommerce Order Information to a Campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignecommaddorder.func.php
 */
MailChimpAPI_v1_1.prototype.campaignEcommAddOrder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommAddOrder', {
	    order : ((typeof params.order !== 'undefined') ? params.order : null),
	}, callback);
}

/**
 * List all the folders for a user account.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignfolders.func.php
 */
MailChimpAPI_v1_1.prototype.campaignFolders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignFolders', {
	}, callback);
}

/**
 * Pause an AutoResponder or RSS campaign from sending.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignpause.func.php
 */
MailChimpAPI_v1_1.prototype.campaignPause = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignPause', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Replicate a campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignreplicate.func.php
 */
MailChimpAPI_v1_1.prototype.campaignReplicate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignReplicate', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Resume sending an AutoResponder or RSS campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignresume.func.php
 */
MailChimpAPI_v1_1.prototype.campaignResume = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignResume', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Schedule a campaign to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignschedule.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSchedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSchedule', {
	    cid             : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    schedule_time   : ((typeof params.schedule_time !== 'undefined') ? params.schedule_time : null),
	    schedule_time_b : ((typeof params.schedule_time_b !== 'undefined') ? params.schedule_time_b : null),
	}, callback);
}

/**
 * Allows one to test their segmentation rules before creating a campaign using
 * them.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignsegmenttest.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSegmentTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSegmentTest', {
		list_id : ((typeof params.list_id !== 'undefined') ? params.list_id : null),
		options : ((typeof params.options !== 'undefined') ? params.options : null),
	}, callback);
}

/**
 * Send a given campaign immediately.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignsendnow.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSendNow = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendNow', {
		cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Send a test of this campaign to the provided email address.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignsendtest.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSendTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendTest', {
		cid         : ((typeof params.cid !== 'undefined') ? params.cid : null),
		test_emails : ((typeof params.test_emails !== 'undefined') ? params.test_emails : null),
		send_type   : ((typeof params.send_type !== 'undefined') ? params.send_type : null),
	}, callback);
}

/**
 * Retrieve all templates defined for your user account.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaigntemplates.func.php
 */
MailChimpAPI_v1_1.prototype.campaignTemplates = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignTemplates', {
	}, callback);
}

/**
 * Unschedule a campaign that is scheduled to be sent in the future.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignunschedule.func.php
 */
MailChimpAPI_v1_1.prototype.campaignUnschedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnschedule', {
		cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Update just about any setting for a campaign that has not been sent.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignupdate.func.php
 */
MailChimpAPI_v1_1.prototype.campaignUpdate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUpdate', {
		cid   : ((typeof params.cid !== 'undefined') ? params.cid : null),
		name  : ((typeof params.name !== 'undefined') ? params.name : null),
		value : ((typeof params.value !== 'undefined') ? params.value : null),
	}, callback);
}

/**
 * Get the list of campaigns and their details matching the specified filters.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaigns.func.php
 */
MailChimpAPI_v1_1.prototype.campaigns = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaigns', {
		filter_id : ((typeof params.filter_id !== 'undefined') ? params.filter_id : null),
		filter_folder : ((typeof params.filter_folder !== 'undefined') ? params.filter_folder : null),
		filter_fromname : ((typeof params.filter_fromname !== 'undefined') ? params.filter_fromname : null),
		filter_fromemail : ((typeof params.filter_fromemail !== 'undefined') ? params.filter_fromemail : null),
		filter_title : ((typeof params.filter_title !== 'undefined') ? params.filter_title : null),
		filter_subject : ((typeof params.filter_subject !== 'undefined') ? params.filter_subject : null),
		filter_sendtimestart : ((typeof params.filter_sendtimestart !== 'undefined') ? params.filter_sendtimestart : null),
		filter_sendtimeend : ((typeof params.filter_sendtimeend !== 'undefined') ? params.filter_sendtimeend : null),
		filter_exact : ((typeof params.filter_exact !== 'undefined') ? params.filter_exact : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/*****************************************************************************/
/************************** Campaign Stats Methods ***************************/
/*****************************************************************************/

/**
 * Get all email addresses that complained about a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignabusereports.func.php
 */
MailChimpAPI_v1_1.prototype.campaignAbuseReports = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAbuseReports', {
	    cid   : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/**
 * Get an array of the urls being tracked, and their click counts for a given 
 * campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignclickstats.func.php
 */
MailChimpAPI_v1_1.prototype.campaignClickStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickStats', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Get all email addresses with Hard Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignhardbounces.func.php
 */
MailChimpAPI_v1_1.prototype.campaignHardBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignHardBounces', {
	    cid   : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/**
 * Get all email addresses with Soft Bounces for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignsoftbounces.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSoftBounces = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSoftBounces', {
	    cid   : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/**
 * Given a list and a campaign, get all the relevant campaign statistics
 * (opens, bounces, clicks, etc.).
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignstats.func.php
 */
MailChimpAPI_v1_1.prototype.campaignStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignStats', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	}, callback);
}

/**
 * Get all unsubscribed email addresses for a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignunsubscribes.func.php
 */
MailChimpAPI_v1_1.prototype.campaignUnsubscribes = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnsubscribes', {
	    cid   : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/*****************************************************************************/
/*************************** Campaign AIM Methods  ***************************/
/*****************************************************************************/

/**
 * Return the list of email addresses that clicked on a given url, and how many
 * times they clicked.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignclickdetailaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignClickDetailAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickDetailAIM', {
	    cid   : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    url   : ((typeof params.url !== 'undefined') ? params.url : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/**
 * Given a campaign and email address, return the entire click and open history
 * with timestamps, ordered by time.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignemailstatsaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignEmailStatsAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailStatsAIM', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    email_address : ((typeof params.email_address !== 'undefined') ? params.email_address : null),
	}, callback);
}

/**
 * Given a campaign and correct paging limits, return the entire click and open
 * history with timestamps, ordered by time, for every user a campaign was 
 * delivered to.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignemailstatsaimall.func.php
 */
MailChimpAPI_v1_1.prototype.campaignEmailStatsAIMAll = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEmailStatsAIMAll', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/**
 * Retrieve the list of email addresses that did not open a given campaign.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignnotopenedaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignNotOpenedAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignNotOpenedAIM', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/**
 * Retrieve the list of email addresses that opened a given campaign with how
 * many times they opened - note: this AIM function is free and does not 
 * actually require the AIM module to be installed.
 * 
 * @see http://www.mailchimp.com/api/1.1/campaignopenedaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignOpenedAIM = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignOpenedAIM', {
	    cid : ((typeof params.cid !== 'undefined') ? params.cid : null),
	    start : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/*****************************************************************************/
/****************************** Helper Methods *******************************/
/*****************************************************************************/

/**
 * Create a new folder to file campaigns in.
 * 
 * @see http://www.mailchimp.com/api/1.1/createfolder.func.php
 */
MailChimpAPI_v1_1.prototype.createFolder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createFolder', {
		name : ((typeof params.name !== 'undefined') ? params.name : null),
	}, callback);
}

/**
 * Have HTML content auto-converted to a text-only format.
 * 
 * @see http://www.mailchimp.com/api/1.1/generatetext.func.php
 */
MailChimpAPI_v1_1.prototype.generateText = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('generateText', {
	    type    : ((typeof params.type !== 'undefined') ? params.type : null),
	    content : ((typeof params.content !== 'undefined') ? params.content : null),
	}, callback);
}

/**
 * Retrieve your User Unique Id and your Affiliate link to display/use for 
 * Monkey Rewards.
 * 
 * @see http://www.mailchimp.com/api/1.1/getaffiliateinfo.func.php
 */
MailChimpAPI_v1_1.prototype.getAffiliateInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAffiliateInfo', {
	}, callback);
}

/**
 * Send your HTML content to have the CSS inlined and optionally remove the
 * original styles.
 * 
 * @see http://www.mailchimp.com/api/1.1/inlinecss.func.php
 */
MailChimpAPI_v1_1.prototype.inlineCss = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inlineCss', {
	    html      : ((typeof params.html !== 'undefined') ? params.html : null),
	    strip_css : ((typeof params.strip_css !== 'undefined') ? params.strip_css : null),
	}, callback);
}

/**
 * "Ping" the MailChimp API - a simple method you can call that will return a
 * constant value as long as everything is good.
 * 
 * @see http://www.mailchimp.com/api/1.1/ping.func.php
 */
MailChimpAPI_v1_1.prototype.ping = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ping', {
	}, callback);
}

/*****************************************************************************/
/*************************** List Related Methods ****************************/
/*****************************************************************************/

/**
 * Subscribe a batch of email addresses to a list at once.
 * 
 * @see http://www.mailchimp.com/api/1.1/listbatchsubscribe.func.php
 */
MailChimpAPI_v1_1.prototype.listBatchSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchSubscribe', {
	    id                : ((typeof params.id !== 'undefined') ? params.id : null),
	    batch             : ((typeof params.batch !== 'undefined') ? params.batch : null),
	    double_optin      : ((typeof params.double_optin !== 'undefined') ? params.double_optin : null),
	    update_existing   : ((typeof params.update_existing !== 'undefined') ? params.update_existing : null),
	    replace_interests : ((typeof params.replace_interests !== 'undefined') ? params.replace_interests : null),
	}, callback);
}

/**
 * Unsubscribe a batch of email addresses to a list.
 * 
 * @see http://www.mailchimp.com/api/1.1/listbatchunsubscribe.func.php
 */
MailChimpAPI_v1_1.prototype.listBatchUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listBatchUnsubscribe', {
	    id            : ((typeof params.id !== 'undefined') ? params.id : null),
	    emails        : ((typeof params.emails !== 'undefined') ? params.emails : null),
	    delete_member : ((typeof params.delete_member !== 'undefined') ? params.delete_member : null),
	    send_goodbye  : ((typeof params.send_goodbye !== 'undefined') ? params.send_goodbye : null),
	    send_notify   : ((typeof params.send_notify !== 'undefined') ? params.send_notify : null),
	}, callback);
}

/**
 * Add a single Interest Group - if interest groups for the List are not yet
 * enabled, adding the first group will automatically turn them on.
 * 
 * @see http://www.mailchimp.com/api/1.1/listinterestgroupadd.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroupAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupAdd', {
	    id          : ((typeof params.id !== 'undefined') ? params.id : null),
	    group_name  : ((typeof params.group_name !== 'undefined') ? params.group_name : null),
	    grouping_id : ((typeof params.grouping_id !== 'undefined') ? params.grouping_id : null),
	    optional    : ((typeof params.optional !== 'undefined') ? params.optional : null),
	}, callback);
}

/**
 * Delete a single Interest Group - if the last group for a list is deleted, 
 * this will also turn groups for the list off.
 * 
 * @see http://www.mailchimp.com/api/1.1/listinterestgroupdel.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroupDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupDel', {
	    id          : ((typeof params.id !== 'undefined') ? params.id : null),
	    group_name  : ((typeof params.group_name !== 'undefined') ? params.group_name : null),
	    grouping_id : ((typeof params.grouping_id !== 'undefined') ? params.grouping_id : null),
	    optional    : ((typeof params.optional !== 'undefined') ? params.optional : null),
	}, callback);
}

/**
 * Get the list of interest groupings for a given list, including the label,
 * form information, and included groups for each.
 * 
 * @see http://www.mailchimp.com/api/1.1/listinterestgroupings.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroupings = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupings', {
	    id : ((typeof params.id !== 'undefined') ? params.id : null),
	}, callback);
}

/**
 * Get the list of interest groups for a given list, including the label and 
 * form information.
 * 
 * @see http://www.mailchimp.com/api/1.1/listinterestgroups.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroups = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroups', {
	    id : ((typeof params.id !== 'undefined') ? params.id : null),
	}, callback);
}

/**
 * Get all the information for particular members of a list.
 * 
 * @see http://www.mailchimp.com/api/1.1/listmemberinfo.func.php
 */
MailChimpAPI_v1_1.prototype.listMemberInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberInfo', {
	    id            : ((typeof params.id !== 'undefined') ? params.id : null),
	    email_address : ((typeof params.email_address !== 'undefined') ? params.email_address : null),
	}, callback);
}

/**
 * Get all of the list members for a list that are of a particular status.
 * 
 * @see http://www.mailchimp.com/api/1.1/listmembers.func.php
 */
MailChimpAPI_v1_1.prototype.listMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMembers', {
	    id     : ((typeof params.id !== 'undefined') ? params.id : null),
	    status : ((typeof params.status !== 'undefined') ? params.status : null),
	    start  : ((typeof params.start !== 'undefined') ? params.start : null),
	    limit  : ((typeof params.limit !== 'undefined') ? params.limit : null),
	}, callback);
}

/**
 * Add a new merge tag to a given list.
 * 
 * @see http://www.mailchimp.com/api/1.1/listmergevaradd.func.php
 */
MailChimpAPI_v1_1.prototype.listMergeVarAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarAdd', {
	    id   : ((typeof params.id !== 'undefined') ? params.id : null),
	    tag  : ((typeof params.tag !== 'undefined') ? params.tag : null),
	    name : ((typeof params.name !== 'undefined') ? params.name : null),
	    req  : ((typeof params.req !== 'undefined') ? params.req : null),
	}, callback);
}

/**
 * Delete a merge tag from a given list and all its members.
 * 
 * @see http://www.mailchimp.com/api/1.1/listmergevardel.func.php
 */
MailChimpAPI_v1_1.prototype.listMergeVarDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarDel', {
	    id  : ((typeof params.id !== 'undefined') ? params.id : null),
	    tag : ((typeof params.tag !== 'undefined') ? params.tag : null),
	}, callback);
}

/**
 * Get the list of merge tags for a given list, including their name, tag, and
 * required setting.
 * 
 * @see http://www.mailchimp.com/api/1.1/listmergevars.func.php
 */
MailChimpAPI_v1_1.prototype.listMergeVars = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVars', {
	    id : ((typeof params.id !== 'undefined') ? params.id : null),
	}, callback);
}

/**
 * Subscribe the provided email to a list.
 * 
 * @see http://www.mailchimp.com/api/1.1/listsubscribe.func.php
 */
MailChimpAPI_v1_1.prototype.listSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listSubscribe', {
	    id                : ((typeof params.id !== 'undefined') ? params.id : null),
	    email_address     : ((typeof params.email_address !== 'undefined') ? params.email_address : null),
	    merge_vars        : ((typeof params.merge_vars !== 'undefined') ? params.merge_vars : null),
	    email_type        : ((typeof params.email_type !== 'undefined') ? params.email_type : null),
	    double_optin      : ((typeof params.double_optin !== 'undefined') ? params.double_optin : null),
	}, callback);
}

/**
 * Unsubscribe the given email address from the list.
 * 
 * @see http://www.mailchimp.com/api/1.1/listunsubscribe.func.php
 */
MailChimpAPI_v1_1.prototype.listUnsubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUnsubscribe', {
	    id            : ((typeof params.id !== 'undefined') ? params.id : null),
	    email_address : ((typeof params.email_address !== 'undefined') ? params.email_address : null),
	    delete_member : ((typeof params.delete_member !== 'undefined') ? params.delete_member : null),
	    send_goodbye  : ((typeof params.send_goodbye !== 'undefined') ? params.send_goodbye : null),
	    send_notify   : ((typeof params.send_notify !== 'undefined') ? params.send_notify : null),
	}, callback);
}

/**
 * Edit the email address, merge fields, and interest groups for a list member.
 * 
 * @see http://www.mailchimp.com/api/1.1/listupdatemember.func.php
 */
MailChimpAPI_v1_1.prototype.listUpdateMember = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listUpdateMember', {
	    id                : ((typeof params.id !== 'undefined') ? params.id : null),
	    email_address     : ((typeof params.email_address !== 'undefined') ? params.email_address : null),
	    merge_vars        : ((typeof params.merge_vars !== 'undefined') ? params.merge_vars : null),
	    email_type        : ((typeof params.email_type !== 'undefined') ? params.email_type : null),
	    replace_interests : ((typeof params.replace_interests !== 'undefined') ? params.replace_interests : null),
	}, callback);
}

/**
 * Retrieve all of the lists defined for your user account.
 * 
 * @see http://www.mailchimp.com/api/1.1/lists.func.php
 */
MailChimpAPI_v1_1.prototype.lists = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/apikeyadd.func.php
 */
MailChimpAPI_v1_1.prototype.apikeyAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyAdd', {
	    username : ((typeof params.username !== 'undefined') ? params.username : null),
	    password : ((typeof params.password !== 'undefined') ? params.password : null),
	}, callback);
}

/**
 * Expire a Specific API Key.
 * 
 * @see http://www.mailchimp.com/api/1.1/apikeyexpire.func.php
 */
MailChimpAPI_v1_1.prototype.apikeyExpire = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyExpire', {
	    username : ((typeof params.username !== 'undefined') ? params.username : null),
	    password : ((typeof params.password !== 'undefined') ? params.password : null),
	}, callback);
}

/**
 * Retrieve a list of all MailChimp API Keys for this User.
 * 
 * @see http://www.mailchimp.com/api/1.1/apikeys.func.php
 */
MailChimpAPI_v1_1.prototype.apikeys = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeys', {
	    username : ((typeof params.username !== 'undefined') ? params.username : null),
	    password : ((typeof params.password !== 'undefined') ? params.password : null),
	    expired  : ((typeof params.expired !== 'undefined') ? params.expired : null),
	}, callback);
}