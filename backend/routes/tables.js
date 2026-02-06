import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all tables for a floor
router.get('/floor/:floorId', authenticate, async (req, res) => {
  try {
    const tables = await prisma.table.findMany({
      where: { floorId: parseInt(req.params.floorId) },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new table
router.post('/', authenticate, async (req, res) => {
  try {
    const { floorId, name, shape, capacity, status, x, y, width, height, workerId } = req.body;

    const table = await prisma.table.create({
      data: {
        floorId: parseInt(floorId),
        name,
        shape,
        capacity: parseInt(capacity),
        status: status || 'available',
        x: parseFloat(x),
        y: parseFloat(y),
        width: parseFloat(width),
        height: parseFloat(height),
        ...(workerId && { workerId: parseInt(workerId) })
      },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    res.status(201).json(table);
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update table
router.put('/:tableId', authenticate, async (req, res) => {
  try {
    const { name, shape, capacity, status, x, y, width, height, workerId } = req.body;

    const table = await prisma.table.update({
      where: { id: parseInt(req.params.tableId) },
      data: {
        ...(name && { name }),
        ...(shape && { shape }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(status && { status }),
        ...(x !== undefined && { x: parseFloat(x) }),
        ...(y !== undefined && { y: parseFloat(y) }),
        ...(width && { width: parseFloat(width) }),
        ...(height && { height: parseFloat(height) }),
        ...(workerId !== undefined && { workerId: workerId ? parseInt(workerId) : null })
      },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    res.json(table);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete table
router.delete('/:tableId', authenticate, async (req, res) => {
  try {
    await prisma.table.delete({
      where: { id: parseInt(req.params.tableId) },
    });

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
