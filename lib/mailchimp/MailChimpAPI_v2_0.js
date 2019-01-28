var http 	= require('http');
var request = require('request');
var helpers = require('./helpers');

/**
 * MailChimp API wrapper for the API version 2.0. This object should not be
 * instantiated directly but by using the version wrapper {@link MailChimpAPI}.
 *
 * @param apiKey The API key to access the MailChimp API with
 * @param options Configuration options
 * @return Instance of {@link MailChimpAPI_v2_0}
 */
function MailChimpAPI_v2_0 (apiKey, options) {

	options = options || {};

	this.version     = '2.0';
	this.apiKey      = apiKey;
	this.packageInfo = options.packageInfo;
	this.datacenter  = apiKey.split('-');
	this.datacenter  = this.datacenter[1];
	this.httpHost    = this.datacenter+'.api.mailchimp.com';
	this.httpUri     = 'https://'+this.httpHost+':443';
	this.userAgent   = options.userAgent+' ' || '';
	this.proxy       = options.proxy;

}

module.exports = MailChimpAPI_v2_0;

/**
 * Sends a given request as a HTTP POST (application/x-www-form-urlencoded) to
 * the MailChimp API and finally calls the given callback function with the
 * resulting JSON object. This method should not be called directly but will be
 * used internally by all API methods defined.
 *
 * @param method MailChimp API method to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the MailChimp API with
 * @param callback Callback function to call on success
 */
MailChimpAPI_v2_0.prototype.execute = function (method, availableParams, givenParams, callback) {

	var finalParams = { apikey : this.apiKey };
	var currentParam;

	for (var i = 0; i < availableParams.length; i++) {
		currentParam = availableParams[i];
		if (typeof givenParams[currentParam] !== 'undefined')
			finalParams[currentParam] = givenParams[currentParam];
	}

	request({
		uri : this.httpUri+'/'+this.version+'/'+method,
		method: 'POST',
		headers : { 'User-Agent' : this.userAgent+'node-mailchimp/'+this.packageInfo.version, "accept-encoding" : "gzip,deflate" },
		gzip: true,
		body : JSON.stringify(finalParams),
		proxy : this.proxy,
	}, function (error, response, body) {
		helpers.handleMailChimpResponse(error, response, body, callback);
	});

};

/**
 * You can either call the API methods directly or using this function which
 * assembles the name of the API method from a given method section and
 * method name. Sections and methods are described in the MailChimp API
 * Documentation.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/
 *
 * @param section The section of the API method to call (e.g. 'users')
 * @param method The method to call in the given section
 * @param params Parameters to pass to the API method
 * @param callback Callback function for returned data or errors
 */

MailChimpAPI_v2_0.prototype.call = function (section, method, params, callback) {

	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	if (typeof section != 'string' || typeof method != 'string') {
		callback(new Error('You have to provide the section and the name of the method to call.'));
		return;
	}

	var methodToCall = section+'_'+method.replace(/\-/g, '_');

	if (typeof this[methodToCall] == 'function') {
		this[methodToCall](params, callback);
	} else {
		callback(new Error('The API method '+methodToCall+' does not exist.'));
		return;
	}

};

/*****************************************************************************/
/************************* Campaign Related Methods **************************/
/*****************************************************************************/

/**
 * Get the content (both html and text) for a campaign either as it would
 * appear in the campaign archive or as the raw, original content.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/content.php
 */
MailChimpAPI_v2_0.prototype.campaigns_content = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/content', [
		'cid',
		'options',
	], params, callback);
};

/**
 * Create a new draft campaign to send. You can not have more than 32,000
 * campaigns in your account.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/create.php
 */
MailChimpAPI_v2_0.prototype.campaigns_create = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/create', [
		'type',
		'options',
		'content',
		'segment_opts',
		'type_opts',
	], params, callback);
};

/**
 * Delete a campaign. Seriously, "poof, gone!" - be careful! Seriously, no one
 * can undelete these.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/delete.php
 */
MailChimpAPI_v2_0.prototype.campaigns_delete = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/delete', [
		'cid',
	], params, callback);
};

/**
 * Get the list of campaigns and their details matching the specified filters.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/list.php
 */
MailChimpAPI_v2_0.prototype.campaigns_list = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/list', [
		'filters',
		'start',
		'limit',
		'sort_field',
		'sort_dir',
	], params, callback);
};

