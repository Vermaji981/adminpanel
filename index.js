const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("node:dns");
const userRoutes = require("./routes/userRoutes");

const productRoutes = require("./routes/productRoutes");


dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
	try {
		await connectDB();
		next();
	} catch (error) {
		res.status(503).json({ message: "Database unavailable" });
	}
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "server is started"
  });
});
const PORT = process.env.PORT || 5000;

if (require.main === module) {
	connectDB()
		.then(() => {
			app.listen(PORT, () => {
				console.log(`Backend is running on port ${PORT}`);
			});
		})
		.catch(() => {
			console.error("Backend could not start because MongoDB is unavailable");
			process.exit(1);
		});
}

module.exports = app
