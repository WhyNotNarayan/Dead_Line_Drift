require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Admin = mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("12345", 10);

  const admin = new Admin({
    email: "admin@gmail.com",
    password: hashedPassword
  });

  await admin.save();
  console.log("Admin Created");
  process.exit();
}

createAdmin();