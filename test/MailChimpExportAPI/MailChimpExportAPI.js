var assert = require('assert'),
    vows = require('vows');

var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI;

vows.describe('MailChimpExportAPI').addBatch({

	'Instantiating the MailChimp Export API wrapper': {
		
		'without any arguments': {
			topic: function () { return new MailChimpExportAPI() },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'You have to provide an API key for this to work.');
			}
		},

		'with an API key': {
			topic: function () { return new MailChimpExportAPI('apiKey-dc') },
			'successfully creates an instance': function (topic) {
				assert.isObject(topic);
				assert.strictEqual(topic.version, '1.0');
			}			
		},
		
		'without API key but with parameters': {
			topic: function () { return new MailChimpExportAPI({ version: '1.0' }) },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
			}			
		},		
	
		'with an API key and parameters': {
			topic: function () { return new MailChimpExportAPI('apiKey-dc', { version: '1.0' }) },
			'successfully creates an instance': function (topic) {
				assert.isObject(topic);
				assert.strictEqual(topic.version, '1.0');
			}			
		},
		
		'with an API key and an unsupported version': {
			topic: function () { return new MailChimpExportAPI('apiKey-dc', { version: '0.1' }) },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'Version 0.1 of the MailChimp Export API is currently not supported.');
			}			
		}
		
	}

}).export(module);