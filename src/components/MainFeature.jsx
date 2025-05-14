import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

// Sample customer data
const initialCustomers = [
  {
    id: '1',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    phone: '(555) 123-4567',
    company: 'Globex Corporation',
    title: 'Marketing Director',
    status: 'customer',
    lastContactedAt: '2023-06-15',
    tags: ['VIP', 'Marketing'],
  },
  {
    id: '2',
    firstName: 'Taylor',
    lastName: 'Smith',
    email: 'taylor.smith@example.com',
    phone: '(555) 987-6543',
    company: 'Initech',
    title: 'CEO',
    status: 'lead',
    lastContactedAt: '2023-07-22',
    tags: ['New', 'Tech'],
  },
  {
    id: '3',
    firstName: 'Jordan',
    lastName: 'Lee',
    email: 'jordan.lee@example.com',
    phone: '(555) 567-8901',
    company: 'Acme Inc',
    title: 'Sales Manager',
    status: 'prospect',
    lastContactedAt: '2023-07-10',
    tags: ['Follow-up', 'Sales'],
  },
  {
    id: '4',
    firstName: 'Casey',
    lastName: 'Wilson',
    email: 'casey.wilson@example.com',
    phone: '(555) 234-5678',
    company: 'Umbrella Corp',
    title: 'CTO',
    status: 'customer',
    lastContactedAt: '2023-07-18',
    tags: ['Technical', 'Enterprise'],
  },
  {
    id: '5',
    firstName: 'Jamie',
    lastName: 'Garcia',
    email: 'jamie.garcia@example.com',
    phone: '(555) 345-6789',
    company: 'Stark Industries',
    title: 'Product Manager',
    status: 'churned',
    lastContactedAt: '2023-05-25',
    tags: ['Inactive', 'Product'],
  }
];

