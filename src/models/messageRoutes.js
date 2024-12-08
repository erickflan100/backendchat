const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Endpoint para salvar mensagens
router.post('/messages', async (req, res) => {
  const { user, content } = req.body;

  if (!user || !content) {
    return res.status(400).json({ error: 'User and content are required' });
  }

  try {
    const message = new Message({ user, content });
    await message.save();
    res.status(201).json({ message: 'Message saved successfully', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Error saving message' });
  }
});

// Endpoint para recuperar mensagens
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages'})
  }
});

module.exports = router;
