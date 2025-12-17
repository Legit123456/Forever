const required = ["MONGODB_URI", "JWT_SECRET"];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});