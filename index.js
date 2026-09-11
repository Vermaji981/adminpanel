const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

const productRoutes = require("./routes/productRoutes");





const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

connectDB();

// app.get("/", (req, res) => {
//   res.json({
//     message: "server is started"
//   });
// });

// app.listen(5000, () => {
//   console.log("server");
// });

let isConnected = false ;

async function connectToMongoDB() {
      try {
        await mongoose.connect(process.env.MONGO_URI,{
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        isConnected = true;
        console.log("Connected to Mongodb")
        
      } catch (error) {
          console.log("Error connecting to Mongodb", error);        
      }  
}

// middleware
app.use((req, res, next)=>{
    if (!isConnected) {
      connectToMongoDB();
    }
    next();

});

// do not use app.listen for using versel

module.exports = app