/**
 * Pause an AutoResponder or RSS campaign from sending.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/pause.php
 */
MailChimpAPI_v2_0.prototype.campaigns_pause = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/pause', [
		'cid',
	], params, callback);
};

/**
 * Replicate a campaign.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/replicate.php
 */
MailChimpAPI_v2_0.prototype.campaigns_replicate = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/replicate', [
		'cid',
	], params, callback);
};

/**
 * Resume sending an AutoResponder or RSS campaign.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/resume.php
 */
MailChimpAPI_v2_0.prototype.campaigns_resume = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/resume', [
		'cid',
	], params, callback);
};

/**
 * Schedule a campaign to be sent in batches sometime in the future. Only valid
 * for "regular" campaigns.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/schedule-batch.php
 */
MailChimpAPI_v2_0.prototype.campaigns_schedule_batch = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/schedule-batch', [
		'cid',
		'schedule_time',
		'num_batches',
		'stagger_mins',
	], params, callback);
};

/**
 * Schedule a campaign to be sent in the future.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/schedule.php
 */
MailChimpAPI_v2_0.prototype.campaigns_schedule = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/schedule', [
		'cid',
		'schedule_time',
		'schedule_time_b',
	], params, callback);
};

/**
 * Allows one to test their segmentation rules before creating a campaign using
 * them.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/segment-test.php
 */
MailChimpAPI_v2_0.prototype.campaigns_segment_test = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/segment-test', [
		'list_id',
		'options',
	], params, callback);
};

/**
 * Send a given campaign immediately. For RSS campaigns, this will "start"
 * them.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/send.php
 */
MailChimpAPI_v2_0.prototype.campaigns_send = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/send', [
		'cid',
	], params, callback);
};

/**
 * Send a test of this campaign to the provided email addresses.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/send-test.php
 */
MailChimpAPI_v2_0.prototype.campaigns_send_test = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/send-test', [
		'cid',
		'test_emails',
		'send_type',
	], params, callback);
};

/**
 * Get the HTML template content sections for a campaign. Note that this will
 * return very jagged, non-standard results based on the template a campaign is
 * using. You only want to use this if you want to allow editing template
 * sections in your application.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/template-content.php
 */
MailChimpAPI_v2_0.prototype.campaigns_template_content = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/template-content', [
		'cid',
	], params, callback);
};

/**
 * Unschedule a campaign that is scheduled to be sent in the future.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/unschedule.php
 */
MailChimpAPI_v2_0.prototype.campaigns_unschedule = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/unschedule', [
		'cid',
	], params, callback);
};

/**
 * Update just about any setting besides type for a campaign that has not been
 * sent. See campaignCreate() for details. Caveats!:
 *
 *  - If you set a new list_id, all segmentation options will be deleted and
 *    must be re-added.
 *  - If you set template_id, you need to follow that up by setting it's
 *    'content'
 *  - If you set segment_opts, you should have tested your options against
 *    campaignSegmentTest() as campaignUpdate() will not allow you to set a
 *    segment that includes no members.
 *  - To clear/unset segment_opts, pass an empty string or array as the value.
 *    Various wrappers may require one or the other.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/campaigns/update.php
 */
MailChimpAPI_v2_0.prototype.campaigns_update = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('campaigns/update', [
		'cid',
		'name',
		'value',
	], params, callback);
};

/*****************************************************************************/
/*************************** Ecomm Related Methods ***************************/
/*****************************************************************************/

/**
 * Import Ecommerce Order Information to be used for Segmentation. This will
 * generally be used by ecommerce package plugins provided by us or by 3rd
 * part system developers.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/ecomm/order-add.php
 */
MailChimpAPI_v2_0.prototype.ecomm_order_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('ecomm/order-add', [
		'order',
	], params, callback);
};

/**
 * Delete Ecommerce Order Information used for segmentation. This will
 * generally be used by ecommerce package plugins that we provide or by 3rd
 * part system developers.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/ecomm/order-del.php
 */
MailChimpAPI_v2_0.prototype.ecomm_order_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('ecomm/order-del', [
		'store_id',
		'order_id',
	], params, callback);
};

/**
 * Retrieve the Ecommerce Orders for an account.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/ecomm/orders.php
 */
MailChimpAPI_v2_0.prototype.ecomm_orders = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('ecomm/orders', [
		'cid',
		'start',
		'limit',
		'since',
	], params, callback);
};

