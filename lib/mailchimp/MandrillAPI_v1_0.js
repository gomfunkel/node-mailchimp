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
 * Yo dawg! I heard you like wrappers, so I put a wrapper around your wrapper
 * so you can wrap method calls while you wrap method calls.
 * 
 * You can either call the API methods directly or using this function which 
 * assembles the name of the API method from a given method category and 
 * method name. Categories and methods are described in the Mandrill API
 * Documentation.
 * 
 * @see http://mandrillapp.com/api/docs/  
 * 
 * @param category The category of the API method to call (e.g. 'users')
 * @param method The method to call in the given category
 * @param params Parameters the the API method
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
 * @see http://mandrillapp.com/api/docs/users.html#method-info
 */
MandrillAPI_v1_0.prototype.users_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('users/info', [
	], params, callback);
}

/**
 * Validate an API key and respond to a ping.
 * 
 * @see http://mandrillapp.com/api/docs/users.html#method-ping
 */
MandrillAPI_v1_0.prototype.users_ping = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('users/ping', [
	], params, callback);
}

/**
 * Validate an API key and respond to a ping (anal JSON parser version).
 * 
 * @see http://mandrillapp.com/api/docs/users.html#method-ping2
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
 * @see http://mandrillapp.com/api/docs/users.html#method-senders
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
 * @see http://mandrillapp.com/api/docs/messages.html#method-send
 */
MandrillAPI_v1_0.prototype.messages_send = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('messages/send', [
		'message',
	], params, callback);
}

/**
 * Send a new transactional message through Mandrill using a template.
 * 
 * @see http://mandrillapp.com/api/docs/messages.html#method-send-template
 */
MandrillAPI_v1_0.prototype.messages_send_template = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('messages/send-template', [
		'template_name',
		'template_content',
		'message',
	], params, callback);
}

/**
 * Search the content of recently sent messages and optionally narrow by date
 * range, tags and senders.
 * 
 * @see http://mandrillapp.com/api/docs/messages.html#method-search
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

/*****************************************************************************/
/******************************** Tags Calls *********************************/
/*****************************************************************************/

/**
 * Return all of the user-defined tag information.
 * 
 * @see http://mandrillapp.com/api/docs/tags.html#method-list
 */
MandrillAPI_v1_0.prototype.tags_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('tags/list', [
	], params, callback);
}

/**
 * Return more detailed information about a single tag, including aggregates of
 * recent stats.
 * 
 * @see http://mandrillapp.com/api/docs/tags.html#method-info
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
 * @see http://mandrillapp.com/api/docs/tags.html#method-time-series
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
 * @see http://mandrillapp.com/api/docs/tags.html#method-all-time-series
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
 * Retrieves your email rejection blacklist. You can provide an email address 
 * to limit the results. Returns up to 1000 results.
 * 
 * @see http://mandrillapp.com/api/docs/rejects.html#method-list
 */
MandrillAPI_v1_0.prototype.rejects_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('rejects/list', [
		'email',
	], params, callback);
}

/**
 * Deletes an email rejection. There is no limit to how many rejections you can
 * remove from your blacklist, but keep in mind that each deletion has an 
 * affect on your reputation.
 * 
 * @see http://mandrillapp.com/api/docs/rejects.html#method-delete
 */
MandrillAPI_v1_0.prototype.rejects_delete = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('rejects/delete', [
		'email',
	], params, callback);
}

/*****************************************************************************/
/******************************* Senders Calls *******************************/
/*****************************************************************************/

/**
 * Return the senders that have tried to use this account.
 * 
 * @see http://mandrillapp.com/api/docs/senders.html#method-list
 */
MandrillAPI_v1_0.prototype.senders_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('senders/list', [
	], params, callback);
}

/**
 * Returns the sender domains that have been added to this account.
 * 
 * @see http://mandrillapp.com/api/docs/senders.html#method-domains
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
 * @see http://mandrillapp.com/api/docs/senders.html#method-info
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
 * @see http://mandrillapp.com/api/docs/senders.html#method-time-series
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
 * @see http://mandrillapp.com/api/docs/urls.html#method-list
 */
MandrillAPI_v1_0.prototype.urls_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('urls/list', [
	], params, callback);
}

/**
 * Return the 100 most clicked URLs that match the search query given.
 * 
 * @see http://mandrillapp.com/api/docs/urls.html#method-search
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
 * @see http://mandrillapp.com/api/docs/urls.html#method-time-series
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
 * @see http://mandrillapp.com/api/docs/templates.html#method-add
 */
MandrillAPI_v1_0.prototype.templates_add = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/add', [
		'name',
		'code',
		'publish',
	], params, callback);
}

/**
 * Get the information for an existing template.
 * 
 * @see http://mandrillapp.com/api/docs/templates.html#method-info
 */
MandrillAPI_v1_0.prototype.templates_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/info', [
		'name',
	], params, callback);
}

/**
 * Update the code for an existing template.
 * 
 * @see http://mandrillapp.com/api/docs/templates.html#method-update
 */
MandrillAPI_v1_0.prototype.templates_update = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('templates/update', [
		'name',
		'code',
		'publish',
	], params, callback);
}

/**
 * Publish the content for the template. Any new messages sent using this
 * template will start using the content that was previously in draft.
 * 
 * @see http://mandrillapp.com/api/docs/templates.html#method-publish
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
 * @see http://mandrillapp.com/api/docs/templates.html#method-delete
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
 * @see http://mandrillapp.com/api/docs/templates.html#method-list
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
 * @see http://mandrillapp.com/api/docs/templates.html#method-time-series
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
 * @see http://mandrillapp.com/api/docs/templates.html#method-render
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
 * @see http://mandrillapp.com/api/docs/webhooks.html#method-list
 */
MandrillAPI_v1_0.prototype.webhooks_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/list', [
	], params, callback);
}

/**
 * Add a new webhook.
 * 
 * @see http://mandrillapp.com/api/docs/webhooks.html#method-add
 */
MandrillAPI_v1_0.prototype.webhooks_add = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/add', [
		'url',
		'events',
	], params, callback);
}

/**
 * Given the ID of an existing webhook, return the data about it.
 * 
 * @see http://mandrillapp.com/api/docs/webhooks.html#method-info
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
 * @see http://mandrillapp.com/api/docs/webhooks.html#method-update
 */
MandrillAPI_v1_0.prototype.webhooks_update = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/update', [
		'id',
		'url',
		'events',
	], params, callback);
}

/**
 * Delete an existing webhook.
 * 
 * @see http://mandrillapp.com/api/docs/webhooks.html#method-delete
 */
MandrillAPI_v1_0.prototype.webhooks_update = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('webhooks/delete', [
		'id',
	], params, callback);
}
