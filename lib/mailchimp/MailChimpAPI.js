var MailChimpAPI_v1_3 = require('./MailChimpAPI_v1_3');

/**
 * Returns a MailChimp API wrapper object of the specified version. The only 
 * API version currently supported is 1.3 but as soon as other versions are
 * implemented you can specify the one you want in the options parameter.
 * 
 * Available options are:
 *  - version The API version to use, currently only '1.3' is supported. 
 *            Defaults to '1.3'.
 *  - secure  Whether or not to use secure connections over HTTPS (true/false)
 *            Defaults to false.
 * 
 * @param apiKey The API key to access the MailChimp API with
 * @param options Configuration options as described above
 * @return Instance of the MailChimp API in the specified version
 */
function MailChimpAPI (apiKey, options) {
	
	if (!options) 
		var options = {};
	
	if (!apiKey)
		throw 'You have to provide an API key for this to work.';

	if (!options.version || options.version == '1.3')
		return new MailChimpAPI_v1_3(apiKey, options);
	else
		throw 'Version ' + options.version + ' of the MailChimp API is currently not supported.';
	
}

module.exports = MailChimpAPI;