/*****************************************************************************/
/************************** Folder Related Methods ***************************/
/*****************************************************************************/

/**
 * Add a new folder to file campaigns, autoresponders, or templates in.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/folders/add.php
 */
MailChimpAPI_v2_0.prototype.folders_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('folders/add', [
		'name',
		'type',
	], params, callback);
};

/**
 * Delete a campaign, autoresponder, or template folder. Note that this will
 * simply make whatever was in the folder appear unfiled, no other data is
 * removed.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/folders/del.php
 */
MailChimpAPI_v2_0.prototype.folders_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('folders/del', [
		'fid',
		'type',
	], params, callback);
};

/**
 * List all the folders of a certain type.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/folders/list.php
 */
MailChimpAPI_v2_0.prototype.folders_list = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('folders/list', [
		'type',
	], params, callback);
};

/**
 * Update the name of a folder for campaigns, autoresponders, or templates.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/folders/update.php
 */
MailChimpAPI_v2_0.prototype.folders_update = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('folders/update', [
		'fid',
		'name',
		'type',
	], params, callback);
};

/*****************************************************************************/
/*************************** Lists Related Methods ***************************/
/*****************************************************************************/

/**
 * Get all email addresses that complained about a campaign sent to a list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/abuse-reports.php
 */
MailChimpAPI_v2_0.prototype.lists_abuse_reports = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/abuse-reports', [
		'id',
		'start',
		'limit',
		'since',
	], params, callback);
};

/**
 * Access up to the previous 180 days of daily detailed aggregated activity
 * stats for a given list. Does not include AutoResponder activity.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/activity.php
 */
MailChimpAPI_v2_0.prototype.lists_activity = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/activity', [
		'id',
	], params, callback);
};

/**
 * Subscribe a batch of email addresses to a list at once. If you are using a
 * serialized version of the API, we strongly suggest that you only run this
 * method as a POST request, and not a GET request. Maximum batch sizes vary
 * based on the amount of data in each record, though you should cap them at
 * 5k - 10k records, depending on your experience. These calls are also long,
 * so be sure you increase your timeout values.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/batch-subscribe.php
 */
MailChimpAPI_v2_0.prototype.lists_batch_subscribe = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/batch-subscribe', [
		'id',
		'batch',
		'double_optin',
		'update_existing',
		'replace_interests',
	], params, callback);
};

/**
 * Unsubscribe a batch of email addresses from a list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/batch-unsubscribe.php
 */
MailChimpAPI_v2_0.prototype.lists_batch_unsubscribe = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/batch-unsubscribe', [
		'id',
		'batch',
		'delete_member',
		'send_goodbye',
		'send_notify',
	], params, callback);
};

/**
 * Retrieve the clients that the list's subscribers have been tagged as being
 * used based on user agents seen. Made possible by user-agent-string.info.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/clients.php
 */
MailChimpAPI_v2_0.prototype.lists_clients = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/clients', [
		'id',
	], params, callback);
};

/**
 * Access the Growth History by Month for a given list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/growth-history.php
 */
MailChimpAPI_v2_0.prototype.lists_growth_history = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/growth-history', [
		'id',
	], params, callback);
};

/**
 * Add a single Interest Group - if interest groups for the List are not yet
 * enabled, adding the first group will automatically turn them on.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/interest-group-add.php
 */
MailChimpAPI_v2_0.prototype.lists_interest_group_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/interest-group-add', [
		'id',
		'group_name',
		'grouping_id',
	], params, callback);
};

/**
 * Delete a single Interest Group - if the last group for a list is deleted,
 * this will also turn groups for the list off.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/interest-group-del.php
 */
MailChimpAPI_v2_0.prototype.lists_interest_group_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/interest-group-del', [
		'id',
		'group_name',
		'grouping_id',
	], params, callback);
};

/**
 * Change the name of an Interest Group.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/interest-group-update.php
 */
MailChimpAPI_v2_0.prototype.lists_interest_group_update = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/interest-group-update', [
		'id',
		'old_name',
		'new_name',
		'grouping_id',
	], params, callback);
};

/**
 * Add a new Interest Grouping - if interest groups for the List are not yet
 * enabled, adding the first grouping will automatically turn them on.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/interest-grouping-add.php
 */
MailChimpAPI_v2_0.prototype.lists_interest_grouping_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/interest-grouping-add', [
		'id',
		'name',
		'type',
		'groups',
	], params, callback);
};

