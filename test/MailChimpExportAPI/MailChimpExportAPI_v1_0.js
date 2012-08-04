var assert = require('assert'),
    vows = require('vows'),
    nock = require('nock');

var apiEndpoint = nock('http://dc.api.mailchimp.com:80').get('/export/1.0/campaignSubscriberActivity/?apikey=apiKey-dc')
                                                        .reply(200, '{\"error\":\"Invalid Campaign ID: \",\"code\":300}')
                                                        .get('/export/1.0/campaignSubscriberActivity/?apikey=apiKey-dc&id=12345')
                                                        .reply(200, "{\"user1@domain.tld\":[{\"action\":\"open\",\"timestamp\":\"2012-01-01 00:00:00\",\"url\":null,\"ip\":\"127.0.0.1\"}]}\n{\"user2@domain.tld\":[{\"action\":\"open\",\"timestamp\":\"2012-01-21 01:00:00\",\"url\":null,\"ip\":\"127.0.0.1\"}]}\n")
                                                        .get('/export/1.0/campaignSubscriberActivity/?apikey=apiKey-dc&id=12345&include_empty=true')
                                                        .reply(200, "{\"user1@domain.tld\":[{\"action\":\"open\",\"timestamp\":\"2012-01-01 00:00:00\",\"url\":null,\"ip\":\"127.0.0.1\"}]}\n{\"user2@domain.tld\":[{\"action\":\"open\",\"timestamp\":\"2012-01-21 01:00:00\",\"url\":null,\"ip\":\"127.0.0.1\"}]}\n")
                                                        .get('/export/1.0/campaignSubscriberActivity/?apikey=apiKey-dc&id=12345&include_empty=true')
                                                        .reply(200, "{\"user1@domain.tld\":[{\"action\":\"open\",\"timestamp\":\"2012-01-01 00:00:00\",\"url\":null,\"ip\":\"127.0.0.1\"}]}\n{\"user2@domain.tld\":[{\"action\":\"open\",\"timestamp\":\"2012-01-21 01:00:00\",\"url\":null,\"ip\":\"127.0.0.1\"}]}\n");

var MailChimpAPI = require('mailchimp').MailChimpExportAPI;

vows.describe('MailChimpExportAPI v1.1').addBatch({

	'MailChimpExportAPI v1.1 wrapper': {
		
		'when instantiated': {
			topic: function () { return new MailChimpAPI('apiKey-dc', { version : '1.0' }) },
			'successfully creates an instance': function (api) {
				assert.isObject(api);
				assert.strictEqual(api.version, '1.0');
			},
			
			/*** campaignSubscriberActivity ***/
			
			'and calling method "campaignSubscriberActivity" with mandatory arguments': {
				topic: function (api) { api.campaignSubscriberActivity({ id: "12345" }, this.callback) },
				'exports subscriber activity for the requested campaign': function (error, data) {
					assert.isNull(error);
					assert.isArray(data);
				}
			},
			
			'and calling method "campaignSubscriberActivity" without mandatory arguments': {
				topic: function (api) { api.campaignSubscriberActivity(this.callback) },
				'returns an error': function (error, data) {
					assert.instanceOf(error, Error);
				}
			},
	
			'and calling method "campaignSubscriberActivity" with all arguments': {
				topic: function (api) { api.campaignSubscriberActivity({ id: "12345", include_empty: "true" }, this.callback) },
				'exports subscriber activity for the requested campaign': function (error, data) {
					assert.isNull(error);
					assert.isArray(data);					
				}
			},

			'and calling method "campaignSubscriberActivity" with superflous arguments': {
				topic: function (api) { api.campaignSubscriberActivity({ id: "12345", include_empty: "true", superflous: "superflous" }, this.callback) },
				'exports subscriber activity for the requested campaign and superflous arguments are discarded': function (error, data) {
					assert.isNull(error);
					assert.isArray(data);
				}
			}

		}
		
	}

}).export(module);