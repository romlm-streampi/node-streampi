const path = require("path");
const { readdirSync } = require("fs");

function GetPlugins(rootDir = path.resolve(__dirname, "..", "plugins", "scripts")) {
	const files = readdirSync(rootDir);
	const plugins = {};
	for (let file of files) {
		const plugin = require(path.resolve(rootDir, file));
		plugins[file] = plugin;
	}

	return plugins;
}

module.exports = { GetPlugins };