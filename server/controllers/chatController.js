const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Send message
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create message
    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text,
    });

    // Update last message in conversation
    conversation.lastMessage = {
      text,
      sender: senderId,
      createdAt: new Date(),
    };
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate('participants', 'fullName profilePicture role')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
