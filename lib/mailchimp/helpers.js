/**
 * Recursively encode an object as application/x-www-form-urlencoded.
 *
 * @param value Value to encode
 * @param key Key to encode (not required for top-level objects)
 * @return Encoded object
 */
var serialize = module.exports.serialize = function (value, key) {

	var output;

	if (!key && key !== 0)
		key = '';

    if (Array.isArray(value)) {
        output = [];
        value.forEach(function(val, index) {
            if (key != '') index = key + '[' + index + ']';
            output.push(serialize(val, index));
        }, this);
        return output.join('&');
    } else if (typeof(value) == 'object') {
        output = [];
        for (var name in value) {
            if (value[name] && value.hasOwnProperty(name)) {
                output.push(serialize(value[name], key != '' ? key + '[' + name + ']' : name));
            }
        }
        return output.join('&');
    } else {
        return key + '=' + encodeURIComponent(value);
    }

}

/**
 * Creates an Error with information received from MailChimp. In addition to an
 * error message it also includes an error code. A detailed list of known error
 * messages and codes can be found at the url below for version 1.3 of the API.
 *
 * @see http://apidocs.mailchimp.com/api/1.3/exceptions.field.php
 *
 * @param message The error message
 * @param code The error code
 * @return Instance of {@link Error}
 */
var createMailChimpError = module.exports.createMailChimpError = function (message, code) {

	var error = new Error(message || (message = ''));

	if (code)
		error.code = code;

	return error;

}

/**
 * handleMailChimpResponse
 * Handles a response from MailChimp. This handles errors in a unified way or
 * parses the JSON response as appropriate.
 *
 * @param error
 * @param response
 * @param body
 * @param {function(error, parsedResponse)} callback
 */
var handleMailChimpResponse = module.exports.handleMailChimpResponse = function (error, response, body, callback) {
  var parsedResponse;
  if (error) {
    return callback(new Error('Unable to connect to the MailChimp API endpoint because ' + error.message));
  }

  try {
    parsedResponse = JSON.parse(body);
  } catch (error) {
    return callback(new Error('Error parsing JSON answer from MailChimp API: ' + body));
  }

  if (response.statusCode != 200 || parsedResponse.status == 'error') {
    return callback(createMailChimpError(parsedResponse.error, parsedResponse.code));
  }

  callback(null, parsedResponse);
}