function MainFeature() {
  // Icons declaration
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const XIcon = getIcon('X');
  const ChevronDownIcon = getIcon('ChevronDown');
  const UserPlusIcon = getIcon('UserPlus');
  const CheckIcon = getIcon('Check');
  const PhoneIcon = getIcon('Phone');
  const MailIcon = getIcon('Mail');
  const CalendarIcon = getIcon('Calendar');
  const PenIcon = getIcon('Pen');
  const TrashIcon = getIcon('Trash');
  const TagIcon = getIcon('Tag');
  const InfoIcon = getIcon('Info');
  const XCircleIcon = getIcon('XCircle');

  // State management
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'lead',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});

  // Load sample customers on initial render
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setCustomers(initialCustomers);
      setFilteredCustomers(initialCustomers);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter customers whenever filters or search term changes
  useEffect(() => {
    let results = [...customers];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(customer => customer.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(customer => 
        customer.firstName.toLowerCase().includes(lowercasedTerm) ||
        customer.lastName.toLowerCase().includes(lowercasedTerm) ||
        customer.email.toLowerCase().includes(lowercasedTerm) ||
        customer.company.toLowerCase().includes(lowercasedTerm) ||
        (customer.tags && customer.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)))
      );
    }
    
    setFilteredCustomers(results);
  }, [customers, searchTerm, statusFilter]);

  // Reset form data
  const resetFormData = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'lead',
      tags: [],
    });
    setErrors({});
  };

  // Open modal in add mode
  const handleAddCustomer = () => {
    setModalMode('add');
    resetFormData();
    setIsModalOpen(true);
  };

  // Open modal in edit mode
  const handleEditCustomer = (customer) => {
    setModalMode('edit');
    setFormData({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      title: customer.title,
      status: customer.status,
      tags: customer.tags || [],
    });
    setIsModalOpen(true);
  };

  // Delete customer
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter(c => c.id !== customerId));
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(null);
      }
      toast.success("Customer deleted successfully");
    }
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Add tag to customer
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag from customer
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (formData.phone && !/^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (modalMode === 'add') {
      // Create new customer
      const newCustomer = {
        ...formData,
        id: Date.now().toString(),
        lastContactedAt: new Date().toISOString().split('T')[0]
      };
      
      setCustomers(prev => [...prev, newCustomer]);
      toast.success("Customer added successfully");
    } else {
      // Update existing customer
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === formData.id ? { ...customer, ...formData } : customer
        )
      );
      
      // Update selected customer if it's the one being edited
      if (selectedCustomer && selectedCustomer.id === formData.id) {
        setSelectedCustomer({ ...selectedCustomer, ...formData });
      }
      
      toast.success("Customer updated successfully");
    }
    
    setIsModalOpen(false);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      lead: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300' },
      prospect: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300' },
      customer: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300' },
      churned: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300' }
    };
    
    const config = statusConfig[status] || statusConfig.lead;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Tag component
  const Tag = ({ text, onRemove = null }) => {
    return (
      <span className="inline-flex items-center rounded-full bg-surface-200 dark:bg-surface-700 px-2 py-1 text-xs font-medium text-surface-700 dark:text-surface-300 mr-1 mb-1">
        <TagIcon className="w-3 h-3 mr-1" />
        {text}
        {onRemove && (
          <button 
            type="button"
            onClick={() => onRemove(text)} 
            className="ml-1 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
          >
            <XIcon className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  };

  // Loading state
  if (customers.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer list card */}
      <motion.div 
        className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold">Customers</h2>
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search customers..."
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
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary flex items-center ${showFilters ? 'bg-surface-300 dark:bg-surface-600' : ''}`}
              >
                <FilterIcon className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button 
                onClick={handleAddCustomer}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>

          {/* Filter options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 overflow-hidden"
              >
                <div className="flex flex-wrap gap-3">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input-field py-1.5"
                    >
                      <option value="all">All Statuses</option>
                      <option value="lead">Lead</option>
                      <option value="prospect">Prospect</option>
                      <option value="customer">Customer</option>
                      <option value="churned">Churned</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Customer table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-50 dark:bg-surface-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden lg:table-cell">
                  Last Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden xl:table-cell">
                  Tags
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-surface-500 dark:text-surface-400">
                    <InfoIcon className="mx-auto h-8 w-8 mb-2" />
                    <p>No customers match your search criteria.</p>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                      className="mt-2 text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-light bg-opacity-20 text-primary flex items-center justify-center font-medium text-sm">
                          {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{customer.firstName} {customer.lastName}</div>
                          <div className="text-sm text-surface-500 dark:text-surface-400">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm">{customer.company}</div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">{customer.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm hidden lg:table-cell">
                      {customer.lastContactedAt ? format(new Date(customer.lastContactedAt), 'MMM d, yyyy') : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm hidden xl:table-cell">
                      <div className="flex flex-wrap max-w-xs">
                        {customer.tags && customer.tags.slice(0, 2).map(tag => (
                          <Tag key={tag} text={tag} />
                        ))}
                        {customer.tags && customer.tags.length > 2 && (
                          <span className="inline-flex items-center rounded-full bg-surface-100 dark:bg-surface-700 px-2 py-1 text-xs font-medium text-surface-600 dark:text-surface-300">
                            +{customer.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCustomer(customer);
                        }}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        <PenIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomer(customer.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Selected customer details */}
      {selectedCustomer && (
        <motion.div 
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary-light bg-opacity-20 text-primary flex items-center justify-center font-bold text-lg">
                {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
                <p className="text-surface-600 dark:text-surface-400">
                  {selectedCustomer.title} at {selectedCustomer.company}
                </p>
              </div>
            </div>
            <StatusBadge status={selectedCustomer.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4 pb-2 border-b border-surface-200 dark:border-surface-700">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MailIcon className="w-5 h-5 text-surface-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Email</p>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 text-surface-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Phone</p>
                    <p className="font-medium">{selectedCustomer.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CalendarIcon className="w-5 h-5 text-surface-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Last Contacted</p>
                    <p className="font-medium">
                      {selectedCustomer.lastContactedAt 
                        ? format(new Date(selectedCustomer.lastContactedAt), 'MMMM d, yyyy') 
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 pb-2 border-b border-surface-200 dark:border-surface-700">Tags & Notes</h3>
              
              <div className="mb-4">
                <div className="flex flex-wrap">
                  {selectedCustomer.tags && selectedCustomer.tags.map(tag => (
                    <Tag key={tag} text={tag} />
                  ))}
                  {(!selectedCustomer.tags || selectedCustomer.tags.length === 0) && (
                    <p className="text-sm text-surface-500 dark:text-surface-400">No tags added yet</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={() => handleEditCustomer(selectedCustomer)}
                  className="btn-primary w-full sm:w-auto"
                >
                  <PenIcon className="w-4 h-4 mr-2" /> 
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold flex items-center">
                <UserPlusIcon className="w-5 h-5 mr-2 text-primary" />
                {modalMode === 'add' ? 'Add New Customer' : 'Edit Customer'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`input-field ${errors.firstName ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`input-field ${errors.lastName ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input-field ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`input-field ${errors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="churned">Churned</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Tags
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag..."
                      className="input-field flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 btn-secondary"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap">
                    {formData.tags.map((tag) => (
                      <Tag key={tag} text={tag} onRemove={handleRemoveTag} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <CheckIcon className="w-4 h-4 mr-1.5" />
                  {modalMode === 'add' ? 'Add Customer' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default MainFeature;