import { db } from './src/infrastructure/database/db.singleton';

async function seed() {
  console.log('Seeding database...');

  // 1. Create a Default User
  const user = await db.user.upsert({
    where: { email: 'admin@mobilestore.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@mobilestore.com',
      password: 'password123',
      role: 'ADMIN'
    }
  });

  // 2. Create a Default Customer
  const customer = await db.customer.create({
    data: {
      name: 'Walk-in Customer',
      phone: '0000000000',
      email: 'walkin@example.com'
    }
  });

  // 3. Create initial Products
  await db.product.createMany({
    data: [
      { name: 'iPhone 15 Pro', brand: 'Apple', price: 999.99, stock: 10 },
      { name: 'Galaxy S24 Ultra', brand: 'Samsung', price: 1199.99, stock: 5 },
      { name: 'Pixel 8 Pro', brand: 'Google', price: 899.99, stock: 8 },
      { name: 'AirPods Pro 2', brand: 'Apple', price: 249.99, stock: 20 }
    ]
  });

  console.log('Seeding complete!');
  console.log(`User ID: ${user.id}`);
  console.log(`Customer ID: ${customer.id}`);
}

seed()
  .catch(e => console.error(e))
  .finally(async () => {
    // In this script we don't have the db manager exactly the same way
    // but the singleton handles it.
  });
