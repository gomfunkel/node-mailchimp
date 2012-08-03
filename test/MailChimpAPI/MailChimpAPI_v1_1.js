var assert = require('assert'),
    vows = require('vows'),
    nock = require('nock');

var apiEndpoint = nock('http://dc.api.mailchimp.com:80').post('/1.1/?output=json&method=inlineCss', { apikey: "apiKey-dc" })
                                                        .reply(200, '{"error":"You must specify a html value for the inlineCss method","code":-90}')
                                                        .post('/1.1/?output=json&method=inlineCss', { apikey: "apiKey-dc", html: "<html><head><style>body { background-color: #f00; }</style></head><body></body></html>" })
                                                        .reply(200, "\"<html><head><style>body { background-color: #f00; }<\\/style><\\/head><body style=\\\"background-color: #f00;\\\"><\\/body><\\/html>\"")
                                                        .post('/1.1/?output=json&method=inlineCss', { apikey: "apiKey-dc", html: "<html><head><style>body { background-color: #f00; }</style></head><body></body></html>", strip_css: "true" })
                                                        .reply(200, "\"<html><head><\\/head><body style=\\\"background-color: #f00;\\\"><\\/body><\\/html>\"")
                                                        .post('/1.1/?output=json&method=inlineCss', { apikey: "apiKey-dc", html: "<html><head><style>body { background-color: #f00; }</style></head><body></body></html>", strip_css: "true" })
                                                        .reply(200, "\"<html><head><\\/head><body style=\\\"background-color: #f00;\\\"><\\/body><\\/html>\"");

var MailChimpAPI = require('mailchimp').MailChimpAPI;

vows.describe('MailChimpAPI v1.1').addBatch({

	'MailChimpAPI v1.1 wrapper': {
		
		'when instantiated': {
			topic: function () { return new MailChimpAPI('apiKey-dc', { version : '1.1' }) },
			'successfully creates an instance': function (api) {
				assert.isObject(api);
				assert.strictEqual(api.version, '1.1');
			},
			
			/*** inlineCss ***/
			
			'and calling method "inlineCss" with mandatory arguments': {
				topic: function (api) { api.inlineCss({ html: "<html><head><style>body { background-color: #f00; }</style></head><body></body></html>" }, this.callback) },
				'returns html with inline CSS': function (error, data) {
					assert.isNull(error);
					assert.isString(data);
				}
			},
			
			'and calling method "inlineCss" without mandatory arguments': {
				topic: function (api) { api.inlineCss(this.callback) },
				'returns an error': function (error, data) {
					assert.instanceOf(error, Error);
				}
			},
	
			'and calling method "inlineCss" with all arguments': {
				topic: function (api) { api.inlineCss({ html: "<html><head><style>body { background-color: #f00; }</style></head><body></body></html>", strip_css: "true" }, this.callback) },
				'returns html with inline CSS': function (error, data) {
					assert.isNull(error);
					assert.isString(data);					
				}
			},

			'and calling method "inlineCss" with superflous arguments': {
				topic: function (api) { api.inlineCss({ html: "<html><head><style>body { background-color: #f00; }</style></head><body></body></html>", strip_css: "true", superflous: "superflous" }, this.callback) },
				'returns html with inline CSS and superflous arguments are discarded': function (error, data) {
					assert.isNull(error);
					assert.isString(data);
				}
			}

		}
		
	}

}).export(module);