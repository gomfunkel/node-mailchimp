var http = require('http'),
    request = require('request'),
    helpers = require('./helpers');

/**
 * Mandrill API wrapper for the API version 1.0. This object should not be
 * instantiated directly but by using the version wrapper {@link MandrillAPI}.
 *
 * @param apiKey The API key to access the Mandrill API with
 * @param options Configuration options
 * @return Instance of {@link MandrillAPI_v1_0}
 */
function MandrillAPI_v1_0 (apiKey, options) {

	if (!options)
		var options = {};

	this.version     = '1.0';
	this.apiKey      = apiKey;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.httpHost    = 'mandrillapp.com';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80';
	this.userAgent   = options.userAgent+' ' || '';

}

module.exports = MandrillAPI_v1_0;

/**
 * Sends a given request as a HTTP POST (application/x-www-form-urlencoded) to
 * the Mandrill API and finally calls the given callback function with the
 * resulting JSON object. This method should not be called directly but will be
 * used internally by all API methods defined.
 *
 * @param method Mandrill API method to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the Mandrill API with
 * @param callback Callback function to call on success
 */
MandrillAPI_v1_0.prototype.execute = function (method, availableParams, givenParams, callback) {

    var finalParams = { key : this.apiKey };
    var currentParam;

	for (var i = 0; i < availableParams.length; i++) {
		currentParam = availableParams[i];
		if (typeof givenParams[currentParam] !== 'undefined')
			finalParams[currentParam] = givenParams[currentParam];
	}

	request({
		uri : this.httpUri+'/api/'+this.version+'/'+method,
		method: 'POST',
		headers : {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'User-Agent' : this.userAgent+'node-mailchimp/'+this.packageInfo['version']
                  },
        body : JSON.stringify(finalParams)
	}, function (error, response, body) {
		var parsedResponse;
		if (error) {
			callback(new Error('Unable to connect to the Mandrill API endpoint.'));
		} else {

			try {
				parsedResponse = JSON.parse(body);
			} catch (error) {
				callback(new Error('Error parsing JSON answer from Mandrill API.'));
				return;
			}

			if (typeof parsedResponse.status != 'undefined' && parsedResponse.status === 'error') {
				callback(new Error(parsedResponse.message));
				return;
			}

			callback(null, parsedResponse);

		}
	});

}

/**
 * You can either call the API methods directly or using this function which
 * assembles the name of the API method from a given method category and
 * method name. Categories and methods are described in the Mandrill API
 * Documentation.
 *
 * @see http://mandrillapp.com/api/docs/
 *
 * @param category The category of the API method to call (e.g. 'users')
 * @param method The method to call in the given category
 * @param params Parameters to pass to the API method
 * @param callback Callback function for returned data or errors
 */

MandrillAPI_v1_0.prototype.call = function (category, method, params, callback) {

	if (typeof params == 'function') callback = params, params = {};

	if (typeof category != 'string' || typeof method != 'string') {
		callback(new Error('You have to provide the category and the name of the method to call.'));
		return;
	}

	var methodToCall = category+'_'+method.replace(/\-/g, '_');

	if (typeof this[methodToCall] == 'function') {
		this[methodToCall](params, callback);
	} else {
		callback(new Error('The API method '+methodToCall+' does not exist.'));
		return;
	}

}

/*****************************************************************************/
/******************************** Users Calls ********************************/
/*****************************************************************************/

/**
 * Return the information about the API-connected user.
 *
 * @see https://mandrillapp.com/api/docs/users.html#method=info
 */
MandrillAPI_v1_0.prototype.users_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('users/info', [
	], params, callback);
}

/**
 * Validate an API key and respond to a ping.
 *
 * @see https://mandrillapp.com/api/docs/users.html#method=ping
 */
MandrillAPI_v1_0.prototype.users_ping = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('users/ping', [
	], params, callback);
}

/**
 * Validate an API key and respond to a ping (anal JSON parser version).
 *
 * @see https://mandrillapp.com/api/docs/users.html#method=ping2
 */
MandrillAPI_v1_0.prototype.users_ping2 = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('users/ping2', [
	], params, callback);
}

/**
 * Return the senders that have tried to use this account, both verified and
 * unverified.
 *
 * @see https://mandrillapp.com/api/docs/users.html#method=senders
 */
MandrillAPI_v1_0.prototype.users_senders = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('users/senders', [
	], params, callback);
}

/*****************************************************************************/
/****************************** Messages Calls *******************************/
/*****************************************************************************/

/**
 * Send a new transactional message through Mandrill.
 *
 * @see https://mandrillapp.com/api/docs/messages.html#method=send
 */
MandrillAPI_v1_0.prototype.messages_send = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('messages/send', [
		'message',
		'async',
	], params, callback);
}

