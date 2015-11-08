var http = require('http'),
    request = require('request'),
    helpers = require('./helpers');

/**
 * MailChimp Partner API wrapper for the API version 1.3. This object should
 * not be instantiated directly but by using the version wrapper
 * {@link MailChimpPartnerAPI}.
 *
 * @param appKey The app key to access the MailChimp Partner API with
 * @param options Configuration options
 * @return Instance of {@link MailChimpPartnerAPI_v1_3}
 */
function MailChimpPartnerAPI_v1_3 (appKey, options) {

	if (!options)
		var options = {};

	this.version     = '1.3';
	this.appKey      = appKey;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.datacenter  = appKey.split('-');
	this.datacenter  = this.datacenter[1];
	this.httpHost    = this.datacenter+'.partner-api.mailchimp.com';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80';
	this.userAgent   = options.userAgent+' ' || '';

}

module.exports = MailChimpPartnerAPI_v1_3;

/**
 * Sends a given request as a JSON object to the MailChimp Partner API and
 * finally calls the given callback function with the resulting JSON object.
 * This method should not be called directly but will be used internally by all
 * API methods defined.
 *
 * @param method MailChimp Partner API method to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the MailChimp Partner API with
 * @param callback Callback function to call on success
 */
MailChimpPartnerAPI_v1_3.prototype.execute = function (method, availableParams, givenParams, callback) {

	var finalParams = { app_key : this.appKey };
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
		body : encodeURIComponent(JSON.stringify(finalParams))
	}, function (error, response, body) {
		helpers.handleMailChimpResponse(error, response, body, callback);
	});

}

/*****************************************************************************/
/*************************** List Related Methods ****************************/
/*****************************************************************************/

/**
 * Create a List for the given user.
 *
 * @see http://apidocs.mailchimp.com/partnerapi/1.3/createlist.func.php
 */
MailChimpPartnerAPI_v1_3.prototype.createList = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createList', [
	    'apikey',
	    'detail',
	], params, callback);
}

/*****************************************************************************/
/*************************** User Related Methods ****************************/
/*****************************************************************************/

/**
 * Check whether a username is available.
 *
 * @see http://apidocs.mailchimp.com/partnerapi/1.3/checkusername.func.php
 */
MailChimpPartnerAPI_v1_3.prototype.checkUsername = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('checkUsername', [
	    'username',
	], params, callback);
}

/**
 * Create a user account and login.
 *
 * @see http://apidocs.mailchimp.com/partnerapi/1.3/createuser.func.php
 */
MailChimpPartnerAPI_v1_3.prototype.createUser = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('createUser', [
	    'details',
	    'username',
	], params, callback);
}

/**
 * Return the datacenter that should be used when making createUser() calls.
 *
 * @see http://apidocs.mailchimp.com/partnerapi/1.3/getnewuserdc.func.php
 */
MailChimpPartnerAPI_v1_3.prototype.getNewUserDc = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('getNewUserDc', [
	], params, callback);
}
