const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const multer = require("multer");
const fs = require("fs");
const { GetPlugins } = require("./server-model/plugins");


const plugins = GetPlugins();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, forward) => {
	const { headers } = req
	if (headers["api-key"] === "hello") {
		forward();
	}
	else {
		res.status(403).send("missing or invalid api-key header");
	}
});

const LAYOUT_STORING_PATH = __dirname + "/storage/layout.json";
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "storage/images/");
	},
	filename: (_req, file, cb) => {
		cb(null, Buffer.from([file.originalname, Date.now()].join("_")).toString("base64") + ".png");
	}
})

const upload = multer({ storage });

app.post("/api/image", upload.single("image"), (req, res, forward) => {

	if (req.file) {
		res.json(JSON.stringify({ path: req.file.filename }));
	} else {
		res.status(400).send("bad file type given in form")
	}

	forward();
});

app.delete("/api/image/:name", (req, res) => {
	const { name } = req.params;

	fs.unlink(`public/resources/icons/${name}`, (err) => {
		if (err) {
			res.status(500).end();
		} else {
			res.status(200).end();
		}
	})
});

app.get('/api/names', (_req, res) => res.json(Object.keys(plugins)));

app.get("/api/layout", (_req, res) => {

	fs.readFile(LAYOUT_STORING_PATH, (err, data) => {
		if (err) {
			res.status(500).send("could not retrieve file");
		} else {
			if (data.length > 0)
				res.json(JSON.parse(data.toString()))
			else
				res.json({});
		}
	});

});

app.post("/api/layout", (req, res) => {
	const data = req.body;
	fs.writeFile(LAYOUT_STORING_PATH, JSON.stringify(data), (err) => {
		if (err) {
			res.status(500).send("could not save file");
		} else {
			res.status(201).end();
		}

	});

})

app.use("/assets", express.static(path.join(__dirname, "dist")));
app.use("/resources", express.static(path.resolve(__dirname, "storage", "images")));

app.post('/api/scripts/:moduleName/:scriptId', (req, res) => {

	console.log(plugins);

	const { moduleName, scriptId } = req.params;
	const plugin = plugins[moduleName];
	const params = req.body;

	if (plugin && plugin.scripts && plugin.scripts[scriptId]) {
		const script = plugin.scripts[scriptId];
		try {
			res.json(script(params));

		} catch (err) {
			res.status(500).end();
		}
	} else {
		res.status(404).end();
	}
	res.end();

});

app.get('/api/providers/:moduleName/:providerName', (req, res) => {
	const { moduleName, providerName } = req.params;
	const plugin = plugins[moduleName];

	if (plugin && plugin.providers && plugin.providers[providerName]) {
		const provider = plugin.providers[providerName];
		try {
			res.json(provider());

		} catch (err) {
			res.status(500).end();
		}
	} else {
		res.status(404).end();
	}
	res.end();
});


app.get(['/', "/client", "/admin"], (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(3000, () => console.log("successfully started server at localhost:3000"));

