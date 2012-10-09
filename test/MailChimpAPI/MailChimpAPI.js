var assert = require('assert'),
    vows = require('vows');

var MailChimpAPI = require('mailchimp').MailChimpAPI;

vows.describe('MailChimpAPI').addBatch({

	'Instantiating the MailChimp API wrapper': {
		
		'without any arguments': {
			topic: function () { return new MailChimpAPI() },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'You have to provide an API key for this to work.');
			}
		},

		'with an API key': {
			topic: function () { return new MailChimpAPI('apiKey-dc') },
			'successfully creates an instance': function (topic) {
				assert.isObject(topic);
				assert.strictEqual(topic.version, '1.3');
			}			
		},
		
		'without API key but with parameters': {
			topic: function () { return new MailChimpAPI({ version: '1.3' }) },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
			}			
		},		
	
		'with an API key and parameters': {
			topic: function () { return new MailChimpAPI('apiKey-dc', { version: '1.3' }) },
			'successfully creates an instance': function (topic) {
				assert.isObject(topic);
				assert.strictEqual(topic.version, '1.3');
			}			
		},
		
		'with an API key and an unsupported version': {
			topic: function () { return new MailChimpAPI('apiKey-dc', { version: '0.1' }) },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'Version 0.1 of the MailChimp API is currently not supported.');
			}			
		}
		
	}

}).export(module);