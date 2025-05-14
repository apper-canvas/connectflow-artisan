import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function HelpSupport() {
  const [activeSection, setActiveSection] = useState('faqs');
  const [expandedFaqs, setExpandedFaqs] = useState([0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Icons
  const ChevronDownIcon = getIcon('ChevronDown');
  const ChevronUpIcon = getIcon('ChevronUp');
  const BookOpenIcon = getIcon('BookOpen');
  const MessageCircleIcon = getIcon('MessageCircle');
  const SearchIcon = getIcon('Search');
  const FileTextIcon = getIcon('FileText');
  const SendIcon = getIcon('Send');

  // Sample FAQs
  const faqs = [
    {
      question: "How do I add a new customer?",
      answer: "You can add a new customer by clicking on the 'Add Customer' button in the Customers tab. Fill in the required information in the form and click 'Save' to create a new customer profile."
    },
    {
      question: "How do I schedule a meeting with a customer?",
      answer: "To schedule a meeting, go to the Calendar tab, click on the 'Add Event' button, select 'Meeting' as the event type, choose the customer from the dropdown, set the date and time, add any notes, and click 'Save'."
    },
    {
      question: "Can I export my customer data?",
      answer: "Yes, you can export your customer data by going to the Customers tab, clicking on the 'Export' button in the top right corner, selecting your preferred format (CSV, Excel, PDF), and clicking 'Export'."
    },
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on 'Forgot Password' on the login screen, enter your email address, and follow the instructions sent to your email. If you're already logged in, you can change your password in the Settings tab under the Security section."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information, including regular security audits and compliance with data protection regulations."
    }
  ];

  // Sample KB articles
  const kbArticles = [
    { id: 1, title: "Getting Started with ConnectFlow CRM", category: "basics", content: "A comprehensive guide to get started with ConnectFlow CRM..." },
    { id: 2, title: "Advanced Customer Management", category: "customers", content: "Learn advanced techniques for managing customer relationships..." },
    { id: 3, title: "Optimizing Your Sales Pipeline", category: "sales", content: "Strategies to optimize your sales pipeline and close more deals..." },
    { id: 4, title: "Calendar Integration Guide", category: "calendar", content: "How to integrate external calendars with ConnectFlow CRM..." },
    { id: 5, title: "Messaging Best Practices", category: "messages", content: "Best practices for customer communication through the messaging system..." },
    { id: 6, title: "Data Import and Export", category: "data", content: "How to import and export data in ConnectFlow CRM..." },
    { id: 7, title: "User Permissions and Roles", category: "admin", content: "Managing user permissions and roles in your organization..." },
    { id: 8, title: "Mobile App Usage Guide", category: "mobile", content: "How to use ConnectFlow CRM on your mobile device..." }
  ];

  // Categories for KB
  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'basics', name: 'Basics' },
    { id: 'customers', name: 'Customer Management' },
    { id: 'sales', name: 'Sales' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'messages', name: 'Messaging' },
    { id: 'data', name: 'Data Management' },
    { id: 'admin', name: 'Administration' },
    { id: 'mobile', name: 'Mobile App' }
  ];

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!contactForm.name.trim()) errors.name = "Name is required";
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = "Email is invalid";
    }
    if (!contactForm.subject.trim()) errors.subject = "Subject is required";
    if (!contactForm.message.trim()) errors.message = "Message is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit support request
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        toast.success("Support request submitted successfully! We'll get back to you soon.");
        setContactForm({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 1000);
    }
  };

  // Filter KB articles
  const filteredArticles = kbArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['faqs', 'documentation', 'contact', 'knowledgeBase'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeSection === section
                ? 'bg-primary text-white'
                : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
            }`}
          >
            {section === 'faqs' ? 'FAQs' : 
             section === 'documentation' ? 'Documentation' : 
             section === 'contact' ? 'Contact Support' : 'Knowledge Base'}
          </button>
        ))}
      </div>

      {/* FAQs Section */}
      {activeSection === 'faqs' && (
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-4 text-left bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                {expandedFaqs.includes(index) ? 
                  <ChevronUpIcon className="w-5 h-5 text-surface-500" /> : 
                  <ChevronDownIcon className="w-5 h-5 text-surface-500" />
                }
              </button>
              {expandedFaqs.includes(index) && (
                <div className="p-4 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
                  <p className="text-surface-600 dark:text-surface-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Documentation Section */}
      {activeSection === 'documentation' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
              <h3 className="font-semibold flex items-center text-lg mb-2">
                <BookOpenIcon className="w-5 h-5 mr-2 text-primary" />
                Getting Started
              </h3>
              <ul className="space-y-2 text-surface-600 dark:text-surface-300">
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">New User Guide</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">System Requirements</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Quick Start Tutorial</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Video Walkthrough</a>
                </li>
              </ul>
            </div>
            <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
              <h3 className="font-semibold flex items-center text-lg mb-2">
                <FileTextIcon className="w-5 h-5 mr-2 text-primary" />
                Feature Documentation
              </h3>
              <ul className="space-y-2 text-surface-600 dark:text-surface-300">
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Customer Management</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Calendar & Scheduling</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Messaging System</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Reports & Analytics</a>
                </li>
              </ul>
            </div>
            <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
              <h3 className="font-semibold flex items-center text-lg mb-2">
                <MessageCircleIcon className="w-5 h-5 mr-2 text-primary" />
                Integration Guides
              </h3>
              <ul className="space-y-2 text-surface-600 dark:text-surface-300">
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Email Integration</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Calendar Sync</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">API Documentation</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Third-party Integrations</a>
                </li>
              </ul>
            </div>
            <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
              <h3 className="font-semibold flex items-center text-lg mb-2">
                <FileTextIcon className="w-5 h-5 mr-2 text-primary" />
                Advanced Topics
              </h3>
              <ul className="space-y-2 text-surface-600 dark:text-surface-300">
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Data Security</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">User Management</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Customization Options</a>
                </li>
                <li className="hover:text-primary transition-colors">
                  <a href="#" className="block">Performance Optimization</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Section */}
      {activeSection === 'contact' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium text-surface-700 dark:text-surface-300">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                className={`input-field ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Your name"
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-surface-700 dark:text-surface-300">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactForm.email}
                onChange={handleInputChange}
                className={`input-field ${formErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="your.email@example.com"
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="subject" className="block mb-1 font-medium text-surface-700 dark:text-surface-300">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                className={`input-field ${formErrors.subject ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Subject of your inquiry"
              />
              {formErrors.subject && <p className="mt-1 text-sm text-red-500">{formErrors.subject}</p>}
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-medium text-surface-700 dark:text-surface-300">Message</label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                className={`input-field min-h-[150px] ${formErrors.message ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Describe your issue or question in detail..."
              ></textarea>
              {formErrors.message && <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>}
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary flex items-center">
                <SendIcon className="w-4 h-4 mr-2" />
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Knowledge Base Section */}
      {activeSection === 'knowledgeBase' && (
        <div className="space-y-6">
          <div className="card">
            <div className="relative">
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                    Category: {categories.find(c => c.id === article.category)?.name || article.category}
                  </p>
                  <p className="mt-2 text-surface-600 dark:text-surface-300 line-clamp-2">{article.content}</p>
                  <div className="mt-3 text-primary text-sm font-medium hover:underline">Read more</div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-surface-500 dark:text-surface-400">No articles found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HelpSupport;