/**
 * Delete an existing Interest Grouping - this will permanently delete all
 * contained interest groups and will remove those selections from all list
 * members.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/interest-grouping-del.php
 */
MailChimpAPI_v2_0.prototype.lists_interest_grouping_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/interest-grouping-del', [
		'grouping_id',
	], params, callback);
};

/**
 * Update an existing Interest Grouping.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/interest-grouping-update.php
 */
MailChimpAPI_v2_0.prototype.lists_interest_grouping_update = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/interest-grouping-update', [
		'grouping_id',
		'name',
		'value',
	], params, callback);
};

/**
 * Get the list of interest groupings for a given list, including the label,
 * form information, and included groups for each.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/interest-groupings.php
 */
MailChimpAPI_v2_0.prototype.lists_interest_groupings = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/interest-groupings', [
		'id',
		'counts',
	], params, callback);
};

/**
 * Retrieve all of the lists defined for your user account.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/list.php
 */
MailChimpAPI_v2_0.prototype.lists_list = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/list', [
		'filters',
		'start',
		'limit',
		'sort_field',
		'sort_dir',
	], params, callback);
};

/**
 * Retrieve the locations (countries) that the list's subscribers have been
 * tagged to based on geocoding their IP address.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/locations.php
 */
MailChimpAPI_v2_0.prototype.lists_locations = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/locations', [
		'id',
	], params, callback);
};

/**
 * Get the most recent 100 activities for particular list members (open, click,
 * bounce, unsub, abuse, sent to, etc.)
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/member-activity.php
 */
MailChimpAPI_v2_0.prototype.lists_member_activity = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/member-activity', [
		'id',
		'emails',
	], params, callback);
};

/**
 * Get all the information for particular members of a list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/member-info.php
 */
MailChimpAPI_v2_0.prototype.lists_member_info = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/member-info', [
		'id',
		'emails',
	], params, callback);
};

/**
 * Get all of the list members for a list that are of a particular status and
 * potentially matching a segment. This will cause locking, so don't run
 * multiples at once. Are you trying to get a dump including lots of merge data
 * or specific members of a list? If so, checkout the List Export API.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/members.php
 */
MailChimpAPI_v2_0.prototype.lists_members = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/members', [
		'id',
		'status',
		'opts',
	], params, callback);
};

/**
 * Add a new merge tag to a given list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/merge-var-add.php
 */
MailChimpAPI_v2_0.prototype.lists_merge_var_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/merge-var-add', [
		'id',
		'tag',
		'name',
		'options',
	], params, callback);
};

/**
 * Delete a merge tag from a given list and all its members. Seriously - the
 * data is removed from all members as well! Note that on large lists this
 * method may seem a bit slower than calls you typically make.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/merge-var-del.php
 */
MailChimpAPI_v2_0.prototype.lists_merge_var_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/merge-var-del', [
		'id',
		'tag',
	], params, callback);
};

/**
 * Completely resets all data stored in a merge var on a list. All data is
 * removed and this action can not be undone.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/merge-var-reset.php
 */
MailChimpAPI_v2_0.prototype.lists_merge_var_reset = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/merge-var-reset', [
		'id',
		'tag',
	], params, callback);
};

/**
 * Sets a particular merge var to the specified value for every list member.
 * Only merge var ids 1 - 30 may be modified this way. This is generally a
 * dirty method unless you're fixing data since you should probably be using
 * default_values and/or conditional content. as with lists/merge-var-reset(),
 * this can not be undone.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/merge-var-set.php
 */
MailChimpAPI_v2_0.prototype.lists_merge_var_set = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/merge-var-set', [
		'id',
		'tag',
		'value',
	], params, callback);
};

/**
 * Update most parameters for a merge tag on a given list. You cannot currently
 * change the merge type.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/merge-var-update.php
 */
MailChimpAPI_v2_0.prototype.lists_merge_var_update = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/merge-var-update', [
		'id',
		'tag',
		'options',
	], params, callback);
};

/**
 * Get the list of merge tags for a given list, including their name, tag, and
 * required setting.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/merge-vars.php
 */
MailChimpAPI_v2_0.prototype.lists_merge_vars = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/merge-vars', [
		'id',
	], params, callback);
};

