import { connectDatabase } from "./config/db";
import { LeadModel } from "./models/lead.model";

const cities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Jaipur", "Hyderabad", "Gurugram"];
const services = ["Website Development", "SEO", "App Development", "Digital Marketing", "CRM Setup", "AI Chatbot"];
const statuses = ["New", "Interested", "Converted", "Rejected"];
const names = ["Rahul Sharma", "Priya Mehta", "Amit Verma", "Sneha Kapoor", "Karan Singh", "Neha Jain", "Aditya Rao", "Riya Das"];

async function seed() {
  await connectDatabase();
  await LeadModel.deleteMany({});

  const leads = Array.from({ length: 120 }).map((_, i) => ({
    name: names[i % names.length],
    mobile: `98765${String(10000 + i).slice(-5)}`,
    email: `lead${i + 1}@example.com`,
    city: cities[i % cities.length],
    service: services[i % services.length],
    budget: 10000 + (i % 20) * 5000,
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - i * 86400000),
    updatedAt: new Date(Date.now() - i * 86400000),
  }));

  await LeadModel.insertMany(leads);
  console.log("✅ Seeded 120 sample leads");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
