import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/context/SocketContext';
import { getConversations, getMessages, sendMessage as sendMessageApi } from '@/api/chatApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, MessageSquare, MoreVertical, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { id } = useParams(); // Selected conversation ID
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { socket } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  
  const scrollRef = useRef();

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
        if (id) {
          const active = data.find(c => c._id === id);
          if (active) setActiveConversation(active);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [id]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (id) {
      const fetchMessages = async () => {
        try {
          const data = await getMessages(id);
          setMessages(data);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
      setActiveConversation(null);
    }
  }, [id]);

  // Handle socket messages
  useEffect(() => {
    if (socket) {
      socket.on('getMessage', (data) => {
        // If message is for current active conversation
        if (activeConversation && activeConversation.participants.some(p => p._id === data.senderId)) {
          setMessages(prev => [...prev, {
            sender: data.senderId,
            text: data.text,
            createdAt: new Date()
          }]);
        }
        
        // Refresh conversations list to update snippets
        getConversations().then(setConversations);
      });
    }
    return () => socket?.off('getMessage');
  }, [socket, activeConversation]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const receiverId = activeConversation.participants.find(p => p._id !== user._id)._id;

    try {
      const res = await sendMessageApi({
        receiverId,
        text: newMessage
      });

      setMessages(prev => [...prev, res]);
      setNewMessage('');

      // Emit socket event
      socket.emit('sendMessage', {
        senderId: user._id,
        receiverId,
        text: newMessage
      });

      // Update conversations list
      getConversations().then(setConversations);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const getPartner = (conv) => {
    return conv.participants.find(p => p._id !== user._id);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-64px)]">
      <div className="flex gap-6 h-full bg-white rounded-3xl border shadow-sm overflow-hidden">
        
        {/* Sidebar - Conversations List */}
        <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${id ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-black tracking-tighter mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search chats..." 
                className="pl-10 bg-gray-50 border-none rounded-xl"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-10 text-center">
                <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold">No messages yet</p>
                <p className="text-xs text-gray-400 mt-1">Start chatting with recruiters or candidates!</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = getPartner(conv);
                return (
                  <div 
                    key={conv._id}
                    onClick={() => navigate(`/chat/${conv._id}`)}
                    className={`p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-50 border-l-4 ${
                      id === conv._id ? 'border-black bg-gray-50' : 'border-transparent'
                    }`}
                  >
                    <Avatar className="h-12 w-12 border shadow-sm">
                      <AvatarImage src={partner?.profilePicture} />
                      <AvatarFallback className="bg-black text-white font-bold">{partner?.fullName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-sm truncate">{partner?.fullName}</h3>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col ${!id ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden rounded-full"
                    onClick={() => navigate('/chat')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarImage src={getPartner(activeConversation)?.profilePicture} />
                    <AvatarFallback className="bg-black text-white font-bold">
                      {getPartner(activeConversation)?.fullName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-black text-sm">{getPartner(activeConversation)?.fullName}</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {getPartner(activeConversation)?.role}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.map((msg, index) => {
                  const isMine = msg.sender === user._id || msg.sender?._id === user._id;
                  return (
                    <div 
                      key={index}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${
                        isMine 
                          ? 'bg-black text-white rounded-br-none' 
                          : 'bg-white text-gray-800 border rounded-bl-none'
                      }`}>
                        {msg.text}
                        <div className={`text-[9px] mt-1 opacity-50 ${isMine ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 rounded-xl bg-gray-50 border-none focus-visible:ring-black"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-xl bg-black hover:bg-gray-800 transition-all active:scale-90 shadow-lg"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="bg-gray-50 rounded-full h-24 w-24 flex items-center justify-center mb-6">
                <MessageSquare className="h-12 w-12 text-gray-200" />
              </div>
              <h2 className="text-xl font-black tracking-tighter">Your Messages</h2>
              <p className="text-gray-500 max-w-xs mt-2 font-medium">
                Select a conversation from the sidebar to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
