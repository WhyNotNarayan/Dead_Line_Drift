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

async function updatePassword() {
  const newPassword = "narayan@#2006"; // 👈 CHANGE THIS

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const admin = await Admin.findOneAndUpdate(
    { email: "admin@gmail.com" },
    { password: hashedPassword }
  );

  if (admin) {
    console.log("✅ Password Updated Successfully");
  } else {
    console.log("❌ Admin not found");
  }

  process.exit();
}

updatePassword();