/**
 * Send a new transactional message through Mandrill using a template.
 *
 * @see https://mandrillapp.com/api/docs/messages.html#method=send-template
 */
MandrillAPI_v1_0.prototype.messages_send_template = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('messages/send-template', [
		'template_name',
		'template_content',
		'message',
		'async',
	], params, callback);
}

/**
 * Search the content of recently sent messages and optionally narrow by date
 * range, tags and senders.
 *
 * @see https://mandrillapp.com/api/docs/messages.html#method=search
 */
MandrillAPI_v1_0.prototype.messages_search = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('messages/search', [
		'query',
		'date_from',
		'date_to',
		'tags',
		'senders',
		'limit',
	], params, callback);
}

/**
 * Parse the full MIME document for an email message, returning the content of
 * the message broken into its constituent pieces.
 *
 * @see https://mandrillapp.com/api/docs/messages.html#method=parse
 */
MandrillAPI_v1_0.prototype.messages_parse = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('messages/parse', [
		'raw_message',
	], params, callback);
}

/**
 * Take a raw MIME document for a message, and send it exactly as if it were
 * sent over the SMTP protocol.
 *
 * @see https://mandrillapp.com/api/docs/messages.html#method=send-raw
 */
MandrillAPI_v1_0.prototype.messages_send_raw = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('messages/send-raw', [
		'raw_message',
		'from_email',
		'from_name',
		'to',
		'async',
	], params, callback);
}

/*****************************************************************************/
/******************************** Tags Calls *********************************/
/*****************************************************************************/

/**
 * Return all of the user-defined tag information.
 *
 * @see https://mandrillapp.com/api/docs/tags.html#method=list
 */
MandrillAPI_v1_0.prototype.tags_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('tags/list', [
	], params, callback);
}

/**
 * Deletes a tag permanently. Deleting a tag removes the tag from any messages
 * that have been sent, and also deletes the tag's stats. There is no way to
 * undo this operation, so use it carefully.
 *
 * @see https://mandrillapp.com/api/docs/tags.html#method=delete
 */
MandrillAPI_v1_0.prototype.tags_delete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('tags/delete', [
		'tag',
	], params, callback);
}

/**
 * Return more detailed information about a single tag, including aggregates of
 * recent stats.
 *
 * @see https://mandrillapp.com/api/docs/tags.html#method=info
 */
MandrillAPI_v1_0.prototype.tags_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('tags/info', [
		'tag',
	], params, callback);
}

/**
 * Return the recent history (hourly stats for the last 30 days) for a tag.
 *
 * @see https://mandrillapp.com/api/docs/tags.html#method=time-series
 */
MandrillAPI_v1_0.prototype.tags_time_series = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('tags/time-series', [
		'tag',
	], params, callback);
}

/**
 * Return the recent history (hourly stats for the last 30 days) for all tags.
 *
 * @see https://mandrillapp.com/api/docs/tags.html#method=all-time-series
 */
MandrillAPI_v1_0.prototype.tags_all_time_series = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('tags/all-time-series', [
	], params, callback);
}

/*****************************************************************************/
/******************************* Rejects Calls *******************************/
/*****************************************************************************/

/**
 * Adds an email to your email rejection blacklist. Addresses that you add
 * manually will never expire and there is no reputation penalty for removing
 * them from your blacklist. Attempting to blacklist an address that has been
 * whitelisted will have no effect.
 *
 * @see https://mandrillapp.com/api/docs/rejects.html#method=add
 */
MandrillAPI_v1_0.prototype.rejects_add = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('rejects/add', [
		'email',
	], params, callback);
}

/**
 * Retrieves your email rejection blacklist. You can provide an email address
 * to limit the results. Returns up to 1000 results. By default, entries that
 * have expired are excluded from the results; set include_expired to true to
 * include them.
 *
 * @see https://mandrillapp.com/api/docs/rejects.html#method=list
 */
MandrillAPI_v1_0.prototype.rejects_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('rejects/list', [
		'email',
		'include_expired',
	], params, callback);
}

/**
 * Deletes an email rejection. There is no limit to how many rejections you can
 * remove from your blacklist, but keep in mind that each deletion has an
 * affect on your reputation.
 *
 * @see https://mandrillapp.com/api/docs/rejects.html#method=delete
 */
MandrillAPI_v1_0.prototype.rejects_delete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('rejects/delete', [
		'email',
	], params, callback);
}

/*****************************************************************************/
/***************************** Whitelists Calls ******************************/
/*****************************************************************************/

/**
 * Adds an email to your email rejection whitelist. If the address is currently
 * on your blacklist, that blacklist entry will be removed automatically.
 *
 * @see https://mandrillapp.com/api/docs/whitelists.html#method=add
 */