/**
 * Save a segment against a list for later use. There is no limit to the number
 * of segments which can be saved. Static Segments are not tied to any merge data,
 * interest groups, etc. They essentially allow you to configure an unlimited
 * number of custom segments which will have standard performance. When using
 * proper segments, Static Segments are one of the available options for
 * segmentation just as if you used a merge var (and they can be used with other
 * segmentation options), though performance may degrade at that point. Saved
 * Segments (called "auto-updating" in the app) are essentially just the
 * match+conditions typically used.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/static-segment-add.php
 */
MailChimpAPI_v2_0.prototype.lists_segment_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/segment-add', [
		'id',
		'opts',
	], params, callback);
};

/**
 * Save a segment against a list for later use. There is no limit to the number
 * of segments which can be saved. Static Segments are not tied to any merge
 * data, interest groups, etc. They essentially allow you to configure an
 * unlimited number of custom segments which will have standard performance.
 * When using proper segments, Static Segments are one of the available options
 * for segmentation just as if you used a merge var (and they can be used with
 * other segmentation options), though performance may degrade at that point.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/static-segment-add.php
 */
MailChimpAPI_v2_0.prototype.lists_static_segment_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/static-segment-add', [
		'id',
		'name',
	], params, callback);
};

/**
 * Delete a static segment. Note that this will, of course, remove any member
 * affiliations with the segment.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/static-segment-del.php
 */
MailChimpAPI_v2_0.prototype.lists_static_segment_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/static-segment-del', [
		'id',
		'seg_id',
	], params, callback);
};

/**
 * Add list members to a static segment. It is suggested that you limit batch
 * size to no more than 10,000 addresses per call. Email addresses must exist
 * on the list in order to be included - this will not subscribe them to the
 * list!
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/static-segment-members-add.php
 */
MailChimpAPI_v2_0.prototype.lists_static_segment_members_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/static-segment-members-add', [
		'id',
		'seg_id',
		'batch',
	], params, callback);
};

/**
 * Remove list members from a static segment. It is suggested that you limit
 * batch size to no more than 10,000 addresses per call. Email addresses must
 * exist on the list in order to be removed - this will not unsubscribe them
 * from the list!
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/static-segment-members-del.php
 */
MailChimpAPI_v2_0.prototype.lists_static_segment_members_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/static-segment-members-del', [
		'id',
		'seg_id',
		'batch',
	], params, callback);
};

/**
 * Resets a static segment - removes all members from the static segment. Note:
 * does not actually affect list member data.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/static-segment-reset.php
 */
MailChimpAPI_v2_0.prototype.lists_static_segment_reset = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/static-segment-reset', [
		'id',
		'seg_id',
	], params, callback);
};

/**
 * Retrieve all of the Static Segments for a list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/static-segments.php
 */
MailChimpAPI_v2_0.prototype.lists_static_segments = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/static-segments', [
		'id',
	], params, callback);
};

/**
 * Retrieve all of the Segments for a list.
 * For accessing the saved/static results you will find:
 *     data.saved[]
 *     data.static[]
 * Also supports type parameter for "static" or "saved"
 * @see http://apidocs.mailchimp.com/api/2.0/lists/segments.php
 */
MailChimpAPI_v2_0.prototype.lists_segments = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/segments', [
		'id',
		'type',
	], params, callback);
};

/**
 * Subscribe the provided email to a list. By default this sends a confirmation
 * email - you will not see new members until the link contained in it is
 * clicked!
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/subscribe.php
 */
MailChimpAPI_v2_0.prototype.lists_subscribe = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/subscribe', [
		'id',
		'email',
		'merge_vars',
		'email_type',
		'double_optin',
		'update_existing',
		'replace_interests',
		'send_welcome',
	], params, callback);
};

/**
 * Unsubscribe the given email address from the list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/unsubscribe.php
 */
MailChimpAPI_v2_0.prototype.lists_unsubscribe = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/unsubscribe', [
		'id',
		'email',
		'delete_member',
		'send_goodbye',
		'send_notify',
	], params, callback);
};

/**
 * Edit the email address, merge fields, and interest groups for a list member.
 * If you are doing a batch update on lots of users, consider using
 * listBatchSubscribe() with the update_existing and possible replace_interests
 * parameter.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/update-member.php
 */
MailChimpAPI_v2_0.prototype.lists_update_member = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/update-member', [
		'id',
		'email',
		'merge_vars',
		'email_type',
		'replace_interests',
	], params, callback);
};

/**
 * Add a new Webhook URL for the given list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/webhook-add.php
 */
