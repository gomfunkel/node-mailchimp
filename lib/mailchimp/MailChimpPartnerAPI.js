var MailChimpPartnerAPI_v1_3 = require('./MailChimpPartnerAPI_v1_3'),
    fs = require('fs');

/**
 * Returns a MailChimp Partner API wrapper object of the specified version. All
 * API versions available at the time of writing (only 1.3) are supported.
 *
 * Available options are:
 *  - version   The API version to use (1.3). Defaults to 1.3.
 *  - secure    Whether or not to use secure connections over HTTPS
 *              (true/false). Defaults to false.
 *  - userAgent Custom User-Agent description to use in the request header.
 *
 * @param appKey The app key to access the MailChimp Partner API with
 * @param options Configuration options as described above
 * @return Instance of the MailChimp Partner API in the specified version
 */
function MailChimpPartnerAPI (appKey, options) {

	if (!options)
		var options = {};

	if (!appKey)
		throw new Error('You have to provide an app key for this to work.');

	try {
		var packageInfo = fs.readFileSync(__dirname+"/../../package.json");
	} catch (error) {
		throw new Error('Required package file package.json not found for this module.');
	}
	options.packageInfo = JSON.parse(packageInfo.toString());

	if (!options.version || options.version == '1.3')
		return new MailChimpPartnerAPI_v1_3(appKey, options);
	else
		throw new Error('Version ' + options.version + ' of the MailChimp Partner API is currently not supported.');

}

module.exports = MailChimpPartnerAPI;