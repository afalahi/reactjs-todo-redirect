# React JS Todo Sample App with AuthZ Code Redirect

## Disclaimers

This sample code is provided "as is" and is not a supported product of ForgeRock. It's purpose is solely to demonstrate how the ForgeRock JavaScript SDK can be implemented within a React application. Also, this is not a demonstration of React itself or instructional for _how_ to build a React app. There are many aspects to routing, state management, tooling and other aspects to building a React app that are outside of the scope of this project. For information about creating a React app, [visit React's official documentation](https://reactjs.org/docs/create-a-new-react-app.html).

## Requirements

1. An instance of ForgeRock's Access Manager (AM), either within a ForgeRock's Identity Cloud tenant, your own private installation or locally installed on your computer
2. Node >= 14.2.0 (recommended: install via [official package installer](https://nodejs.org/en/))
3. Knowledge of using the Terminal/Command Line
4. Ability to generate security certs (recommended: mkcert ([installation instructions here](https://github.com/FiloSottile/mkcert#installation))
5. This project "cloned" to your computer

## Setup

Once you have the 5 requirements above met, we can build the project.

### Security Certificates

This project requires HTTPS (secure protocol) which means security (SSL/TLS) certificates are necessary. For local development, it's common to generate your own self-signed certificates. You're free to use any method to do this, but if you need assistance in generating your own certs, the following can be helpful:
> **Windows: You'll need to install openssl for the commands below to work you can use chocolaty to install it using `choco install openssl`**

```sh
# Generate your certificate key and create a new certificate request
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
```

The output of the second command will look like this:

```sh
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:
Email Address []:
```

For the `Common Name` enter `todos.example.com`. If you want to use a different `Common Name` then make sure you use the same value everywhere in this guide

Create an openssl extension file to include Subject Alternative Names, name the file `cert-ext.cnf`, and the contents of the file should be like this:

```text
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = DNS:todos.example.com, DNS:localhost, DNS:api.example.com
```

Generate your certificate

```sh
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem -extfile client_cert_ext.cnf
```

  (Ensure these two files are at the root of this project; you can name them whatever you want since you configure them in your `.env` file)

> **WARNING: Self-signed certificates or certificates not from an industry-recognized, certificate authority (CA) should never be used in production.**

### Setup Your AM Instance

#### Configure CORS

1. Allowed origins: `https://todos.example.com:443`
2. Allowed methods: `GET` `POST`
3. Allowed headers: `Content-Type` `X-Requested-With` `Accept-API-Version` `Authorization`
4. Allow credentials: enable

#### Create Your OAuth Clients

1. Create a public (SPA) OAuth client for the web app: no secret, scopes of `openid profile email`, implicit consent enabled, and no "token authentication endpoint method".
2. Create a confidential (Node.js) OAuth client for the API server: with a secret, default scope of `am-introspect-all-tokens`, and `client_secret_basic` as the "token authentication endpoint method".

#### Create your Authentication Journeys/Trees

1. Login

### Configure Your `.env` File

Change the name of `.env.example` to `.env` and replace the bracketed values (e.g. `<<<helper-text>>>`) with your values.

Example with annotations:

```text
AM_URL=https://example-am-instance.forgerock.com/am (include the /am)
APP_URL=https://todos.example.com:443 (your SPA's URL)
API_URL=https://api.example.com:9443 (your resource API server's URL)
DEBUGGER_OFF=false
DEVELOPMENT=true
SEC_KEY_FILE=cert.pem
SEC_CERT_FILE=key.pem
REALM_PATH=alpha
REST_OAUTH_CLIENT=sample-app-server (name of private OAuth 2.0 client/application)
REST_OAUTH_SECRET=secret (the secret for the private OAuth 2.0 client/application)
WEB_OAUTH_CLIENT=example-react-app (the name of the public OAuth 2.0 client/application)
```

### Installing Dependencies and Run Build

```sh
# Install all dependencies (no need to pass the -w option)
npm install

# Build this sample app project
npm run build
```

### Update Your `hosts` File

Now you'll need to update your `hosts` (`/etc/hosts` if on a Mac and `C:\Windows\System32\drivers\etc\hosts` on Windows) to allow for domain aliases:

#### For Mac

```sh
sudo vim /etc/hosts
```

```text
# hosts file aliases
127.0.0.1 todos.example.com api.example.com
```

#### For Windows (Elevated Command)

```powershell
Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value "`n#ForgeRock React Sample Todo`r127.0.0.1`ttodos.example.com`tapi.example.com" -Force
```

### Run the Servers

Now, run the below commands to start the processes needed for building the application and running the servers for both client and API server:

```sh
# To Start the app, in a terminal window, run the following watch command
# This starts the client and server
npm run start
```

```sh
# To run in dev mode, in a terminal window, start 'watching' the react source code
npm run watch
```

```sh
# In another terminal window, start the dev builds of app and server
npm run dev
```

Now, you should be able to visit `https://todos.example.com`, which is your web app or client (the Relying Party in OAuth terms). This client will make requests to your AM instance, (the Authorization Server in OAuth terms), which will be running on whatever domain you set, and `https://api.example.com:9443` as the REST API for your todos (the Resource Server).

### Trust Certs

#### Windows

Copy your `cert.pem` file and change the extension to `.crt`, so your file will be `cert.crt`. You'll end up with two files `cert.pem` and `cert.crt`. Double click the `cert.crt` file, and install it in your machine store as a trusted certificate authority

#### Mac

Using keychain access, you can double-click the certificates and install it in your personal store. You may need to change the extension to `.crt` if it doesn't work

## Learn About Integration Touchpoints

This project has a debugging statements that can be activated which causes the app to pause execution at each SDK integration point. It will have a comment above the `debugger` statement explaining the purpose of the integration.

If you'd like to use this feature as a learning tool, [open the live app](https://fr-react-todos.crbrl.io/) and then open the developer tools of your browser. Rerun the app with the developer tools open, and it will automatically pause at these points of integration.

For local development, if you want to turn these debuggers off, you can set the environment variable of `DEBUGGER_OFF` to true.

## Modifying This Project

### React Client

To modify the client portion of this project, you'll need to be familiar with the following React patterns:

1. [Functional components and composition](https://reactjs.org/docs/components-and-props.html)
2. [Hooks (including custom hooks)](https://reactjs.org/docs/hooks-intro.html)
3. [Context API](https://reactjs.org/docs/hooks-reference.html#usecontext)
4. [React Router](https://reactrouter.com/)

You'll also want a [basic understanding of Webpack](https://webpack.js.org/concepts/) and the following:

1. [Babel transformation for React](https://webpack.js.org/loaders/babel-loader/#root)
2. [Plugins for Sass-to-CSS processing](https://webpack.js.org/loaders/sass-loader/#root)

#### Styling and CSS

We heavily leveraged [Twitter Bootstrap](https://getbootstrap.com/) and [it's utility classes](https://getbootstrap.com/docs/5.0/utilities/api/), but you will see classes with the prefix `cstm_`. These are custom classes, hence the `cstm` shorthand, and they are explicitly used to denote an additional style application on top of Bootstrap's styling.

### REST API Server

To modify the API server, you'll need a [basic understanding of Node](https://nodejs.org/en/about/) as well as the following things:

1. [Express](https://expressjs.com/)
2. [PouchDB](https://pouchdb.com/)
3. [Superagent](https://www.npmjs.com/package/superagent)

## TypeScript?

The ForgeRock Javascript SDK is developed with TypeScript, so type definitions are available. This sample application does not utilize TypeScript, but if you'd like to see a version of this written in TypeScript, let us know.
