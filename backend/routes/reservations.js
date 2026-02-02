import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create reservation
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    
    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, startTime, and endTime are required' });
    }
    
    const reservation = await prisma.reservation.create({
      data: {
        userId: req.userId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    });
    
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reservations for logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.userId },
      orderBy: { startTime: 'asc' }
    });
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single reservation
router.get('/:id', authenticate, async (req, res) => {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId
      }
    });
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reservation
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, startTime, endTime, status } = req.body;
    
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId
      }
    });
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    const updated = await prisma.reservation.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: title || reservation.title,
        description: description || reservation.description,
        startTime: startTime ? new Date(startTime) : reservation.startTime,
        endTime: endTime ? new Date(endTime) : reservation.endTime,
        status: status || reservation.status
      }
    });
    
    res.json({
      message: 'Reservation updated successfully',
      reservation: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete reservation
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId
      }
    });
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    await prisma.reservation.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
