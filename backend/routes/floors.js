import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all floors for a restaurant
router.get('/', authenticate, async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: req.userId },
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const floors = await prisma.floor.findMany({
      where: { restaurantId: restaurant.id },
      include: { tables: true },
      orderBy: { floorNumber: 'asc' },
    });

    res.json(floors);
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single floor
router.get('/:floorId', authenticate, async (req, res) => {
  try {
    const floor = await prisma.floor.findUnique({
      where: { id: parseInt(req.params.floorId) },
      include: { tables: true },
    });

    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    res.json(floor);
  } catch (error) {
    console.error('Error fetching floor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new floor
router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;

    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: req.userId },
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const floorCount = await prisma.floor.count({
      where: { restaurantId: restaurant.id },
    });

    const floor = await prisma.floor.create({
      data: {
        name: name || `Floor ${floorCount + 1}`,
        floorNumber: floorCount + 1,
        restaurantId: restaurant.id,
      },
      include: { tables: true },
    });

    res.status(201).json(floor);
  } catch (error) {
    console.error('Error creating floor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update floor
router.put('/:floorId', authenticate, async (req, res) => {
  try {
    const { name } = req.body;

    const floor = await prisma.floor.update({
      where: { id: parseInt(req.params.floorId) },
      data: { name },
      include: { tables: true },
    });

    res.json(floor);
  } catch (error) {
    console.error('Error updating floor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete floor
router.delete('/:floorId', authenticate, async (req, res) => {
  try {
    await prisma.floor.delete({
      where: { id: parseInt(req.params.floorId) },
    });

    res.json({ message: 'Floor deleted successfully' });
  } catch (error) {
    console.error('Error deleting floor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
