var http = require('http'),
    querystring = require('querystring'),
    request = require('request'),
    helpers = require('./helpers');

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

  this.version     = '1.0';
  this.apiKey      = apiKey;
  this.secure      = options.secure || false;
  this.packageInfo = options.packageInfo;
  this.datacenter  = apiKey.split('-');
  this.datacenter  = this.datacenter[1];
  this.httpHost    = this.datacenter+'.api.mailchimp.com';
  this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80';
  this.userAgent   = options.userAgent+' ' || '';

}

module.exports = MailChimpExportAPI_v1_0;

/**
 * Sends a given request as a JSON object to the MailChimp Export API and 
 * finally calls the given callback function with the resulting JSON object. 
 * This method should not be called directly but will be used internally by all
 * API methods defined.
 * 
 * @param method MailChimp API method to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the MailChimp API with
 * @param callback Callback function to call on success 
 */
MailChimpExportAPI_v1_0.prototype.execute = function (method, availableParams, givenParams, callback) {

  var self = this;

  var finalParams = { apikey : this.apiKey };
  var currentParam;

  for (var i = 0; i < availableParams.length; i++) {
    currentParam = availableParams[i];
    if (typeof givenParams[currentParam] !== 'undefined')
      finalParams[currentParam] = givenParams[currentParam];
  }

  var query = querystring.stringify(finalParams);

  request({
    uri : this.httpUri+'/export/'+this.version+'/'+method+'/?'+query,
    headers : { 'User-Agent' : this.userAgent+'node-mailchimp/'+this.packageInfo['version'] }
  }, function (error, response, body) {
    if (error) {
      callback(new Error('Unable to connect to the MailChimp API endpoint.'));
    } else {
      var processFunction = eval("self."+method+"Process");
      if (typeof processFunction == 'function') {
        processFunction(body, callback);
      } else {
        var parsedResponse;
        try {
          parsedResponse = JSON.parse(body); 
        } catch (error) {
          callback(new Error('Error parsing JSON answer from MailChimp API.'));
          return;
        }
        callback(null, parsedResponse);			
      }
    }
  });

}

/**
 * Exports/dumps members of a list and all of their associated details. This is 
 * very similar to exporting via the web interface.
 * 
 * @see http://apidocs.mailchimp.com/export/1.0/list.func.php
 */
MailChimpExportAPI_v1_0.prototype.list = function (params, callback) {
  if (typeof params == 'function') callback = params, params = {};
  this.execute('list', [
    'id',
    'status',
    'segment',
    'since',
  ], params, callback);
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
    callback(helpers.createMailChimpError(resultJSON[0].error, resultJSON[0].code));
  else
    callback(null, resultJSON);

}

/**
 * Exports/dumps all Subscriber Activity for the requested campaign.
 * 
 * @see http://apidocs.mailchimp.com/export/1.0/campaignsubscriberactivity.func.php
 */
MailChimpExportAPI_v1_0.prototype.campaignSubscriberActivity = function (params, callback) {
  if (typeof params == 'function') callback = params, params = {};
  this.execute('campaignSubscriberActivity', [
    'id',
    'include_empty',
  ], params, callback);
}

/**
 * Process the response from the campaignSubscriberActivity API call and pass 
 * it to the callback function.
 */
MailChimpExportAPI_v1_0.prototype.campaignSubscriberActivityProcess = function (data, callback) {

  // When API returns no subscriber activity return an empty array
  if (typeof data === 'undefined') {
    callback(null, []);
    return;
  }

  var resultStrings = data.split("\n");
  var resultJSON    = [];

  for (current in resultStrings) {
    if (typeof resultStrings[current] == 'string' && resultStrings[current] !== "")
      resultJSON.push(JSON.parse(resultStrings[current]));
  }

  if (resultJSON[0] && resultJSON[0].error)
    callback(helpers.createMailChimpError(resultJSON[0].error, resultJSON[0].code));
  else
    callback(null, resultJSON);

}