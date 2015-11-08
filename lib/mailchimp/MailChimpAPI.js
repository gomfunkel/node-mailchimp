var MailChimpAPI_v2_0 = require('./MailChimpAPI_v2_0'),
    MailChimpAPI_v1_3 = require('./MailChimpAPI_v1_3'),
    MailChimpAPI_v1_2 = require('./MailChimpAPI_v1_2'),
    MailChimpAPI_v1_1 = require('./MailChimpAPI_v1_1'),
    fs = require('fs');

/**
 * Returns a MailChimp API wrapper object of the specified version. All API
 * versions available at the time of writing (1.1, 1.2 and 1.3) are supported.
 *
 * Available options are:
 *  - version   The API version to use (1.1, 1.2 or 1.3). Defaults to 1.3.
 *  - secure    Whether or not to use secure connections over HTTPS
 *              (true/false). Defaults to false.
 *  - userAgent Custom User-Agent description to use in the request header.
 *
 * @param apiKey The API key to access the MailChimp API with
 * @param options Configuration options as described above
 * @return Instance of the MailChimp API in the specified version
 */
function MailChimpAPI (apiKey, options) {

	if (!options)
		var options = {};

	if (!apiKey)
		throw new Error('You have to provide an API key for this to work.');

	try {
		var packageInfo = fs.readFileSync(__dirname+"/../../package.json");
	} catch (error) {
		throw new Error('Required package file package.json not found for this module.');
	}
	options.packageInfo = JSON.parse(packageInfo.toString());

	if (!options.version || options.version == '1.3')
		return new MailChimpAPI_v1_3(apiKey, options);
	else if (options.version == '2.0')
		return new MailChimpAPI_v2_0(apiKey, options);
	else if (options.version == '1.2')
		return new MailChimpAPI_v1_2(apiKey, options);
	else if (options.version == '1.1')
		return new MailChimpAPI_v1_1(apiKey, options);
	else
		throw new Error('Version ' + options.version + ' of the MailChimp API is currently not supported.');

}

module.exports = MailChimpAPI;