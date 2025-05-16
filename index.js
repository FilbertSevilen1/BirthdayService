const express = require('express');
const app = express();

const db = require('./config');

db.then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());

const routers = require("./routers");
app.use("/api/users", routers.user_routers)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
