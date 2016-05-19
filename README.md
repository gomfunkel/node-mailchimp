# node-mailchimp

A node.js wrapper for the MailChimp API.

_node-mailchimp_ exposes the following features of the MailChimp API to your node.js application:

 * MailChimp API (Versions 2.0, 1.3, 1.2 and 1.1)
 * MailChimp Export API (Version 1.0)
 * MailChimp Webhooks
 * MailChimp OAuth2 authorization
 * MailChimp Partner API (Version 1.3)
 * Mandrill API (Version 1.0)

Further information on the MailChimp API and its features is available at [http://apidocs.mailchimp.com](http://apidocs.mailchimp.com). If you want to know more about the Mandrill API and its features have a look at [https://mandrillapp.com/api/docs/](https://mandrillapp.com/api/docs/).

## Table of Contents

 * [Installation](#installation)
 * [Usage](#usage)
   * [MailChimp API (when using MailChimp API version 2.0)](#mailchimp-api-when-using-mailchimp-api-version-20)
   * [MailChimp API (when using MailChimp API version 1.x)](#mailchimp-api-when-using-mailchimp-api-version-1x)
   * [MailChimp Export API](#mailchimp-export-api)
   * [MailChimp Webhooks](#mailchimp-webhooks)
   * [MailChimp OAuth2](#mailchimp-oauth2)
   * [MailChimp Partner API](#mailchimp-partner-api)
   * [Mandrill API](#mandrill-api)
   * [MailChimp STS API](#mailchimp-sts-api)
 * [License](#license)

## Installation

Installing using npm (node package manager):

    npm install mailchimp

If you don't have npm installed or don't want to use it:

    cd ~/.node_libraries
    git clone git://github.com/gomfunkel/node-mailchimp.git mailchimp

Please note that parts of _node-mailchimp_ depend on [request](http://github.com/mikeal/request) by [Mikeal Rogers](http://github.com/mikeal). This library needs to be installed for the API and Export API to work. Additionally [node-querystring](http://github.com/visionmedia/node-querystring) is needed for the Webhooks to work. If you are using npm all dependencies should be automagically resolved for you.

## Usage

Information on how to use the MailChimp APIs can be found below. Further information on the API methods available can be found at [http://apidocs.mailchimp.com](http://apidocs.mailchimp.com). You can also find further information on how to obtain an API key, how to set up Webhooks and/or OAuth2 in your MailChimp account and much more on the MailChimp API pages.

Some methods of the MailChimp API take associative arrays as a parameter, for example the parameter `merge_vars` of the [`listSubscribe`](http://apidocs.mailchimp.com/api/1.3/listsubscribe.func.php) method. As there are no associative arrays in JavaScript you simply use an object with its properties being the keys, like in the following example:

```javascript
var merge_vars = {
	EMAIL: '/* E-MAIL ADDRESS */',
	FNAME: '/* FIRST NAME */',
	LNAME: '/* LAST NAME */'
};
```

### MailChimp API (when using MailChimp API version 2.0)

__Attention__: Support for v2.0 of the MailChimp API is not yet well tested. Please use with caution. When in doubt, stick to older versions of the API (v1.x) and skip to the next chapter for documentation.

_MailChimpAPI_ takes two arguments. The first argument is your API key, which you can find in your MailChimp Account. The second argument is an options object which can contain the following options:

 * `version` The API version to use (1.1, 1.2, 1.3 or 2.0). Defaults to 1.3. Make sure to explicitly use 2.0 here or refer to the next chapter for documentation on older API versions.
 * `userAgent` Custom User-Agent description to use in the request header.

All of the API categories and methods described in the MailChimp API v2.0 Documentation ([http://apidocs.mailchimp.com/api/2.0](http://apidocs.mailchimp.com/api/2.0) are available in this wrapper. To use them the method `call` is used which takes four parameters:

 * `section` The section of the API method to call (e.g. 'campaigns').
 * `method` The method to call in the given section.
 * `params` Parameters to pass to the API method.
 * `callback` Callback function for returned data or errors with two parameters. The first one being an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

Example:

```javascript
var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = 'Your MailChimpAPI API Key';

try {
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}

api.call('campaigns', 'list', { start: 0, limit: 25 }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});

api.call('campaigns', 'template-content', { cid: '/* CAMPAIGN ID */' }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```

### MailChimp API (when using MailChimp API version 1.x)

_MailChimpAPI_ takes two arguments. The first argument is your API key, which you can find in your MailChimp Account. The second argument is an options object which can contain the following options:

 * `version` The API version to use (1.1, 1.2, 1.3 or 2.0). Defaults to 1.3.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.

The callback function for each API method gets two arguments. The first one is an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

Example:

```javascript
var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = 'Your MailChimp API Key';

try {
    var api = new MailChimpAPI(apiKey, { version : '1.3', secure : false });
} catch (error) {
    console.log(error.message);
}

api.campaigns({ start: 0, limit: 25 }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});

api.campaignStats({ cid : '/* CAMPAIGN ID */' }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```

### MailChimp Export API

_MailChimpExportAPI_ takes two arguments. The first argument is your API key, which you can find in your MailChimp Account. The second argument is an options object which can contain the following options:

 * `version` The Export API version to use, currently only 1.0 is available and supported. Defaults to 1.0.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.

The callback function for each API method gets two arguments. The first one is an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

Example:

```javascript
var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI;

var apiKey = 'Your MailChimp API Key';

try {
    var exportApi = new MailChimpExportAPI(apiKey, { version : '1.0', secure: false });
} catch (error) {
    console.log(error.message);
}

exportApi.list({ id : '/* LIST ID */'  }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```

### MailChimp Webhooks

_MailChimpWebhook_ takes one argument, an options object which can contain the following options:

 * `port` The port the server is going to listen on. Defaults to 8100.
 * `secret` Secret key as suggested on the Webhook page which is then simply added as a pathname to the Webhook URL in your MailChimp account and checked for. Nothing too fancy but a small enhancement to security. Leave empty (default setting) if you don't want to use a secret key. Example: If you set the secret to 'ChimpSecret' you need to enter the Webhook URL http://www.yourdomain.com/ChimpSecret in the MailChimp Webhook settings.
 * `secure` Credentials as generated by the crypto module. If present HTTPS support is enabled for the server. Defaults to false.

You can register the following events. The callback function for each of these events receive two arguments. The first argument is an object with the information retrieved, the second argument contains metadata like when the event occurred.

 * `subscribe` Emitted when someone subscribes to your list.
 * `unsubscribe` Emitted when someone unsubscribes from your list.
 * `profile` Emitted when someone updates his profile.
 * `upemail` Emitted when someone changes his email address. Please note that you will receive a `profile` event at the same time.
 * `cleaned` Emitted when an email address is cleaned from you list.
 * `campaign` Emitted when a campaign is sent for your list.

Example:

```javascript
var MailChimpWebhook = require('mailchimp').MailChimpWebhook;

var webhook = new MailChimpWebhook();

webhook.on('error', function (error) {
    console.log(error.message);
});

webhook.on('subscribe', function (data, meta) {
    console.log(data.email+' subscribed to your newsletter!'); // Do something with your data!
});

webhook.on('unsubscribe', function (data, meta) {
    console.log(data.email+' unsubscribed from your newsletter!'); // Do something with your data!
});
```

### MailChimp OAuth2

_MailChimpOAuth_ takes one argument, an options object which can contain the following options:

 * `clientId` The clientId can be obtained from MailChimp, please refer to the API docs on how to do this. The clientId is a required parameter.
 * `clientSecret` The clientSecret can be obtained from MailChimp, please refer to the API docs on how to do this. The clientSecret is a required parameter. 
 * `redirectUri` Redirect URI from MailChimp App Configuration
 * `ownServer` Boolean to enable own custom server for listening to redirect URI. Defaults to false.
 * `addPort` Boolean to add value of port number in redirectUri defaults to false.
 * `port` The port the server is going to listen on. Defaults to 8100.
These fields are not needed if ownServer is false 
 * `finalUri` After a successful authorization on the MailChimp website the user is redirected to this URI, if any.
 * `secure` Credentials in the form {key:path to ssl key file, cert: path to ssl certificate file} . If present HTTPS support is enabled for the server. Defaults to false.

You can register the following events:
 * `error` This event is emitted when an error occured and receives one argument that contains the error message.
 * `authed` Emitted when the OAuth was completed successfully. Receives one argument which represents the API key in custom object with metadata that can be passed on to other API functionality.

Example:

```javascript
var MailChimpOAuth = require('mailchimp').MailChimpOAuth;
var MailChimpAPI = require('mailchimp').MailChimpAPI;

var options = {
	clientId: 'Your MailChimp client id',
	clientSecret: 'Your MailChimp client secret',
	redirectUri: 'http://www.example.com',
	ownServer: true,
	addPort: true,
	finalUri: 'http://www.example.com/successfulLogin.html'
};

var oauth = new MailChimpOAuth(options);

console.log(oauth.getAuthorizeUri()); // The MailChimp login URI the user needs to be sent to
<!-- Error contains custom Data when passed around to know the current status-->
oauth.on('error', function (error) {
    console.log(error.err);
});

oauth.on('authed', function (data) {

	try {
	    var api = new MailChimpAPI(data.apiKey, { version : '1.3', secure : false });
	} catch (error) {
	    console.log(error.message);
	}

    api.campaigns({ start: 0, limit: 25 }, function (error, data) {
        if (error)
            console.log(error.message);
        else
            console.log(JSON.stringify(data)); // Do something with your data!
    });

});
```

### MailChimp Partner API

_MailChimpPartnerAPI_ takes two arguments. The first argument is your app key, which you can generate and find in your MailChimp Account, if you are eligible to use the Partner API. The second argument is an options object which can contain the following options:

 * `version` The Partner API version to use, currently only 1.3 is available and supported. Defaults to 1.3.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.

The callback function for each API method gets two arguments. The first one is an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

Example:

```javascript
var MailChimpPartnerAPI = require('mailchimp').MailChimpPartnerAPI;

var appKey = 'Your MailChimp app key';

try {
    var api = new MailChimpPartnerAPI(appKey, { version : '1.3', secure : false });
} catch (error) {
    console.log(error.message);
}

api.checkUsername({ username: '/* USERNAME */' }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```

### Mandrill API

_MandrillAPI_ takes two arguments. The first argument is your API key, which you can find in your Mandrill Account. The second argument is an options object which can contain the following options:

 * `version` The Mandrill API version to use, currently only 1.0 is available and supported. Defaults to 1.0.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.

All of the API categories and methods described in the Mandrill API Documentation ([https://mandrillapp.com/api/docs/](https://mandrillapp.com/api/docs/)) are available in this wrapper. To use the the method `call` is used which takes four parameters:

 * `category` The category of the API method to call (e.g. 'users').
 * `method` The method to call in the given category.
 * `params` Parameters to pass to the API method.
 * `callback` Callback function for returned data or errors with two parameters. The first one being an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

```javascript
var MandrillAPI = require('mailchimp').MandrillAPI;

var apiKey = 'Your Mandrill API Key';

try {
    var mandrill = new MandrillAPI(apiKey, { version : '1.0', secure: false });
} catch (error) {
    console.log(error.message);
}

mandrill.call('tags', 'time-series', { tag : '/* TAGNAME */'  }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```

### MailChimp STS API

_MailChimpSTSAPI_ is no longer part of this wrapper as of version 1.0.1 because the API was discontinued by MailChimp.

## License

_node-mailchimp_ is licensed under the MIT License. (See LICENSE)
