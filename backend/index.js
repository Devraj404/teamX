import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import publicTripRoutes from "./routes/publicTripRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("GlobeTrotter API");
});

app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/public/trips", publicTripRoutes);
app.use("/api/trips", tripRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
