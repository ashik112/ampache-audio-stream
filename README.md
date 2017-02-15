Amplayer
=====================

An ampache mobile player using ionic framework.

## Using this project

We recommend using the `ionic` utility to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ sudo npm install -g ionic
```

Then run:

```bash
$ sudo npm install -g ionic
$ ionic start myProject tabs
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page.

## Server Installation

In order for this project to work, you need a working ampache server installed.
1. Set up a web server with apache/nginx and mysql
2. Head over to [Releases](https://github.com/ampache/ampache/releases) and download the latest release
3. Extract the downloaded archive to our web root directory
4. Access your web server via browser and continue the setup from there
5. For more info about the set, go to [Ampache Wiki](https://github.com/ampache/ampache/wiki)

## Development environment setup

To set up the dev env of this project:
1. Clone this repo
2. Make sure ionic is installed on your dev env
3. Update services.js' `server_url` to point to your web servers `xml.server.php` file
4. Run `ionic serve` to start a local development server for app dev and testing
5. For more info about ionic commands, just run `ionic`

## Issues
1. Shuffle and Repeat functions are still buggy