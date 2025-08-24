// MongoDB initialization script for Farm Management System
db = db.getSiblingDB('farm_system');

// Create application user
db.createUser({
  user: 'farm_app',
  pwd: 'farm_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'farm_system'
    }
  ]
});

// Create collections with validation schemas
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 8
        },
        role: {
          bsonType: 'string',
          enum: ['admin', 'manager', 'worker']
        }
      }
    }
  }
});

db.createCollection('farms');
db.createCollection('livestock');
db.createCollection('animalProducts');
db.createCollection('sales');
db.createCollection('customers');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.farms.createIndex({ owner: 1 });
db.farms.createIndex({ location: '2dsphere' });
db.livestock.createIndex({ farmId: 1 });
db.livestock.createIndex({ species: 1 });
db.animalProducts.createIndex({ farmId: 1 });
db.animalProducts.createIndex({ productType: 1 });
db.sales.createIndex({ farmId: 1 });
db.sales.createIndex({ createdAt: -1 });
db.customers.createIndex({ email: 1 }, { unique: true });

// Insert sample data
db.users.insertOne({
  _id: ObjectId(),
  email: 'admin@farm-system.com',
  password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDjS', // password: admin123
  role: 'admin',
  firstName: 'System',
  lastName: 'Administrator',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialization completed successfully!');
print('Created database: farm_system');
print('Created user: farm_app');
print('Created collections with indexes');
print('Inserted sample admin user: admin@farm-system.com / admin123');
