var http = require('http'),
    https = require('http'),
    util = require('util'),
    url = require('url'),
    querystring = require('querystring'),
    EventEmitter = require('events').EventEmitter,
    fs = require('fs'),
    request = require('request');

/**
 * Provides functionality for OAuth2 authorization with MailChimp. A server is
 * set up that listens for requests from MailChimp that are made upon
 * successful user authentication. Using this server the whole workflow
 * necessary to authorize against MailChimp is made available.
 *
 * The workflow using this module in short is as follows. An example can be
 * found in the README.
 *
 *  1) Instatiate MailChimpOAuth.
 *  2) Send the user to the MailChimp login form using the url returned from
 *     MailChimpOAuth.getAuthorizeUri();
 *  3) Listen for the 'authed' event and pass MailChimpOAuth.api as th API key
 *     to whatever MailChimp API methods you want to use.
 *
 * Details on the process and further information on how to set everything up
 * are available in the MailChimp API docs.
 *
 * @see http://apidocs.mailchimp.com/oauth2/
 *
 * Available options are:
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
 * `authed` Emitted when the OAuth was completed successfully. Receives one argument which represents the API key that can be passed on to other API functionality.
 *
 * @param options Configuration options
 * @return Nothing. Emits an 'authed' event instead which indicates everything
 *         went fine
 */
function MailChimpOAuth(options) {

  var self = this;
  options = options || {};

  EventEmitter.call(this);

  this.httpPort = options.port || 8100;
  this.spawnServerFlag = options.ownServer || false;
  this.secure = options.secure || false;
  this.finalUri = options.finalUri || false;
  this.addPort = options.addPort || false;
  if (typeof options.clientId !== 'undefined') {
    this.clientId = options.clientId;
  } else {
    throw new Error('You have to specify the client id for this to work.');
  }

  if (typeof options.clientSecret !== 'undefined') {
    this.clientSecret = options.clientSecret;
  } else {
    throw new Error('You have to specify the client secret for this to work.');
  }

  if (typeof options.redirectUri !== 'undefined') {
    this.redirectUri = options.redirectUri;
  } else {
    throw new Error('You have to specify a uri for this server as MailChimp needs to reach it from the outside.');
  }

  try {
    var packageInfo = fs.readFileSync(__dirname + "/../../package.json");
  } catch (error) {
    throw new Error('Required package file package.json not found for this module.');
  }
    this.packageInfo = JSON.parse(packageInfo.toString());

    this.on('receivedCode', function (customParams) {
      self.getAccessToken(customParams);
    });

    this.on('receivedAccessToken', function (customParams) {
      self.getMetadata(customParams);
    });

    this.on('receivedMetadata', function (customParams) {
      self.emit('authed', customParams);
    });

    if (this.spawnServerFlag)
      this.spawnServer();

}

util.inherits(MailChimpOAuth, EventEmitter);
module.exports = MailChimpOAuth;

/**
 * Spawns a server that listens for incoming GET requests. The url to the
 * server is passed on to MailChimp as a get parameter to the authorization
 * form. When a request is received and valid the chain of authorization is set
 * in motion. This method should not be called directly but will be used
 * internally when needed.
 *
 * @return Nothing. Emits either an 'error' or a 'receivedCode' event
 */
MailChimpOAuth.prototype.spawnServer = function () {

  var self = this;
  var callback = function (request, response) {

    if (request.method != 'GET') {
      self.emit('error', {err: 'Received something other than a GET request.', data:undefined});
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.end();
      return;
    }

    var requestUrl = url.parse(request.url);
    var query = querystring.parse(requestUrl.query) || {};

    if (typeof query.code !== 'undefined') {
      self.emit('receivedCode', query);
      if (self.finalUri) {
        response.writeHead(302, {'Location': self.finalUri});
        response.end();
      } else {
        response.writeHead(204, {'Content-Type': 'text/plain'});
        response.end();
      }
    } else {
      self.emit('error', {err: 'Received a request without a code.', data:query});
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.end();
    }
  };
  var server;


  if (this.secure) {
    if (this.secure.key && this.secure.cert) {
      const options = {
        key: fs.readFileSync(this.secure.key),
        cert: fs.readFileSync(this.secure.cert)
      };
      server = https.createServer(options, callback);
    }
    else {
      throw new Error('You have to specify the complete ssl credentials for this to work.with key and code');
    }
  }

  else
    server = http.createServer(callback);

  server.listen(this.httpPort);

}

/**
 * handle response from
 * @return Nothing. Emits either an 'error' or a 'receivedCode' event
 */
