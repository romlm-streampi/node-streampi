module.exports = {
	env: {
	  ROOT: __dirname,
	  API_KEY: "hello",
	  BASE_URL: `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`
	},
	useFileSystemPublicRoutes: false,
  }