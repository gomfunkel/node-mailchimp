var MailChimpSTSAPI_v1_0 = require('./MailChimpSTSAPI_v1_0'),
    fs = require('fs');

/**
 * Returns a MailChimp STS API wrapper object in the specified version. The 
 * only API version currently supported (even the only version available at the
 * time of writing) is 1.0 but as soon as other versions are available and 
 * implemented you can specify the one you want in the options parameter.
 * 
 * Available options are:
 *  - version   The API version to use, currently only '1.0' is supported. 
 *              Defaults to '1.0'.
 *  - secure    Whether or not to use secure connections over HTTPS 
 *              (true/false). Defaults to false.
 *  - userAgent Custom User-Agent description to use in the request header.            
 * 
 * @param apiKey The API key to access the MailChimp STS API with
 * @param options Configuration options as described above
 * @return Instance of the MailChimp STS API in the specified version
 */
function MailChimpSTSAPI (apiKey, options) {
	
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
	
	if (!options.version || options.version == '1.0')
		return new MailChimpSTSAPI_v1_0(apiKey, options);
	else
		throw new Error('Version ' + options.version + ' of the MailChimp STS API is currently not supported.');
	
}

module.exports = MailChimpSTSAPI;