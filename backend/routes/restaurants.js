import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's restaurants (all or specific one by ID)
router.get('/', authenticate, async (req, res) => {
  try {
    const { id } = req.query;

    // If ID is provided, get specific restaurant
    if (id) {
      const restaurant = await prisma.restaurant.findFirst({
        where: { 
          id: parseInt(id),
          userId: req.userId 
        },
        include: {
          floors: {
            include: { 
              tables: {
                include: {
                  worker: true
                }
              }
            },
            orderBy: { floorNumber: 'asc' }
          },
          employees: true,
          locations: true
        }
      });

      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }

      return res.json(restaurant);
    }

    // Otherwise, get all restaurants
    const restaurants = await prisma.restaurant.findMany({
      where: { userId: req.userId },
      include: {
        floors: {
          include: { 
            tables: {
              include: {
                worker: true
              }
            }
          },
          orderBy: { floorNumber: 'asc' }
        },
        employees: true,
        locations: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create restaurant (allows multiple per user)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, contactEmail, contactPhone } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Restaurant name is required' });
    }

    // Create restaurant with initial floor
    const shareToken = crypto.randomBytes(16).toString('hex');
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description: description || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        userId: req.userId,
        shareToken,
        floors: {
          create: {
            name: 'Floor 1',
            floorNumber: 1
          }
        }
      },
      include: {
        floors: {
          include: { tables: true }
        },
        employees: true,
        locations: true
      }
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update restaurant (by ID)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, contactEmail, contactPhone } = req.body;

    // Verify user owns this restaurant
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId
      }
    });

    if (!existingRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const restaurant = await prisma.restaurant.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(contactEmail !== undefined && { contactEmail: contactEmail || null }),
        ...(contactPhone !== undefined && { contactPhone: contactPhone || null })
      },
      include: {
        floors: {
          include: { 
            tables: {
              include: {
                worker: true
              }
            }
          },
          orderBy: { floorNumber: 'asc' }
        },
        employees: true,
        locations: true
      }
    });

    res.json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete restaurant
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Verify user owns this restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    await prisma.restaurant.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