MailChimpAPI_v2_0.prototype.lists_webhook_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/webhook-add', [
		'id',
		'url',
		'actions',
		'sources',
	], params, callback);
};

/**
 * Delete an existing Webhook URL from a given list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/webhook-del.php
 */
MailChimpAPI_v2_0.prototype.lists_webhook_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/webhook-del', [
		'id',
		'url',
	], params, callback);
};

/**
 * Return the Webhooks configured for the given list.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/lists/webhooks.php
 */
MailChimpAPI_v2_0.prototype.lists_webhooks = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('lists/webhooks', [
		'id',
	], params, callback);
};

/*****************************************************************************/
/************************** Helper Related Methods ***************************/
/*****************************************************************************/

/**
 * Retrieve lots of account information including payments made, plan info,
 * some account stats, installed modules, contact info, and more. No private
 * information like Credit Card numbers is available.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/account-details.php
 */
MailChimpAPI_v2_0.prototype.helper_account_details = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/account-details', [
		'id',
		'exclude',
	], params, callback);
};

/**
 * Retrieve minimal data for all Campaigns a member was sent.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/campaigns-for-email.php
 */
MailChimpAPI_v2_0.prototype.helper_campaigns_for_email = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/campaigns-for-email', [
		'email',
		'options',
	], params, callback);
};

/**
 * Return the current Chimp Chatter messages for an account.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/chimp-chatter.php
 */
MailChimpAPI_v2_0.prototype.helper_chimp_chatter = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/chimp-chatter', [
	], params, callback);
};

/**
 * Have HTML content auto-converted to a text-only format. You can send: plain
 * HTML, an existing Campaign Id, or an existing Template Id. Note that this
 * will not save anything to or update any of your lists, campaigns, or
 * templates. It's also not just Lynx and is very fine tuned for our template
 * layouts - your mileage may vary.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/generate-text.php
 */
MailChimpAPI_v2_0.prototype.helper_generate_text = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/generate-text', [
		'type',
		'content',
	], params, callback);
};

/**
 * Send your HTML content to have the CSS inlined and optionally remove the
 * original styles.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/inline-css.php
 */
MailChimpAPI_v2_0.prototype.helper_inline_css = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/inline-css', [
		'html',
		'strip_css',
	], params, callback);
};

/**
 * Retrieve minimal List data for all lists a member is subscribed to.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/lists-for-email.php
 */
MailChimpAPI_v2_0.prototype.helper_lists_for_email = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/lists-for-email', [
		'email',
	], params, callback);
};

/**
 * "Ping" the MailChimp API - a simple method you can call that will return a
 * constant value as long as everything is good. Note than unlike most all of
 * our methods, we don't throw an Exception if we are having issues. You will
 * simply receive a different string back that will explain our view on what is
 * going on.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/ping.php
 */
MailChimpAPI_v2_0.prototype.helper_ping = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/ping', [
	], params, callback);
};

/**
 * Search all campaigns for the specified query terms
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/search-campaigns.php
 */
MailChimpAPI_v2_0.prototype.helper_search_campaigns = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/search-campaigns', [
		'query',
		'offset',
		'snip_start',
		'snip_end',
	], params, callback);
};

/**
 * Search account wide or on a specific list using the specified query terms.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/search-members.php
 */
MailChimpAPI_v2_0.prototype.helper_search_members = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/search-members', [
		'query',
		'id',
		'offset',
	], params, callback);
};

/**
 * Retrieve all domain verification records for an account.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/helper/verified-domains.php
 */
MailChimpAPI_v2_0.prototype.helper_verified_domains = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('helper/verified-domains', [
	], params, callback);
};

/*****************************************************************************/
/************************** Reports Related Methods **************************/
/*****************************************************************************/

/**
 * Get all email addresses that complained about a given campaign.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/abuse.php
 */
MailChimpAPI_v2_0.prototype.reports_abuse = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/abuse', [
		'cid',
		'opts',
	], params, callback);
};

/**
 * Retrieve the text presented in our app for how a campaign performed and any
 * advice we may have for you - best suited for display in customized reports
 * pages. Note: some messages will contain HTML - clean tags as necessary.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/advice.php
 */
MailChimpAPI_v2_0.prototype.reports_advice = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/advice', [
		'cid',
	], params, callback);
};

/**
 * Retrieve the most recent full bounce message for a specific email address on
 * the given campaign. Messages over 30 days old are subject to being removed.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/bounce-message.php
 */
