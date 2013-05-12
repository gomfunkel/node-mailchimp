var assert = require('assert'),
    vows = require('vows');

var MailChimpPartnerAPI = require('mailchimp').MailChimpPartnerAPI;

vows.describe('MailChimpPartnerAPI').addBatch({

	'Instantiating the MailChimp Partner API wrapper': {
		
		'without any arguments': {
			topic: function () { return new MailChimpPartnerAPI() },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'You have to provide an app key for this to work.');
			}
		},

		'with an app key': {
			topic: function () { return new MailChimpPartnerAPI('appKey-dc') },
			'successfully creates an instance': function (topic) {
				assert.isObject(topic);
				assert.strictEqual(topic.version, '1.3');
			}			
		},
		
		'without app key but with parameters': {
			topic: function () { return new MailChimpPartnerAPI({ version: '1.3' }) },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
			}			
		},		
	
		'with an app key and parameters': {
			topic: function () { return new MailChimpPartnerAPI('appKey-dc', { version: '1.3' }) },
			'successfully creates an instance': function (topic) {
				assert.isObject(topic);
				assert.strictEqual(topic.version, '1.3');
			}			
		},
		
		'with an app key and an unsupported version': {
			topic: function () { return new MailChimpPartnerAPI('appKey-dc', { version: '0.1' }) },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'Version 0.1 of the MailChimp Partner API is currently not supported.');
			}			
		}
		
	}

}).export(module);