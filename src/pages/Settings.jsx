import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCog, FaUser, FaShieldAlt, FaGlobe, FaMapPin, FaTag, FaPlus, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy isDarkMode value for demonstration; replace with your actual dark mode logic or context
const isDarkMode = false;

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('preferences');
  const [newsSources, setNewsSources] = useState([
    // Major International News Sources
    { name: 'BBC World', selected: true, category: 'International' },
    { name: 'CNN World', selected: true, category: 'International' },
    { name: 'Reuters World', selected: true, category: 'International' },
    { name: 'New York Times', selected: true, category: 'International' },
    { name: 'Wall Street Journal', selected: true, category: 'International' },
    { name: 'CNBC World', selected: true, category: 'International' },
    { name: 'Al Jazeera', selected: false, category: 'International' },
    { name: 'NPR World', selected: false, category: 'International' },
    { name: 'Sky News', selected: false, category: 'International' },
    { name: 'Deutsche Welle', selected: false, category: 'International' },
    { name: 'Times of India', selected: false, category: 'International' },
    
    // Australian News Sources
    { name: 'ABC News Australia', selected: false, category: 'Australia' },
    { name: 'The Guardian Australia', selected: false, category: 'Australia' },
    { name: 'SBS News', selected: false, category: 'Australia' },
    { name: 'Sydney Morning Herald', selected: false, category: 'Australia' },
    { name: 'The Age', selected: false, category: 'Australia' },
    { name: 'The Australian', selected: false, category: 'Australia' },
    { name: 'The Conversation', selected: false, category: 'Australia' },
    
    // Technology & Security Sources
    { name: 'TechCrunch', selected: true, category: 'Technology' },
    { name: 'The Verge', selected: true, category: 'Technology' },
    { name: 'Wired', selected: false, category: 'Technology' },
    { name: 'Ars Technica', selected: false, category: 'Technology' },
    { name: 'ZDNet', selected: false, category: 'Technology' },
    
    // Cybersecurity Sources
    { name: 'CyberScoop', selected: false, category: 'Cybersecurity' },
    { name: 'Dark Reading', selected: false, category: 'Cybersecurity' },
    { name: 'Security Week', selected: false, category: 'Cybersecurity' },
    { name: 'Bleeping Computer', selected: false, category: 'Cybersecurity' },
    { name: 'The Hacker News', selected: false, category: 'Cybersecurity' },
    { name: 'Krebs on Security', selected: false, category: 'Cybersecurity' },
    { name: 'InfoSecurity Magazine', selected: false, category: 'Cybersecurity' },
    
    // API Sources
    { name: 'NewsAPI', selected: true, category: 'API' },
    { name: 'GNews', selected: true, category: 'API' }
  ]);
  const [regions, setRegions] = useState([
    { name: 'United States', selected: true },
    { name: 'Europe', selected: true },
    { name: 'Asia', selected: true },
    { name: 'North America', selected: false },
    { name: 'South America', selected: false },
    { name: 'Africa', selected: false },
    { name: 'Australia', selected: false },
    { name: 'Middle East', selected: false },
    { name: 'Global', selected: false }
  ]);
  const [keywords, setKeywords] = useState(['AI', 'Cybersecurity', 'Technology', 'Innovation']);
  const [newKeyword, setNewKeyword] = useState('');

  const handleNewsSourceToggle = (index) => {
    const updatedSources = [...newsSources];
    updatedSources[index].selected = !updatedSources[index].selected;
    setNewsSources(updatedSources);
  };

  const handleRegionToggle = (index) => {
    const updatedRegions = [...regions];
    updatedRegions[index].selected = !updatedRegions[index].selected;
    setRegions(updatedRegions);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddKeyword();
    }
  };

  const renderPreferences = () => (
    <div className="space-y-6">
      {/* News Sources Section */}
      <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaGlobe className="text-cyan-500 text-xl" />
          <div>
            <h3 className="text-white dark:text-white text-gray-900 font-semibold text-lg">News Sources</h3>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Select your preferred news sources for personalized content</p>
          </div>
        </div>
        <div className="space-y-6">
          {['International', 'Australia', 'Technology', 'Cybersecurity', 'API'].map(category => {
            const categorySources = newsSources.filter(source => source.category === category);
            return (
              <div key={category} className="space-y-3">
                <h4 className="text-white dark:text-white text-gray-900 font-medium text-sm uppercase tracking-wide">
                  {category} Sources
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categorySources.map((source, index) => {
                    const globalIndex = newsSources.findIndex(s => s.name === source.name);
                    return (
                      <button
                        key={index}
                        onClick={() => handleNewsSourceToggle(globalIndex)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          source.selected
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-700 dark:bg-gray-700 bg-gray-200 text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600'
                        }`}
                      >
                        {source.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regions Section */}
      <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaMapPin className="text-green-500 text-xl" />
          <div>
            <h3 className="text-white dark:text-white text-gray-900 font-semibold text-lg">Regions</h3>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Choose regions for localized news coverage</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {regions.map((region, index) => (
            <button
              key={index}
              onClick={() => handleRegionToggle(index)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                region.selected
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 dark:bg-gray-700 bg-gray-200 text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Section */}
      <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaTag className="text-purple-500 text-xl" />
          <div>
            <h3 className="text-white dark:text-white text-gray-900 font-semibold text-lg">Keywords</h3>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Add keywords to get more relevant news recommendations</p>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new keyword..."
            className="flex-1 px-4 py-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 text-white dark:text-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleAddKeyword}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <FaPlus className="text-sm" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-700 dark:bg-gray-700 bg-gray-200 text-gray-300 dark:text-gray-300 text-gray-700 rounded-full text-sm"
            >
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(index)}
                className="text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900"
              >
                <FaTimes className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserProfile = () => (
    <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-lg p-8 text-center">
      {!isAuthenticated ? (
        <>
          <div className="w-24 h-24 bg-gray-600 dark:bg-gray-600 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FaUser className="text-gray-400 dark:text-gray-400 text-gray-500 text-3xl" />
          </div>
          <h2 className="text-white dark:text-white text-gray-900 text-2xl font-bold mb-2">Login to your account</h2>
          <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-8">Access personalized features and save your preferences</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
            >
              Login
              <span>→</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-gray-700 dark:bg-gray-700 bg-gray-200 text-gray-300 dark:text-gray-300 text-gray-700 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              <FaUser className="text-sm" />
              Create Account
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-24 h-24 bg-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-white dark:text-white text-gray-900 text-2xl font-bold mb-2">{user?.email}</h2>
          <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-8">Manage your account settings and preferences</p>
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-white dark:text-white text-gray-900 font-semibold mb-2">Account Information</h3>
              <div className="space-y-2 text-gray-300 dark:text-gray-300 text-gray-700">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                <p><strong>Articles bookmarked:</strong> {user?.bookmarks?.length || 0}</p>
                <p><strong>Reading history:</strong> {user?.reading_history?.length || 0} articles</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderPrivacySecurity = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaShieldAlt className="text-green-500 text-xl" />
          <h3 className="text-white dark:text-white text-gray-900 font-semibold text-lg">Privacy & Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 dark:bg-gray-700 bg-gray-100 rounded-lg">
            <div>
              <h4 className="text-white dark:text-white text-gray-900 font-medium">Data Collection</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Allow us to collect usage data for personalization</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700 dark:bg-gray-700 bg-gray-100 rounded-lg">
            <div>
              <h4 className="text-white dark:text-white text-gray-900 font-medium">Location Services</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Use your location for regional news</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700 dark:bg-gray-700 bg-gray-100 rounded-lg">
            <div>
              <h4 className="text-white dark:text-white text-gray-900 font-medium">Third-party Analytics</h4>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Allow third-party analytics for service improvement</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'preferences':
        return renderPreferences();
      case 'profile':
        return renderUserProfile();
      case 'privacy':
        return renderPrivacySecurity();
      default:
        return renderPreferences();
    }
  };

  return (
    <motion.div 
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex">
        {/* Sidebar Navigation */}
        <motion.div 
          className="w-64 min-h-screen p-6 border-r transition-colors duration-500"
          style={{ 
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
            borderColor: isDarkMode ? '#475569' : '#cbd5e1'
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-2xl font-bold mb-2"
            style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Settings
          </motion.h1>
          <motion.p 
            className="text-sm mb-8"
            style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Customize your news experience and manage your account
          </motion.p>
          
          <nav className="space-y-3">
            {[
              { id: 'preferences', label: 'Preferences', icon: FaCog },
              { id: 'profile', label: 'User Profile', icon: FaUser },
              { id: 'privacy', label: 'Privacy & Security', icon: FaShieldAlt }
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: activeTab === tab.id 
                    ? (isDarkMode ? '#0ea5e9' : '#0891b2')
                    : 'transparent',
                  color: activeTab === tab.id 
                    ? '#ffffff'
                    : (isDarkMode ? '#e2e8f0' : '#475569')
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  x: 4,
                  backgroundColor: activeTab === tab.id 
                    ? (isDarkMode ? '#0284c7' : '#0e7490')
                    : (isDarkMode ? '#334155' : '#f1f5f9')
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ rotate: activeTab === tab.id ? 0 : 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <tab.icon className="text-sm" />
                </motion.div>
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
