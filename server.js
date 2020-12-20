const express = require("express");
const next = require("next");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const app = next({ dev });
const handle = app.getRequestHandler();

const LAYOUT_STORING_PATH = __dirname + "/storage/layout.json";

// TODO : implement real script fetching
const getPlugins = (folder) => {
	const plugins = [];
	try {
		const files = fs.readdirSync(folder)

		files.forEach((file) => {
			const plugin = require(`${folder}/${file}`.replace("//", "/"));
			// plugins.push(...plugin);
		});
	} catch (err) {
		console.error(err);
	}

	return plugins;

}

const scripts = getPlugins(__dirname + "/storage/plugins");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/resources/icons");
	},
	filename: (req, file, cb) => {
		cb(null, Buffer.from([file.originalname, Date.now()].join("_")).toString("base64") + ".png");
	}
})

const upload = multer({ storage });

app.prepare().then(() => {
	const server = express();

	server.use(cors())
	server.use(bodyParser.urlencoded({ extended: true }));
	server.use(bodyParser.json());

	server.use((req, res, forward) => {
		const { headers } = req
		if (headers["api-key"] === "hello") {
			forward();
		}
		else {
			res.status(403).send("missing or invalid api-key header");
		}
	})

	server.get(['', '/admin'], (req, res) => {
		return app.render(req, res, "/admin", req.query);
	})

	server.get('/client', (req, res) => app.render(req, res, "/client", req.query))

	server.post("/api/image", upload.single("image"), (req, res, forward) => {

		if (req.file) {
			res.json(JSON.stringify({ path: req.file.filename }));
		} else {
			res.status(400).send("bad file type given in form")
		}

		forward();
	});

	server.delete("/api/image/:name", (req, res) => {
		const { name } = req.params;

		fs.unlink(`public/resources/icons/${name}`, (err) => {
			if (err) {
				res.status(500).end();
			} else {
				res.status(200).end();
			}
		})
	})

	server.get("/api/scripts", (req, res) => {
		console.log(scripts)
		res.json(scripts.map(({ category, name, parameters }) => ({ category, name, parameters })));
	});

	server.post("/api/scripts", (req, res) => {
		const data = req.body;

		const funcs = scripts.filter(({ category, name }) => (category === data.category && name === data.name)).map(({ func }) => (func));
		if (funcs.length === 1) {
			const params = {};
			data.parameters.map(({ name, value }) => { params[name] = value })

			res.status(200).json({ success: funcs[0](params) })
		} else {
			res.status(404).end();
		}

	})

	server.get("/api/layout", (_req, res) => {

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

	server.post("/api/layout", (req, res) => {
		const data = req.body;
		fs.writeFile(LAYOUT_STORING_PATH, JSON.stringify(data), (err) => {
			if (err) {
				res.status(500).send("could not save file");
			} else {
				res.status(201).end();
			}

		});

	})

	// serving default react pages
	server.get("*", (req, res) => handle(req, res));

	server.listen(port, (err) => {
		if (err)
			throw err;
		console.log(`> server started at http://localhost:${port}`);
	})
})
