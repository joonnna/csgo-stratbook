const express = require('express');
const router = express.Router();
const Map = require('../models/map');
const Strat = require('../models/strat');
const { getMap, getStrat } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// * Get all
router.get('/', verifyAuth, async (req, res) => {
  try {
    const maps = await Map.find();
    res.json(maps);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// * Get One
router.get('/:map_id', getMap, (req, res) => {
  res.json(res.map);
});

// * Create One
router.post('/create', verifyAuth, async (req, res) => {
  const map = new Map({
    name: req.body.name,
    active: req.body.active,
    image: req.body.image,
  });
  try {
    const newMap = await map.save();
    res.status(201).json(newMap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * Update One
router.patch('/:map_id/update', verifyAuth, getMap, async (req, res) => {
  if (req.body.name) {
    res.map.name = req.body.name;
  }
  if (req.body.active) {
    res.map.active = req.body.active;
  }
  if (req.body.image) {
    res.map.image = req.body.image;
  }
  try {
    const updatedMap = await res.map.save();
    res.json(updatedMap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * Delete One
router.delete('/:map_id/delete', verifyAuth, getMap, async (req, res) => {
  try {
    await res.map.remove();
    res.json({ message: 'Deleted map successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// * Delete All
router.delete('/deleteAll', verifyAuth, async (req, res) => {
  try {
    await Map.deleteMany({});
    await Map.collection.dropIndexes();
    res.json({ message: 'Deleted all maps' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
