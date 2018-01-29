const path = require("path");
const fs = require("fs");
const {mix} = require("laravel-mix");

function requireJSON(path) {
	return JSON.parse(fs.readFileSync(path, "utf8"));
}

function getOptions(opts) {
	let options = requireJSON(path.join(__dirname, "blueprint.mixrc"));

	if (typeof opts === "string" || opts == undefined) {
		opts = requireJSON(path.join(process.cwd(), typeof opts === "string" ? opts : ".mixrc"));
	}

	if (typeof opts === "object" && opts != undefined) {
		Object.assign(options, opts);
	}
}

/**
 * Loader
 * @param string|object opts
 */
module.exports = function (opts) {
	const options = getOptions(opts);

	// Notifications are quite annoying under windows
	if (options.notifications === false) {
		mix.disableNotifications();
	}

	// Mix version through mix-manifest.json (useful with laravel)
	if (options.version === true) {
		mix.version();
	}

	// Source maps
	if (options.sourceMaps === true) {
		mix.sourceMaps();
	}

	// Process CSS Urls - buggy feature
	mix.options({processCssUrls: options.processCssUrls});

	// Path aliases
	if (typeof options.aliases === "object" && options.aliases != undefined) {
		let aliases = Object.keys(options.aliases).reduce((acc, alias) => {
			acc[alias] = path.resolve(process.cwd(), options.aliases[alias]);
			return acc;
		}, {});

		mix.webpackConfig({resolve: {alias: aliases}});
	}

	// Module autoload
	if (typeof options.autoload === "object" && options.autoload != undefined) {
		mix.autoload(options.autoload);
	}

	// Vendor extraction
	if (
		typeof options.extract === "object" &&
		options.extract != undefined &&
		typeof options.extract.path === "string" &&
		options.extract.modules instanceof Array &&
		options.extract.modules.length > 0
	) {
		mix.extract(options.extract.modules, options.extract.path);
	}

	// Input / Output
	Object.keys(options.entries).forEach(task => {
		options.entries[task].forEach(source => mix[task](source, options.output[task]));
	});
};