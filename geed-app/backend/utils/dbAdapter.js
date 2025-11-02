const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Contact = require('../models/Contact');
const memoryDb = require('./memoryDb');

class DatabaseAdapter {
  constructor() {
    this.useMemoryDb = false;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Using MongoDB database');
      this.useMemoryDb = false;
    } else {
      console.log('⚠️  MongoDB not available, using in-memory database');
      this.useMemoryDb = true;
      await memoryDb.initializeSampleData();
    }
    
    this.initialized = true;
  }

  // User operations
  async findUserByEmail(email) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.findUserByEmail(email);
    }
    return await User.findOne({ email });
  }

  async findUserById(id) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.findUserById(id);
    }
    return await User.findById(id);
  }

  async createUser(userData) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.createUser(userData);
    }
    return await User.create(userData);
  }

  async updateUser(id, updateData) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.updateUser(id, updateData);
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.deleteUser(id);
    }
    return await User.findByIdAndDelete(id);
  }

  async getAllUsers(options = {}) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.getAllUsers(options);
    }
    
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  // Service operations
  async getAllServices(options = {}) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.getAllServices(options);
    }
    
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { isActive: true };
    
    if (options.category) {
      query.category = options.category;
    }

    if (options.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } },
        { shortDescription: { $regex: options.search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(query);

    return {
      services,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async getServiceById(id) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.getServiceById(id);
    }
    return await Service.findById(id);
  }

  async createService(serviceData) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.createService(serviceData);
    }
    return await Service.create(serviceData);
  }

  async updateService(id, updateData) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.updateService(id, updateData);
    }
    return await Service.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteService(id) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.deleteService(id);
    }
    return await Service.findByIdAndDelete(id);
  }

  // Contact operations
  async getAllContacts(options = {}) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.getAllContacts(options);
    }
    
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (options.status) {
      query.status = options.status;
    }

    if (options.priority) {
      query.priority = options.priority;
    }

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'name email')
      .populate('reply.repliedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    // Get status counts
    const statusCounts = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return {
      contacts,
      total,
      page,
      pages: Math.ceil(total / limit),
      statusCounts
    };
  }

  async getContactById(id) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.getContactById(id);
    }
    return await Contact.findById(id);
  }

  async createContact(contactData) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.createContact(contactData);
    }
    return await Contact.create(contactData);
  }

  async updateContact(id, updateData) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.updateContact(id, updateData);
    }
    return await Contact.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteContact(id) {
    await this.initialize();
    if (this.useMemoryDb) {
      return await memoryDb.deleteContact(id);
    }
    return await Contact.findByIdAndDelete(id);
  }
}

module.exports = new DatabaseAdapter();