MandrillAPI_v1_0.prototype.whitelists_add = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('whitelists/add', [
		'email',
	], params, callback);
}

/**
 * Retrieves your email rejection whitelist. You can provide an email address
 * or search prefix to limit the results. Returns up to 1000 results.
 *
 * @see https://mandrillapp.com/api/docs/whitelists.html#method=list
 */
MandrillAPI_v1_0.prototype.whitelists_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('whitelists/list', [
		'email',
	], params, callback);
}

/**
 * Removes an email address from the whitelist.
 *
 * @see https://mandrillapp.com/api/docs/whitelists.html#method=delete
 */
MandrillAPI_v1_0.prototype.whitelists_delete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('whitelists/delete', [
		'email',
	], params, callback);
}

/*****************************************************************************/
/******************************* Senders Calls *******************************/
/*****************************************************************************/

/**
 * Return the senders that have tried to use this account.
 *
 * @see https://mandrillapp.com/api/docs/senders.html#method=list
 */
MandrillAPI_v1_0.prototype.senders_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('senders/list', [
	], params, callback);
}

/**
 * Returns the sender domains that have been added to this account.
 *
 * @see https://mandrillapp.com/api/docs/senders.html#method=domains
 */
MandrillAPI_v1_0.prototype.senders_domains = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('senders/domains', [
	], params, callback);
}

/**
 * Return more detailed information about a single sender, including aggregates
 * of recent stats.
 *
 * @see https://mandrillapp.com/api/docs/senders.html#method=info
 */
MandrillAPI_v1_0.prototype.senders_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('senders/info', [
		'address',
	], params, callback);
}

/**
 * Return the recent history (hourly stats for the last 30 days) for a sender.
 *
 * @see https://mandrillapp.com/api/docs/senders.html#method=time-series
 */
MandrillAPI_v1_0.prototype.senders_time_series = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('senders/time-series', [
		'address',
	], params, callback);
}

/*****************************************************************************/
/********************************* Urls Calls ********************************/
/*****************************************************************************/

/**
 * Get the 100 most clicked URLs.
 *
 * @see https://mandrillapp.com/api/docs/urls.html#method=list
 */
MandrillAPI_v1_0.prototype.urls_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('urls/list', [
	], params, callback);
}

/**
 * Return the 100 most clicked URLs that match the search query given.
 *
 * @see https://mandrillapp.com/api/docs/urls.html#method=search
 */
MandrillAPI_v1_0.prototype.urls_search = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('urls/search', [
		'q',
	], params, callback);
}

/**
 * Return the recent history (hourly stats for the last 30 days) for a url.
 *
 * @see https://mandrillapp.com/api/docs/urls.html#method=time-series
 */
MandrillAPI_v1_0.prototype.urls_time_series = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('urls/time-series', [
		'url',
	], params, callback);
}

/*****************************************************************************/
/****************************** Templates Calls ******************************/
/*****************************************************************************/

/**
 * Add a new template.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=add
 */
MandrillAPI_v1_0.prototype.templates_add = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/add', [
		'name',
		'from_email',
		'from_name',
		'subject',
		'code',
		'text',
		'publish',
	], params, callback);
}

/**
 * Get the information for an existing template.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=info
 */
MandrillAPI_v1_0.prototype.templates_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/info', [
		'name',
	], params, callback);
}

/**
 * Update the code for an existing template. If null is provided for any
 * fields, the values will remain unchanged.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=update
 */
MandrillAPI_v1_0.prototype.templates_update = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/update', [
		'name',
		'from_email',
		'from_name',
		'subject',
		'code',
		'text',
		'publish',
	], params, callback);
}

/**
 * Publish the content for the template. Any new messages sent using this
 * template will start using the content that was previously in draft.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=publish
 */
MandrillAPI_v1_0.prototype.templates_publish = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/publish', [
		'name',
	], params, callback);
}

/**
 * Delete a template.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=delete
 */
MandrillAPI_v1_0.prototype.templates_delete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/delete', [
		'name',
	], params, callback);
}

/**
 * Return a list of all the templates available to this user.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=list
 */
MandrillAPI_v1_0.prototype.templates_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/list', [
	], params, callback);
}

/**
 * Return the recent history (hourly stats for the last 30 days) for a
 * template.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=time-series
 */
MandrillAPI_v1_0.prototype.templates_time_series = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/time-series', [
		'name',
	], params, callback);
}

/**
 * Inject content and optionally merge fields into a template, returning the
 * HTML that results.
 *
 * @see https://mandrillapp.com/api/docs/templates.html#method=render
 */
MandrillAPI_v1_0.prototype.templates_render = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/render', [
		'template_name',
		'template_content',
		'merge_vars',
	], params, callback);
}

/*****************************************************************************/
/******************************* Webhooks Calls ******************************/
/*****************************************************************************/

