const path = require("path");
const {mix} = require("laravel-mix");

module.exports = function (opts) {

	/////////////////////////////////
	// Configuration
	/////////////////////////////////

	let options = {
		// enable/disable notifications
		notifications: false,

		// mix-manifest version
		version: false,

		// source maps
		sourceMaps: true,

		// process css urls (bugging sometimes in laravel)
		processCssUrls: false,

		// i/o
		entries: {},
		output: {},

		// vendor bundle
		extract: {},

		// autoload globals
		autoload: {},

		// path aliases
		aliases: {}
	};

	if (typeof opts === "string" || opts == undefined) {
		opts = require(path.join(process.cwd(), typeof opts === "string" ? opts : ".mixrc"));
	}

	if (typeof opts === "object" && opts != undefined) {
		Object.assign(options, opts);
	}

	/////////////////////////////////
	// Laravel mix configuration
	/////////////////////////////////

	// notifications
	if (options.notifications === false) {
		mix.disableNotifications();
	}

	// version
	if (options.version === true) {
		mix.version();
	}

	// source maps
	if (options.sourceMaps === true) {
		mix.sourceMaps();
	}

	// process css urls
	mix.options({processCssUrls: options.processCssUrls});

	// aliases
	if (typeof options.aliases === "object" && options.aliases != undefined) {
		let aliases = Object.keys(options.aliases).reduce((acc, alias) => {
			acc[alias] = path.resolve(process.cwd(), options.aliases[alias]);
			return acc;
		}, {});

		mix.webpackConfig({resolve: {alias: aliases}});
	}

	// vendors
	if (
		typeof options.extract === "object" &&
		options.extract != undefined &&
		typeof options.extract.path === "string" &&
		options.extract.modules instanceof Array &&
		options.extract.modules.length > 0
	) {
		mix.extract(options.extract.modules, options.extract.path);
	}

	// autoloads
	if (typeof options.autoload === "object" && options.autoload != undefined) {
		mix.autoload(options.autoload);
	}

	// i/o
	Object.keys(options.entries).forEach(task => {
		options.entries[task].forEach(source => mix[task](source, options.output[task]));
	});
};