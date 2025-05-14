import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { selectThread, sendMessage, createThread } from '../features/messages/messagesSlice';
import MessageThread from './MessageThread';

function Messages() {
  const dispatch = useDispatch();
  const { threads, selectedThreadId } = useSelector(state => state.messages);
  const { user } = useSelector(state => state.auth);
  const customers = useSelector(state => state.customers?.customers) || sampleCustomers;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({
    customerId: '',
    subject: '',
    message: ''
  });
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Icons
  const SearchIcon = getIcon('Search');
  const PlusIcon = getIcon('Plus');
  const FilterIcon = getIcon('Filter');
  const XIcon = getIcon('X');
  const XCircleIcon = getIcon('XCircle');
  const SendIcon = getIcon('Send');
  const UserIcon = getIcon('User');
  const CheckIcon = getIcon('Check');

  // Sample customers to use if not in state yet
  const sampleCustomers = [
    {
      id: '1',
      firstName: 'Alex',
      lastName: 'Morgan',
      company: 'Globex Corporation',
    },
    {
      id: '2',
      firstName: 'Taylor',
      lastName: 'Smith',
      company: 'Initech',
    },
    {
      id: '3',
      firstName: 'Jordan',
      lastName: 'Lee',
      company: 'Acme Inc',
    },
    {
      id: '4',
      firstName: 'Casey',
      lastName: 'Wilson',
      company: 'Umbrella Corp',
    },
    {
      id: '5',
      firstName: 'Jamie',
      lastName: 'Garcia',
      company: 'Stark Industries',
    }
  ];

  // Filter threads based on search term and unread filter
  useEffect(() => {
    let filtered = [...threads];
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(thread => {
        // Find the customer associated with this thread
        const customer = customers.find(c => c.id === thread.customerId);
        const customerName = customer ? `${customer.firstName} ${customer.lastName}`.toLowerCase() : '';
        const customerCompany = customer ? customer.company.toLowerCase() : '';
        
        return (
          thread.subject.toLowerCase().includes(lowercasedTerm) ||
          customerName.includes(lowercasedTerm) ||
          customerCompany.includes(lowercasedTerm) ||
          thread.messages.some(msg => msg.text.toLowerCase().includes(lowercasedTerm))
        );
      });
    }
    
    if (showUnreadOnly) {
      filtered = filtered.filter(thread => thread.unreadCount > 0);
    }
    
    setFilteredThreads(filtered);
  }, [threads, searchTerm, showUnreadOnly, customers]);

  // Update selected thread when selectedThreadId changes
  useEffect(() => {
    if (selectedThreadId) {
      const thread = threads.find(t => t.id === selectedThreadId);
      setSelectedThread(thread);
    } else if (threads.length > 0) {
      // Auto-select first thread if none is selected
      setSelectedThread(threads[0]);
      dispatch(selectThread(threads[0].id));
    } else {
      setSelectedThread(null);
    }
  }, [selectedThreadId, threads, dispatch]);

  // Handle thread selection
  const handleSelectThread = (thread) => {
    dispatch(selectThread(thread.id));
  };

  // Handle sending a message
  const handleSendMessage = (threadId, message) => {
    if (message.trim()) {
      dispatch(sendMessage({ threadId, message }));
      toast.success('Message sent successfully');
    }
  };

  // Handle creating a new thread
  const handleCreateThread = (e) => {
    e.preventDefault();
    
    if (!composeData.customerId) {
      toast.error('Please select a customer');
      return;
    }
    
    if (!composeData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    
    if (!composeData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    dispatch(createThread({
      customerId: composeData.customerId,
      subject: composeData.subject,
      message: composeData.message
    }));
    
    setComposeData({
      customerId: '',
      subject: '',
      message: ''
    });
    
    setIsComposeOpen(false);
    toast.success('New conversation started');
  };

  // Get customer name function
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  // Get formatted date
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    }
    
    // If within the last week, show relative time
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise show date
    return format(date, 'MMM d');
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden h-[calc(100vh-14rem)]">
      <div className="flex h-full">
        {/* Left sidebar - Message List */}
        <div className="w-full sm:w-80 lg:w-96 border-r border-surface-200 dark:border-surface-700 flex flex-col h-full">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Messages</h3>
              <button
                onClick={() => setIsComposeOpen(true)}
                className="btn-primary text-sm px-3 py-1.5 flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                <span>Compose</span>
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-4 py-2 w-full"
              />
              <SearchIcon className="absolute left-3 top-2.5 text-surface-400 w-5 h-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-600"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="flex items-center mt-2">
              <label className="flex items-center text-sm text-surface-600 dark:text-surface-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                  className="mr-2 h-4 w-4 rounded border-surface-300 dark:border-surface-600 text-primary focus:ring-primary"
                />
                Show unread only
              </label>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="text-surface-400 mb-2">
                  <UserIcon className="w-10 h-10 mx-auto mb-2" />
                  <p>No messages found</p>
                </div>
                <button
                  onClick={() => setIsComposeOpen(true)}
                  className="btn-primary mt-4 text-sm"
                >
                  Start a conversation
                </button>
              </div>
            ) : (
              filteredThreads.map(thread => (
                <motion.div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  className={`p-4 border-b border-surface-200 dark:border-surface-700 cursor-pointer transition-colors
                    ${selectedThreadId === thread.id ? 'bg-primary bg-opacity-5 dark:bg-opacity-10' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}
                    ${thread.unreadCount > 0 ? 'font-medium' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-surface-900 dark:text-surface-100">
                      {getCustomerName(thread.customerId)}
                    </span>
                    <span className="text-xs text-surface-500">
                      {getFormattedDate(thread.lastUpdated)}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-1 truncate">
                    {thread.subject}
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-400 truncate">
                    {thread.messages[thread.messages.length - 1]?.text}
                  </div>
                  {thread.unreadCount > 0 && (
                    <div className="flex justify-end mt-1">
                      <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {thread.unreadCount}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
        
        {/* Right area - Message Thread */}
        <div className="hidden sm:flex flex-1 flex-col h-full">
          {selectedThread ? (
            <MessageThread 
              thread={selectedThread}
              customerName={getCustomerName(selectedThread.customerId)}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-surface-400 text-center p-8">
                <UserIcon className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p>Select a conversation from the list or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Compose Message Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
                <h2 className="text-xl font-bold">New Message</h2>
                <button
                  onClick={() => setIsComposeOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateThread} className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    To
                  </label>
                  <select
                    value={composeData.customerId}
                    onChange={(e) => setComposeData({...composeData, customerId: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} - {customer.company}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                    className="input-field"
                    placeholder="Message subject"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={composeData.message}
                    onChange={(e) => setComposeData({...composeData, message: e.target.value})}
                    className="input-field min-h-[120px]"
                    placeholder="Type your message here..."
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <SendIcon className="w-4 h-4 mr-1" />
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Messages;