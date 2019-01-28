var http = require('http'),
    request = require('request'),
    helpers = require('./helpers');

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
	this.userAgent   = options.userAgent+' ' || '';
	this.proxy       = options.proxy;

}

module.exports = MailChimpAPI_v1_1;

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
MailChimpAPI_v1_1.prototype.execute = function (method, availableParams, givenParams, callback) {

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
 * @see http://www.mailchimp.com/api/1.1/campaigncontent.func.php
 */
MailChimpAPI_v1_1.prototype.campaignContent = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignContent', [
		'cid',
		'for_archive',
	], params, callback);
}

/**
 * Create a new draft campaign to send.
 *
 * @see http://www.mailchimp.com/api/1.1/campaigncreate.func.php
 */
MailChimpAPI_v1_1.prototype.campaignCreate = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaigndelete.func.php
 */
MailChimpAPI_v1_1.prototype.campaignDelete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignDelete', [
	    'cid',
	], params, callback);
}

/**
 * Attach Ecommerce Order Information to a Campaign.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignecommaddorder.func.php
 */
MailChimpAPI_v1_1.prototype.campaignEcommAddOrder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignEcommAddOrder', [
	    'order',
	], params, callback);
}

/**
 * List all the folders for a user account.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignfolders.func.php
 */
MailChimpAPI_v1_1.prototype.campaignFolders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignFolders', [
	], params, callback);
}

/**
 * Pause an AutoResponder or RSS campaign from sending.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignpause.func.php
 */
MailChimpAPI_v1_1.prototype.campaignPause = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignPause', [
	    'cid',
	], params, callback);
}

/**
 * Replicate a campaign.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignreplicate.func.php
 */
MailChimpAPI_v1_1.prototype.campaignReplicate = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignReplicate', [
	    'cid',
	], params, callback);
}

/**
 * Resume sending an AutoResponder or RSS campaign.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignresume.func.php
 */
MailChimpAPI_v1_1.prototype.campaignResume = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignResume', [
	    'cid',
	], params, callback);
}

/**
 * Schedule a campaign to be sent in the future.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignschedule.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSchedule = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignsegmenttest.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSegmentTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSegmentTest', [
		'list_id',
		'options',
	], params, callback);
}

/**
 * Send a given campaign immediately.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignsendnow.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSendNow = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendNow', [
		'cid',
	], params, callback);
}

/**
 * Send a test of this campaign to the provided email address.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignsendtest.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSendTest = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignSendTest', [
		'cid',
		'test_emails',
		'send_type',
	], params, callback);
}

/**
 * Retrieve all templates defined for your user account.
 *
 * @see http://www.mailchimp.com/api/1.1/campaigntemplates.func.php
 */
MailChimpAPI_v1_1.prototype.campaignTemplates = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignTemplates', [
	], params, callback);
}

/**
 * Unschedule a campaign that is scheduled to be sent in the future.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignunschedule.func.php
 */
MailChimpAPI_v1_1.prototype.campaignUnschedule = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignUnschedule', [
		'cid',
	], params, callback);
}

/**
 * Update just about any setting for a campaign that has not been sent.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignupdate.func.php
 */
MailChimpAPI_v1_1.prototype.campaignUpdate = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaigns.func.php
 */
MailChimpAPI_v1_1.prototype.campaigns = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaigns', [
		'filter_id',
		'filter_folder',
		'filter_fromname',
		'filter_fromemail',
		'filter_title',
		'filter_subject',
		'filter_sendtimestart',
		'filter_sendtimeend',
		'filter_exact',
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
 * @see http://www.mailchimp.com/api/1.1/campaignabusereports.func.php
 */
MailChimpAPI_v1_1.prototype.campaignAbuseReports = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignAbuseReports', [
	    'cid',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Get an array of the urls being tracked, and their click counts for a given
 * campaign.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignclickstats.func.php
 */
MailChimpAPI_v1_1.prototype.campaignClickStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignClickStats', [
	    'cid',
	], params, callback);
}

/**
 * Get all email addresses with Hard Bounces for a given campaign.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignhardbounces.func.php
 */
MailChimpAPI_v1_1.prototype.campaignHardBounces = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignsoftbounces.func.php
 */
MailChimpAPI_v1_1.prototype.campaignSoftBounces = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignstats.func.php
 */
MailChimpAPI_v1_1.prototype.campaignStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('campaignStats', [
	    'cid',
	], params, callback);
}

/**
 * Get all unsubscribed email addresses for a given campaign.
 *
 * @see http://www.mailchimp.com/api/1.1/campaignunsubscribes.func.php
 */
MailChimpAPI_v1_1.prototype.campaignUnsubscribes = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignclickdetailaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignClickDetailAIM = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignemailstatsaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignEmailStatsAIM = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignemailstatsaimall.func.php
 */
MailChimpAPI_v1_1.prototype.campaignEmailStatsAIMAll = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignnotopenedaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignNotOpenedAIM = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/campaignopenedaim.func.php
 */
MailChimpAPI_v1_1.prototype.campaignOpenedAIM = function (params, callback) {
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
 * Create a new folder to file campaigns in.
 *
 * @see http://www.mailchimp.com/api/1.1/createfolder.func.php
 */
MailChimpAPI_v1_1.prototype.createFolder = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createFolder', [
		'name',
	], params, callback);
}

