// In-memory database fallback for testing without MongoDB
const bcrypt = require('bcryptjs');

class MemoryDB {
  constructor() {
    this.users = [];
    this.services = [];
    this.contacts = [];
    this.nextId = 1;
  }

  // User operations
  async findUserByEmail(email) {
    const user = this.users.find(user => user.email === email);
    if (user) {
      // Add comparePassword method for compatibility
      user.comparePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
      };
    }
    return user;
  }

  async findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = {
      _id: this.nextId++,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id, updateData) {
    const userIndex = this.users.findIndex(user => user._id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return this.users[userIndex];
  }

  async deleteUser(id) {
    const userIndex = this.users.findIndex(user => user._id === id);
    if (userIndex === -1) return null;
    
    return this.users.splice(userIndex, 1)[0];
  }

  async getAllUsers(options = {}) {
    let filteredUsers = [...this.users];

    // Sort by creation date (newest first)
    filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(skip, skip + limit);

    // Remove password from response
    const safeUsers = paginatedUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    return {
      users: safeUsers,
      total: filteredUsers.length,
      page,
      pages: Math.ceil(filteredUsers.length / limit)
    };
  }

  // Service operations
  async getAllServices(options = {}) {
    let services = [...this.services];
    
    // Filter by category if provided
    if (options.category) {
      services = services.filter(service => service.category === options.category);
    }
    
    // Search functionality
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      services = services.filter(service => 
        service.title.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        (service.shortDescription && service.shortDescription.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter active services
    services = services.filter(service => service.isActive !== false);
    
    // Sort by order, then by createdAt
    services.sort((a, b) => {
      if (a.order !== b.order) {
        return (a.order || 999) - (b.order || 999);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const paginatedServices = services.slice(skip, skip + limit);
    
    return {
      services: paginatedServices,
      total: services.length,
      page,
      pages: Math.ceil(services.length / limit)
    };
  }

  async getServiceById(id) {
    return this.services.find(service => service._id === id);
  }

  async createService(serviceData) {
    const service = {
      _id: this.nextId++,
      ...serviceData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(service);
    return service;
  }

  async updateService(id, updateData) {
    const serviceIndex = this.services.findIndex(service => service._id === id);
    if (serviceIndex === -1) return null;
    
    this.services[serviceIndex] = {
      ...this.services[serviceIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return this.services[serviceIndex];
  }

  async deleteService(id) {
    const serviceIndex = this.services.findIndex(service => service._id === id);
    if (serviceIndex === -1) return null;
    
    return this.services.splice(serviceIndex, 1)[0];
  }

  // Contact operations
  async getAllContacts(options = {}) {
    let filteredContacts = [...this.contacts];

    // Filter by status
    if (options.status) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.status === options.status
      );
    }

    // Filter by priority
    if (options.priority) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.priority === options.priority
      );
    }

    // Sort by creation date (newest first)
    filteredContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;
    const paginatedContacts = filteredContacts.slice(skip, skip + limit);

    // Status counts
    const statusCounts = this.contacts.reduce((acc, contact) => {
      const status = contact.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      contacts: paginatedContacts,
      total: filteredContacts.length,
      page,
      pages: Math.ceil(filteredContacts.length / limit),
      statusCounts: Object.entries(statusCounts).map(([status, count]) => ({
        _id: status,
        count
      }))
    };
  }

  async getContactById(id) {
    return this.contacts.find(contact => contact._id === id);
  }

  async createContact(contactData) {
    const contact = {
      _id: this.nextId++,
      ...contactData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contacts.push(contact);
    return contact;
  }

  async updateContact(id, updateData) {
    const contactIndex = this.contacts.findIndex(contact => contact._id === id);
    if (contactIndex === -1) return null;
    
    this.contacts[contactIndex] = {
      ...this.contacts[contactIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return this.contacts[contactIndex];
  }

  async deleteContact(id) {
    const contactIndex = this.contacts.findIndex(contact => contact._id === id);
    if (contactIndex === -1) return null;
    
    return this.contacts.splice(contactIndex, 1)[0];
  }

  // Initialize with sample data
  async initializeSampleData() {
    // Create admin user
    await this.createUser({
      name: 'Admin User',
      email: 'admin@geed.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create regular user
    await this.createUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });

    // Create sample services
    const sampleServices = [
      {
        title: 'Web Development',
        description: 'Custom web application development using modern technologies',
        price: 2500,
        category: 'development',
        duration: '4-6 weeks',
        features: ['Responsive Design', 'Modern Framework', 'Database Integration', 'API Development']
      },
      {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile application development',
        price: 3500,
        category: 'development',
        duration: '6-8 weeks',
        features: ['iOS & Android', 'Cross-platform', 'API Integration', 'App Store Deployment']
      },
      {
        title: 'Digital Marketing',
        description: 'Comprehensive digital marketing strategy and implementation',
        price: 1500,
        category: 'marketing',
        duration: '3-4 weeks',
        features: ['SEO Optimization', 'Social Media', 'Content Strategy', 'Analytics']
      }
    ];

    for (const service of sampleServices) {
      await this.createService(service);
    }

    console.log('✅ Sample data initialized in memory database');
  }
}

module.exports = new MemoryDB();