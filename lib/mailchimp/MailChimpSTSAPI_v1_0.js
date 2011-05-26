var http = require('http'),
    request = require('request');

/**
 * MailChimp STS API wrapper for the API version 1.0. This object should not be
 * instantiated directly but by using the version wrapper
 * {@link MailChimpSTSAPI}.
 * 
 * @param apiKey The API key to access the MailChimp API with
 * @param options Configuration options
 * @return Instance of {@link MailChimpSTSAPI_v1_0}
 */
function MailChimpSTSAPI_v1_0 (apiKey, options) {
	
	if (!options) 
		var options = {};
	
	this.version     = '1.0';
	this.apiKey      = apiKey;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.datacenter  = apiKey.split('-');
	this.datacenter  = this.datacenter[1];
	this.httpHost    = this.datacenter+'.sts.mailchimp.com';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80'; 
	
}

module.exports = MailChimpSTSAPI_v1_0;

/**
 * Sends a given request as a JSON object to the MailChimp STS API and finally
 * calls the given callback function with the resulting JSON object. This 
 * method should not be called directly but will be used internally by all API
 * methods defined.
 * 
 * @param method MailChimp API method to call
 * @param params Parameters to call the MailChimp API with
 * @param callback Callback function to call on success 
 */
MailChimpSTSAPI_v1_0.prototype.execute = function (method, params, callback) {
	
	params.apikey = this.apiKey;
	
	for (param in params)
		if (params[param] === null)
			delete params[param];
	
	request({
		uri : this.httpUri+'/'+this.version+'/'+method+'/',
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
/************************ Email Verification Methods *************************/
/*****************************************************************************/

/**
 * Deletes a verified email address.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/deleteverifiedemailaddress.func.php
 */
MailChimpSTSAPI_v1_0.prototype.DeleteVerifiedEmailAddress = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('DeleteVerifiedEmailAddress', {
		email : ((typeof params.email !== 'undefined') ? params.email : null),
	}, callback);
}

/**
 * Returns a list containing all of the email addresses that have been 
 * verified.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/listverifiedemailaddresses.func.php
 */
MailChimpSTSAPI_v1_0.prototype.ListVerifiedEmailAddresses = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('ListVerifiedEmailAddresses', {
	}, callback);
}

/**
 * Verifies an email address.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/verifyemailaddress.func.php
 */
MailChimpSTSAPI_v1_0.prototype.VerifyEmailAddress = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('VerifyEmailAddress', {
		email : ((typeof params.email !== 'undefined') ? params.email : null),
	}, callback);
}

/*****************************************************************************/
/**************************** MC Stats Methods *******************************/
/*****************************************************************************/

/**
 * Returns all stats in one hour intervals.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/getsendstats.func.php
 */
MailChimpSTSAPI_v1_0.prototype.GetSendStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GetSendStats', {
		tag_id : ((typeof params.tag_id !== 'undefined') ? params.tag_id : null),
		since  : ((typeof params.since !== 'undefined') ? params.since : null),
	}, callback);
}

/**
 * Returns all tags defined for your account along with all-time, non-unique 
 * aggregate stats for each.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/gettags.func.php
 */
MailChimpSTSAPI_v1_0.prototype.GetTags = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GetTags', {
	}, callback);
}

/**
 * Returns all stats in one hour intervals.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/geturlstats.func.php
 */
MailChimpSTSAPI_v1_0.prototype.GetUrlStats = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GetUrlStats', {
		url_id : ((typeof params.url_id !== 'undefined') ? params.url_id : null),
		since  : ((typeof params.since !== 'undefined') ? params.since : null),
	}, callback);
}

/**
 * Returns all tracked urls defined for your account along with all-time, 
 * non-unique aggregate stats for each MailChimp specific - there is no Amazon
 * alternative to this method.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/geturls.func.php
 */
MailChimpSTSAPI_v1_0.prototype.GetUrls = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GetUrls', {
	}, callback);
}

/*****************************************************************************/
/***************************** Sending Methods *******************************/
/*****************************************************************************/

/**
 * Composes an email message based on input data, and then immediately queues
 * the message for sending.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/sendemail.func.php
 */
MailChimpSTSAPI_v1_0.prototype.SendEmail = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('SendEmail', {
		message      : ((typeof params.message !== 'undefined') ? params.message : null),
		track_opens  : ((typeof params.track_opens !== 'undefined') ? params.track_opens : null),
		track_clicks : ((typeof params.track_clicks !== 'undefined') ? params.track_clicks : null),
	    tags         : ((typeof params.tags !== 'undefined') ? params.tags : null),
	}, callback);
}

/*****************************************************************************/
/****************************** Stats Methods ********************************/
/*****************************************************************************/

/**
 * Returns the user's current activity limits.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/getsendquota.func.php
 */
MailChimpSTSAPI_v1_0.prototype.GetSendQuota = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GetSendQuota', {
	}, callback);
}

/**
 * Returns the user's sending statistics.
 * 
 * @see http://apidocs.mailchimp.com/sts/1.0/getsendstatistics.func.php
 */
MailChimpSTSAPI_v1_0.prototype.GetSendStatistics = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GetSendStatistics', {
	}, callback);
}