MailChimpAPI_v2_0.prototype.reports_bounce_message = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/bounce-message', [
		'cid',
		'email',
	], params, callback);
};

/**
 * Retrieve the full bounce messages for the given campaign. Note that this can
 * return very large amounts of data depending on how large the campaign was
 * and how much cruft the bounce provider returned. Also, messages over 30 days
 * old are subject to being removed.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/bounce-messages.php
 */
MailChimpAPI_v2_0.prototype.reports_bounce_messages = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/bounce-messages', [
		'cid',
		'opts',
	], params, callback);
};

/**
 * Return the list of email addresses that clicked on a given url, and how many
 * times they clicked.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/click-detail.php
 */
MailChimpAPI_v2_0.prototype.reports_click_detail = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/click-detail', [
		'cid',
		'tid',
		'opts',
	], params, callback);
};

/**
 * The urls tracked and their click counts for a given campaign.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/clicks.php
 */
MailChimpAPI_v2_0.prototype.reports_clicks = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/clicks', [
		'cid',
	], params, callback);
};

/**
 * Get the top 5 performing email domains for this campaign. Users wanting more
 * than 5 should use campaign campaignEmailStatsAIM() or
 * campaignEmailStatsAIMAll() and generate any additional stats they require.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/domain-performance.php
 */
MailChimpAPI_v2_0.prototype.reports_domain_performance = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/domain-performance', [
		'cid',
	], params, callback);
};

/**
 * Retrieve the Ecommerce Orders tracked by campaignEcommOrderAdd()-
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/ecomm-orders.php
 */
MailChimpAPI_v2_0.prototype.reports_ecomm_orders = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/ecomm-orders', [
		'cid',
		'opts',
	], params, callback);
};

/**
 * Retrieve the eepurl stats from the web/Twitter mentions for this campaign.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/eepurl.php
 */
MailChimpAPI_v2_0.prototype.reports_eepurl = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/eepurl', [
		'cid',
	], params, callback);
};

/**
 * Retrieve the countries/regions and number of opens tracked for each. Email
 * address are not returned.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/geo-opens.php
 */
MailChimpAPI_v2_0.prototype.reports_geo_opens = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/geo-opens', [
		'cid',
	], params, callback);
};

/**
 * Retrieve the Google Analytics data we've collected for this campaign. Note,
 * requires Google Analytics Add-on to be installed and configured.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/google-analytics.php
 */
MailChimpAPI_v2_0.prototype.reports_google_analytics = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/google-analytics', [
		'cid',
	], params, callback);
};

/**
 * Given a campaign and email address, return the entire click and open history
 * with timestamps, ordered by time. If you need to dump the full activity for
 * a campaign and/or get incremental results, you should use the
 * campaignSubscriberActivity Export API method, not this, especially for large
 * campaigns.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/member-activity.php
 */
MailChimpAPI_v2_0.prototype.reports_member_activity = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/member-activity', [
		'cid',
		'emails',
	], params, callback);
};

/**
 * Retrieve the list of email addresses that did not open a given campaign.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/not-opened.php
 */
MailChimpAPI_v2_0.prototype.reports_not_opened = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/not-opened', [
		'cid',
		'opts',
	], params, callback);
};

/**
 * Retrieve the list of email addresses that opened a given campaign with how
 * many times they opened.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/opened.php
 */
MailChimpAPI_v2_0.prototype.reports_opened = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/opened', [
		'cid',
		'opts',
	], params, callback);
};

/**
 * Get email addresses the campaign was sent to.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/sent-to.php
 */
MailChimpAPI_v2_0.prototype.reports_sent_to = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/sent-to', [
		'cid',
		'opts',
	], params, callback);
};

/**
 * Get the URL to a customized VIP Report for the specified campaign and
 * optionally send an email to someone with links to it. Note subsequent calls
 * will overwrite anything already set for the same campign (eg, the password).
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/share.php
 */
MailChimpAPI_v2_0.prototype.reports_share = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/share', [
		'cid',
		'opts',
	], params, callback);
};

/**
 * Retrieve relevant aggregate campaign statistics (opens, bounces, clicks,
 * etc.).
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/summary.php
 */
MailChimpAPI_v2_0.prototype.reports_summary = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/summary', [
		'cid',
	], params, callback);
};

