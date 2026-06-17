import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing users (optional - comment out to keep existing data)
    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    const demoUsers = [
      {
        name: "Admin Demo",
        email: "admin@gloveracademy.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Instructor Demo",
        email: "instructor@gloveracademy.com",
        password: "instructor123",
        role: "instructor",
      },
      {
        name: "Learner Demo",
        email: "learner@gloveracademy.com",
        password: "learner123",
        role: "learner",
      },
    ];

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      demoUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Seeded ${createdUsers.length} demo users`);

    createdUsers.forEach((user) => {
      console.log(`   📧 ${user.email} (${user.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();