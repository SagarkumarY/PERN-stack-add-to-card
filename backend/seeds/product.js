// import { sql } from "../config/db.js";
// import readline from "readline";

// const SAMPLE_PRODUCTS = [
//   { name: "Premium Wireless Headphones", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60" },
//   { name: "Mechanical Gaming Keyboard", price: 159.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60" },
//   { name: "Smart Watch Pro", price: 249.99, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60" },
//   { name: "4K Ultra HD Camera", price: 899.99, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60" },
//   { name: "Minimalist Backpack", price: 79.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60" },
//   { name: "Wireless Gaming Mouse", price: 89.99, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60" },
//   { name: "Smart Home Speaker", price: 159.99, image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=60" },
//   { name: "LED Gaming Monitor", price: 449.99, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60" },
// ];

// async function seedDatabase() {
//   try {
//     console.log("🔄 Resetting and seeding the database...");

//     // ✅ Efficiently delete old data and reset IDs
//     await sql`DELETE FROM products`;
//     await sql`ALTER SEQUENCE products_id_seq RESTART WITH 1`;

//     // ✅ Bulk insert all products at once
//     await sql`
//       INSERT INTO products (name, price, image)
//       VALUES ${sql(SAMPLE_PRODUCTS.map(p => [p.name, p.price, p.image]))}
//     `;

//     console.log("✅ Database seeded successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error seeding database:", error);
//     process.exit(1);
//   }
// }

// // ✅ Add confirmation prompt before running
// const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// rl.question("⚠️ Are you sure you want to reset and seed the database? (yes/no): ", async (answer) => {
//   if (answer.toLowerCase() !== "yes") {
//     console.log("❌ Seeding aborted.");
//     process.exit(0);
//   }
  
//   await seedDatabase();
//   rl.close();
// });

import { sql } from "../config/db.js";

const SAMPLE_PRODUCTS = [
  {
    name: "Premium Wireless Headphones",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Smart Watch Pro",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "4K Ultra HD Camera",
    price: 899.99,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Minimalist Backpack",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Wireless Gaming Mouse",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Smart Home Speaker",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "LED Gaming Monitor",
    price: 449.99,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
  },
];

async function seedDatabase() {
  try {
    // first, clear existing data
    await sql`TRUNCATE TABLE products RESTART IDENTITY`;

    // insert all products
    for (const product of SAMPLE_PRODUCTS) {
      await sql`
        INSERT INTO products (name, price, image)
        VALUES (${product.name}, ${product.price}, ${product.image})
      `;
    }

    console.log("Database seeded successfully");
    process.exit(0); // success code
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // failure code
  }
}

seedDatabase();