/**
 * Get all unsubscribed email addresses for a given campaign.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/reports/unsubscribes.php
 */
MailChimpAPI_v2_0.prototype.reports_unsubscribes = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('reports/unsubscribes', [
		'cid',
		'opts',
	], params, callback);
};

/*****************************************************************************/
/************************* Templates Related Methods *************************/
/*****************************************************************************/

/**
 * Create a new user template, NOT campaign content. These templates can then
 * be applied while creating campaigns.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/templates/add.php
 */
MailChimpAPI_v2_0.prototype.templates_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('templates/add', [
		'name',
		'html',
		'folder_id',
	], params, callback);
};

/**
 * Delete (deactivate) a user template.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/templates/del.php
 */
MailChimpAPI_v2_0.prototype.templates_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('templates/del', [
		'template_id',
	], params, callback);
};

/**
 * Pull details for a specific template to help support editing.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/templates/info.php
 */
MailChimpAPI_v2_0.prototype.templates_info = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('templates/info', [
		'template_id',
		'type',
	], params, callback);
};

/**
 * Retrieve various templates available in the system, allowing some thing
 * similar to our template gallery to be created.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/templates/list.php
 */
MailChimpAPI_v2_0.prototype.templates_list = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('templates/list', [
		'types',
		'filters',
	], params, callback);
};

/**
 * Undelete (reactivate) a user template.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/templates/undel.php
 */
MailChimpAPI_v2_0.prototype.templates_undel = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('templates/undel', [
		'template_id',
	], params, callback);
};

/**
 * Replace the content of a user template, NOT campaign content.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/templates/update.php
 */
MailChimpAPI_v2_0.prototype.templates_update = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('templates/update', [
		'template_id',
		'values',
	], params, callback);
};

/*****************************************************************************/
/*************************** Users Related Methods ***************************/
/*****************************************************************************/

/**
 * Invite a user to your account.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/users/invite.php
 */
MailChimpAPI_v2_0.prototype.users_invite = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('users/invite', [
		'email',
		'role',
		'msg',
	], params, callback);
};

/**
 * Resend an invite a user to your account. Note, if the same address has been
 * invited multiple times, this will simpy re-send the most recent invite.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/users/invite-resend.php
 */
MailChimpAPI_v2_0.prototype.users_invite_resend = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('users/invite-resend', [
		'email',
	], params, callback);
};

/**
 * Revoke an invitation sent to a user to your account. Note, if the same
 * address has been invited multiple times, this will simpy revoke the most
 * recent invite.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/users/invite-revoke.php
 */
MailChimpAPI_v2_0.prototype.users_invite_revoke = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('users/invite-revoke', [
		'email',
	], params, callback);
};

/**
 * Retrieve the list of pending users invitations have been sent for.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/users/invites.php
 */
MailChimpAPI_v2_0.prototype.users_invites = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('users/invites', [
	], params, callback);
};

/**
 * Revoke access for a specified login.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/users/login-revoke.php
 */
MailChimpAPI_v2_0.prototype.users_login_revoke = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('users/login-revoke', [
		'username',
	], params, callback);
};

/**
 * Retrieve the list of active logins.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/users/logins.php
 */
MailChimpAPI_v2_0.prototype.users_logins = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('users/logins', [
	], params, callback);
};

/*****************************************************************************/
/**************************** Vip Related Methods ****************************/
/*****************************************************************************/

/**
 * Retrieve all Activity (opens/clicks) for VIPs over the past 10 days.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/vip/activity.php
 */
MailChimpAPI_v2_0.prototype.vip_activity = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('vip/activity', [
	], params, callback);
};

/**
 * Add VIPs (previously called Golden Monkeys).
 *
 * @see http://apidocs.mailchimp.com/api/2.0/vip/add.php
 */
MailChimpAPI_v2_0.prototype.vip_add = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('vip/add', [
		'id',
		'emails',
	], params, callback);
};

/**
 * Remove VIPs - this does not affect list membership.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/vip/del.php
 */
MailChimpAPI_v2_0.prototype.vip_del = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('vip/del', [
		'id',
		'emails',
	], params, callback);
};

/**
 * Retrieve all Golden Monkey(s) for an account.
 *
 * @see http://apidocs.mailchimp.com/api/2.0/vip/members.php
 */
MailChimpAPI_v2_0.prototype.vip_members = function (params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = {};
	}

	this.execute('vip/members', [
	], params, callback);
};