/**
 * Get the list of all webhooks defined on the account.
 *
 * @see https://mandrillapp.com/api/docs/webhooks.html#method=list
 */
MandrillAPI_v1_0.prototype.webhooks_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/list', [
	], params, callback);
}

/**
 * Add a new webhook.
 *
 * @see https://mandrillapp.com/api/docs/webhooks.html#method=add
 */
MandrillAPI_v1_0.prototype.webhooks_add = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/add', [
		'url',
		'description',
		'events',
	], params, callback);
}

/**
 * Given the ID of an existing webhook, return the data about it.
 *
 * @see https://mandrillapp.com/api/docs/webhooks.html#method=info
 */
MandrillAPI_v1_0.prototype.webhooks_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/info', [
		'id',
	], params, callback);
}

/**
 * Update an existing webhook.
 *
 * @see https://mandrillapp.com/api/docs/webhooks.html#method=update
 */
MandrillAPI_v1_0.prototype.webhooks_update = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/update', [
		'id',
		'url',
		'description',
		'events',
	], params, callback);
}

/**
 * Delete an existing webhook.
 *
 * @see https://mandrillapp.com/api/docs/webhooks.html#method=delete
 */
MandrillAPI_v1_0.prototype.webhooks_update = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/delete', [
		'id',
	], params, callback);
}

/*****************************************************************************/
/******************************* Inbound Calls *******************************/
/*****************************************************************************/

/**
 * List the domains that have been configured for inbound delivery.
 *
 * @see https://mandrillapp.com/api/docs/inbound.html#method=domains
 */
MandrillAPI_v1_0.prototype.inbound_domains = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inbound/domains', [
		'domain',
	], params, callback);
}

/**
 * List the mailbox routes defined for an inbound domain.
 *
 * @see https://mandrillapp.com/api/docs/inbound.html#method=routes
 */
MandrillAPI_v1_0.prototype.inbound_routes = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inbound/routes', [
		'domain',
	], params, callback);
}

/**
 * Take a raw MIME document destined for a domain with inbound domains set up,
 * and send it to the inbound hook exactly as if it had been sent over SMTP.
 *
 * @see https://mandrillapp.com/api/docs/inbound.html#method=send-raw
 */
MandrillAPI_v1_0.prototype.inbound_send_raw = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('inbound/send-raw', [
		'raw_message',
		'to',
		'mail_from',
		'helo',
		'client_address',
	], params, callback);
}

/*****************************************************************************/
/******************************* Exports Calls *******************************/
/*****************************************************************************/

/**
 * Returns information about an export job. If the export job's state is
 * 'complete', the returned data will include a URL you can use to fetch the
 * results. Every export job produces a zip archive, but the format of the
 * archive is distinct for each job type. The api calls that initiate exports
 * include more details about the output format for that job type.
 *
 * @see https://mandrillapp.com/api/docs/exports.html#method=info
 */
MandrillAPI_v1_0.prototype.exports_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('exports/info', [
		'id',
	], params, callback);
}

/**
 * Returns a list of your exports.
 *
 * @see https://mandrillapp.com/api/docs/exports.html#method=list
 */
MandrillAPI_v1_0.prototype.exports_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('exports/list', [
	], params, callback);
}

/**
 * Begins an export of your rejection blacklist. The blacklist will be exported
 * to a zip archive containing a single file named rejects.csv that includes
 * the following fields: email, reason, detail, created_at, expires_at,
 * last_event_at, expires_at.
 *
 * @see https://mandrillapp.com/api/docs/exports.html#method=rejects
 */
MandrillAPI_v1_0.prototype.exports_rejects = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('exports/rejects', [
		'notify_email',
	], params, callback);
}

/**
 * Begins an export of your rejection whitelist. The whitelist will be exported
 * to a zip archive containing a single file named whitelist.csv that includes
 * the following fields: email, detail, created_at.
 *
 * @see https://mandrillapp.com/api/docs/exports.html#method=whitelist
 */
MandrillAPI_v1_0.prototype.exports_whitelist = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('exports/whitelist', [
		'notify_email',
	], params, callback);
}

/**
 * Begins an export of your activity history. The activity will be exported to
 * a zaip archive containing a single file named activity.csv in the same
 * format as you would be able to export from your account's activity view. It
 * includes the following fields: Date, Email Address, Sender, Subject, Status,
 * Tags, Opens, Clicks, Bounce Detail. If you have configured any custom
 * metadata fields, they will be included in the exported data.
 *
 * @see https://mandrillapp.com/api/docs/exports.html#method=activity
 */
MandrillAPI_v1_0.prototype.exports_activity = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('exports/activity', [
		'notify_email',
		'date_from',
		'date_to',
		'tags',
		'senders',
		'states',
	], params, callback);
}