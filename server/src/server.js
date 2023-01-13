const http = require("http");
require("dotenv").config();
const { app } = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");
const { connectMongo } = require("./services/mongo");

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

async function startServer() {
  await connectMongo();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

startServer();
