import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all employees for a restaurant
router.get('/', authenticate, async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
    }

    // Verify user owns this restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: parseInt(restaurantId),
        userId: req.userId
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const employees = await prisma.employee.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      include: {
        tables: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single employee
router.get('/:id', authenticate, async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        restaurant: true,
        tables: {
          select: {
            id: true,
            name: true,
            capacity: true
          }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Verify user owns the restaurant
    if (employee.restaurant.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new employee
router.post('/', authenticate, async (req, res) => {
  try {
    const { restaurantId, name, email, phone, role } = req.body;

    if (!restaurantId || !name) {
      return res.status(400).json({ error: 'Restaurant ID and name are required' });
    }

    // Verify user owns this restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: parseInt(restaurantId),
        userId: req.userId
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const employee = await prisma.employee.create({
      data: {
        restaurantId: parseInt(restaurantId),
        name,
        email: email || null,
        phone: phone || null,
        role: role || 'waiter'
      },
      include: {
        tables: true
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update employee
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    // Check if employee exists and user owns the restaurant
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { restaurant: true }
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (existingEmployee.restaurant.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(role && { role })
      },
      include: {
        tables: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Check if employee exists and user owns the restaurant
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { restaurant: true }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (employee.restaurant.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.employee.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