/**
 * Have HTML content auto-converted to a text-only format.
 *
 * @see http://www.mailchimp.com/api/1.1/generatetext.func.php
 */
MailChimpAPI_v1_1.prototype.generateText = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('generateText', [
	    'type',
	    'content',
	], params, callback);
}

/**
 * Retrieve your User Unique Id and your Affiliate link to display/use for
 * Monkey Rewards.
 *
 * @see http://www.mailchimp.com/api/1.1/getaffiliateinfo.func.php
 */
MailChimpAPI_v1_1.prototype.getAffiliateInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getAffiliateInfo', [
	], params, callback);
}

/**
 * Send your HTML content to have the CSS inlined and optionally remove the
 * original styles.
 *
 * @see http://www.mailchimp.com/api/1.1/inlinecss.func.php
 */
MailChimpAPI_v1_1.prototype.inlineCss = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inlineCss', [
	    'html',
	    'strip_css',
	], params, callback);
}

/**
 * "Ping" the MailChimp API - a simple method you can call that will return a
 * constant value as long as everything is good.
 *
 * @see http://www.mailchimp.com/api/1.1/ping.func.php
 */
MailChimpAPI_v1_1.prototype.ping = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ping', [
	], params, callback);
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
 * @see http://www.mailchimp.com/api/1.1/listbatchunsubscribe.func.php
 */
MailChimpAPI_v1_1.prototype.listBatchUnsubscribe = function (params, callback) {
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
 * Add a single Interest Group - if interest groups for the List are not yet
 * enabled, adding the first group will automatically turn them on.
 *
 * @see http://www.mailchimp.com/api/1.1/listinterestgroupadd.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroupAdd = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/listinterestgroupdel.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroupDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupDel', [
	    'id',
	    'group_name',
	    'grouping_id',
	    'optional',
	], params, callback);
}

/**
 * Get the list of interest groupings for a given list, including the label,
 * form information, and included groups for each.
 *
 * @see http://www.mailchimp.com/api/1.1/listinterestgroupings.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroupings = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroupings', [
	    'id',
	], params, callback);
}

/**
 * Get the list of interest groups for a given list, including the label and
 * form information.
 *
 * @see http://www.mailchimp.com/api/1.1/listinterestgroups.func.php
 */
MailChimpAPI_v1_1.prototype.listInterestGroups = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listInterestGroups', [
	    'id',
	], params, callback);
}

/**
 * Get all the information for particular members of a list.
 *
 * @see http://www.mailchimp.com/api/1.1/listmemberinfo.func.php
 */
MailChimpAPI_v1_1.prototype.listMemberInfo = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMemberInfo', [
	    'id',
	    'email_address',
	], params, callback);
}

/**
 * Get all of the list members for a list that are of a particular status.
 *
 * @see http://www.mailchimp.com/api/1.1/listmembers.func.php
 */
MailChimpAPI_v1_1.prototype.listMembers = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMembers', [
	    'id',
	    'status',
	    'start',
	    'limit',
	], params, callback);
}

/**
 * Add a new merge tag to a given list.
 *
 * @see http://www.mailchimp.com/api/1.1/listmergevaradd.func.php
 */
MailChimpAPI_v1_1.prototype.listMergeVarAdd = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/listmergevardel.func.php
 */
MailChimpAPI_v1_1.prototype.listMergeVarDel = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVarDel', [
	    'id',
	    'tag',
	], params, callback);
}

/**
 * Get the list of merge tags for a given list, including their name, tag, and
 * required setting.
 *
 * @see http://www.mailchimp.com/api/1.1/listmergevars.func.php
 */
MailChimpAPI_v1_1.prototype.listMergeVars = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listMergeVars', [
	    'id',
	], params, callback);
}

/**
 * Subscribe the provided email to a list.
 *
 * @see http://www.mailchimp.com/api/1.1/listsubscribe.func.php
 */
MailChimpAPI_v1_1.prototype.listSubscribe = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('listSubscribe', [
	    'id',
	    'email_address',
	    'merge_vars',
	    'email_type',
	    'double_optin',
	], params, callback);
}

/**
 * Unsubscribe the given email address from the list.
 *
 * @see http://www.mailchimp.com/api/1.1/listunsubscribe.func.php
 */
MailChimpAPI_v1_1.prototype.listUnsubscribe = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/listupdatemember.func.php
 */
MailChimpAPI_v1_1.prototype.listUpdateMember = function (params, callback) {
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
 * Retrieve all of the lists defined for your user account.
 *
 * @see http://www.mailchimp.com/api/1.1/lists.func.php
 */
MailChimpAPI_v1_1.prototype.lists = function (params, callback) {
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
 * @see http://www.mailchimp.com/api/1.1/apikeyadd.func.php
 */
MailChimpAPI_v1_1.prototype.apikeyAdd = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyAdd', [
	    'username',
	    'password',
	], params, callback);
}

/**
 * Expire a Specific API Key.
 *
 * @see http://www.mailchimp.com/api/1.1/apikeyexpire.func.php
 */
MailChimpAPI_v1_1.prototype.apikeyExpire = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeyExpire', [
	    'username',
	    'password',
	], params, callback);
}

/**
 * Retrieve a list of all MailChimp API Keys for this User.
 *
 * @see http://www.mailchimp.com/api/1.1/apikeys.func.php
 */
MailChimpAPI_v1_1.prototype.apikeys = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('apikeys', [
	    'username',
	    'password',
	    'expired',
	], params, callback);
}
