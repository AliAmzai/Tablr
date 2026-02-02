import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's restaurant
router.get('/', authenticate, async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: req.userId },
      include: {
        floors: {
          include: { tables: true },
          orderBy: { floorNumber: 'asc' }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create restaurant (for users without one)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;

    // Check if restaurant already exists
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { userId: req.userId }
    });

    if (existingRestaurant) {
      return res.status(400).json({ error: 'Restaurant already exists' });
    }

    // Create restaurant with initial floor
    const shareToken = crypto.randomBytes(16).toString('hex');
    const restaurant = await prisma.restaurant.create({
      data: {
        name: name || 'My Restaurant',
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
        }
      }
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update restaurant
router.put('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;

    const restaurant = await prisma.restaurant.update({
      where: {
        userId: req.userId
      },
      data: { name },
      include: {
        floors: {
          include: { tables: true },
          orderBy: { floorNumber: 'asc' }
        }
      }
    });

    res.json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
