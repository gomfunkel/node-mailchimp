var http = require('http'),
    querystring = require('querystring'),
    request = require('request');

/**
 * MailChimp Export API wrapper for the API version 1.0. This object should not
 * be instantiated directly but by using the version wrapper 
 * {@link MailChimpExportAPI}.
 * 
 * @param apiKey The API key to access the MailChimp Export API with
 * @param options Configuration options
 * @return Instance of {@link MailChimpExportAPI_v1_0}
 */
function MailChimpExportAPI_v1_0 (apiKey, options) {
	
	if (!options) 
		var options = {};
	
	this.version    = '1.0';
	this.apiKey     = apiKey;
	this.secure     = options.secure || false;
	this.datacenter = apiKey.split('-');
	this.datacenter = this.datacenter[1];
	this.httpHost   = this.datacenter+'.api.mailchimp.com';
	this.httpUri    = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80';
	
}

module.exports = MailChimpExportAPI_v1_0;

/**
 * Sends a given request as a JSON object to the MailChimp Export API and 
 * finally calls the given callback function with the resulting JSON object. 
 * This method should not be called directly but will be used internally by all
 * API methods defined.
 * 
 * @param method MailChimp API method to call
 * @param params Parameters to call the MailChimp API with
 * @param callback Callback function to call on success 
 */
MailChimpExportAPI_v1_0.prototype.execute = function (method, params, callback) {
	
	var self = this;

	params.apikey = this.apiKey;
	
	for (param in params)
		if (params[param] === null)
			delete params[param];
	
	var query = querystring.stringify(params);

	request({
		uri : this.httpUri+'/export/'+this.version+'/'+method+'/?'+query,
		headers : { 'User-Agent' : 'node-mailchimp/'+this.version }
	}, function (error, response, body) {
		if (error) {
			callback({ 'error' : 'Unable to connect to the MailChimp API endpoint.', 'code' : 'xxx'})
		} else {
 			var processFunction = eval("self."+method+"Process");
			if (typeof processFunction == 'function')
				processFunction(body, callback);
			else
				callback(JSON.parse(body));
		}
	});
	
}

/**
 * Exports/dumps members of a list and all of their associated details. This is 
 * very similar to exporting via the web interface.
 * 
 * @see http://www.mailchimp.com/api/export/
 */
MailChimpExportAPI_v1_0.prototype.list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('list', {
		id      : params.id || null,
		status  : params.status || null,
		segment : params.segment || null,
		since   : params.since || null,
	}, callback);
}

/**
 * Process the response from the list API call and pass it to the callback
 * function.
 */
MailChimpExportAPI_v1_0.prototype.listProcess = function (data, callback) {
	
	var resultStrings = data.split("\n");
	var resultJSON    = [];
	
	for (current in resultStrings) {
		if (typeof resultStrings[current] == 'string' && resultStrings[current] !== "")
			resultJSON.push(JSON.parse(resultStrings[current]));
	}

	if (resultJSON[0] && resultJSON[0].error)
		callback(resultJSON[0])
	else
		callback(resultJSON);

}