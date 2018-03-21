const path = require("path");
const fs = require("fs");
const {mix} = require("laravel-mix");
const configFiles = [".local.mixrc", ".mixrc.local", ".mixrc"];

function requireJSON(path) {
	return JSON.parse(fs.readFileSync(path, "utf8"));
}

function guessPublicDirectory(directory) {
	if (typeof directory === "string") {
		return directory;
	}

	// Laravel
	if (fs.existsSync(path.join(process.cwd(), "public"))) {
		return "public";
	}

	// Other setups
	return "";
}

function guessConfigFile() {
	let path;

	for (let i = 0; i < configFiles.length; i++) {
		path = path.join(process.cwd(), configFiles[i]);

		if (fs.existsSync(path)) {
			return path;
		}
	}
}

function getOptions(opts) {
	let options = requireJSON(path.join(__dirname, "blueprint.mixrc"));

	if (typeof opts === "string") {
		opts = requireJSON(path.join(process.cwd(), opts));
	}
	else if (opts == undefined) {
		const configFile = guessConfigFile();

		if (configFile) {
			opts = requireJSON(configFile);
		}
	}

	if (typeof opts === "object" && opts != undefined) {
		Object.assign(options, opts);
	}

	return options;
}

/**
 * Loader
 * @param string|object opts
 */
module.exports = function (opts) {
	const options = getOptions(opts);

	// Public path
	mix.setPublicPath(guessPublicDirectory(options.publicDirectory));

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