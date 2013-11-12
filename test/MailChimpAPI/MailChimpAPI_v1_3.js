var assert = require('assert'),
    vows = require('vows'),
    nock = require('nock');

var apiEndpoint = nock('http://dc.api.mailchimp.com:80').post('/1.3/?method=folderAdd', encodeURIComponent(JSON.stringify({ apikey: "apiKey-dc", name: "foldername" })))
                                                        .reply(200, 123)
                                                        .post('/1.3/?method=folderAdd', encodeURIComponent(JSON.stringify({ apikey: "apiKey-dc" })))
                                                        .reply(200, '{"error":"You must specify a name value for the folderAdd method","code":-90}')
                                                        .post('/1.3/?method=folderAdd', encodeURIComponent(JSON.stringify({ apikey: "apiKey-dc", name: "foldername", type: "autoresponder" })))
                                                        .reply(200, 456)
                                                        .post('/1.3/?method=folderAdd', encodeURIComponent(JSON.stringify({ apikey: "apiKey-dc", name: "foldername", type: "autoresponder" })))
                                                        .reply(200, 789);

var MailChimpAPI = require('mailchimp').MailChimpAPI;

vows.describe('MailChimpAPI v1.3').addBatch({

	'MailChimpAPI v1.3 wrapper': {
		
		'when instantiated': {
			topic: function () { return new MailChimpAPI('apiKey-dc', { version : '1.3' }) },
			'successfully creates an instance': function (api) {
				assert.isObject(api);
				assert.strictEqual(api.version, '1.3');
			},
			
			/*** folderAdd ***/
			
			'and calling method "folderAdd" with mandatory arguments': {
				topic: function (api) { api.folderAdd({ name: "foldername" }, this.callback) },
				'creates the folder': function (error, data) {
					assert.isNull(error);
					assert.isNumber(data);
				}
			},
			
			'and calling method "folderAdd" without mandatory arguments': {
				topic: function (api) { api.folderAdd(this.callback) },
				'returns an error': function (error, data) {
					assert.instanceOf(error, Error);
				}
			},
			
			'and calling method "folderAdd" with all arguments': {
				topic: function (api) { api.folderAdd({ name: "foldername", type: "autoresponder" }, this.callback) },
				'creates the folder': function (error, data) {
					assert.isNull(error);
					assert.isNumber(data);					
				}
			},

			'and calling method "folderAdd" with superflous arguments': {
				topic: function (api) { api.folderAdd({ name: "foldername", type: "autoresponder", superflous: "superflous" }, this.callback) },
				'creates the folder and superflous arguments are discarded': function (error, data) {
					assert.isNull(error);
					assert.isNumber(data);
				}
			}

		}
		
	}

}).export(module);