MailChimpOAuth.prototype.handleOAuthResponse = function (customParams) {
  var self = this;
  customParams = customParams || {};
  if (typeof customParams.code !== 'undefined') {
    self.emit('receivedCode', customParams);
  } else {
    self.emit('error', {err: 'Received a request without a code.', data:customParams});
  }
};

/**
 * Assembles and returns a URI the user needs to be send to for authorization,
 * on that page the MailChimp login form is shown and the user prompted for his
 * username and password. The URI includes a link to the server spawned while
 * instantiating MailChimpOAuth.
 *
 * @return URI to the autorization page
 */
MailChimpOAuth.prototype.getAuthorizeUri = function () {

  var params = {
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.addPort ? this.redirectUri + ':' + this.httpPort : this.redirectUri
  };

  return 'https://login.mailchimp.com/oauth2/authorize?' + querystring.stringify(params);

}

/**
 * Get the access token from MailChimp once the code for a successful
 * authorization was received. When the access token was successfully received
 * an event is emitted which MailChimpOAuth is listening on to request the
 * OAuth metadata. This method should not be called directly but will be used
 * internally when needed.
 *
 * @return Nothing. Emits either an 'error' or a 'receivedAccessToken' event
 */
MailChimpOAuth.prototype.getAccessToken = function (customParams) {

  var self = this;
  customParams = customParams || {};
  if (!customParams.code) {
    self.emit('error', {err: 'Code is required in Params', data:customParams});
    return;
  }
  var params = {
    grant_type: 'authorization_code',
    client_id: this.clientId,
    client_secret: this.clientSecret,
    code: customParams.code,
    redirect_uri: this.addPort ? this.redirectUri + ':' + this.httpPort : this.redirectUri
  };

  request({
    uri: 'https://login.mailchimp.com/oauth2/token',
    method: 'POST',
    headers: {
      'User-Agent': 'node-mailchimp/' + this.packageInfo['version'],
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify(params)
  }, function (error, response, body) {

    var parsedResponse;

    if (error) {
      self.emit('error', {err: 'Unable to connect to the MailChimp OAuth service.', data:customParams});
    } else {

      try {
        parsedResponse = JSON.parse(body);
      } catch (error) {
        console.log('[MailChimp] Error parsing JSON answer from the MailChimp getAccessToken API.', body);
        self.emit('error', {err: 'Error parsing JSON answer from the MailChimp getAccessToken API.', data:customParams});
        return;
      }

      if (typeof parsedResponse.access_token !== 'undefined') {
        customParams.accessToken = parsedResponse.access_token;
        self.emit('receivedAccessToken', customParams);
      } else {
        self.emit('error', {err: 'Answer from MailChimp API does not contain an access token.', data:customParams});
      }

    }

  });

}

/**
 * Get metadata from MailChimp once the access token was received. When the
 * metadata was successfully received an event is emitted which MailChimpOAuth
 * is listening on to finalize the authentication process. This method should
 * not be called directly but will be used internally when needed.
 *
 * @return Nothing. Emits either an 'error' or a 'receivedMetadata' event
 */
MailChimpOAuth.prototype.getMetadata = function (customParams) {

  var self = this;
  customParams = customParams || {};
  if (!customParams.accessToken) {
    self.emit('error', {err: 'accessToken is required in Params', data:customParams});
    return;
  }
  request({
    uri: 'https://login.mailchimp.com/oauth2/metadata',
    headers: {
      'User-Agent': 'node-mailchimp/' + this.packageInfo['version'],
      'Authorization': 'OAuth ' + customParams.accessToken
    }
  }, function (error, response, body) {

    var parsedResponse;

    if (error) {
      self.emit('error', {err: 'Unable to connect to the MailChimp OAuth service.', data:customParams});
      return;
    } else {

      try {
        parsedResponse = JSON.parse(body);
      } catch (error) {
        console.error('[MailChimp] Error parsing JSON answer from the MailChimp getMetadata API.', body);
        self.emit('error', {err: 'Error parsing JSON answer from the MailChimp getMetadata API.', data:customParams});
        return;
      }

      if (typeof parsedResponse.dc !== 'undefined') {
        customParams.metadata = parsedResponse;
        customParams.apiKey = customParams.accessToken + '-' + customParams.metadata.dc;
        self.emit('receivedMetadata', customParams);
      } else {
        self.emit('error', {err: 'Answer from MailChimp API does not contain a datacenter pointer.', data:customParams});
      }

    }

  });

}