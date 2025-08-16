import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, locationAPI } from '../services/api';
import { FaUser, FaCog, FaHistory, FaBookmark, FaHeart, FaGlobe, FaNewspaper, FaSave } from 'react-icons/fa';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState({
    topics: [],
    sources: [],
    countries: []
  });
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [detectedLocation, setDetectedLocation] = useState(null);

  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'in', name: 'India' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'au', name: 'Australia' },
    { code: 'ca', name: 'Canada' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'jp', name: 'Japan' },
    { code: 'cn', name: 'China' },
    { code: 'br', name: 'Brazil' }
  ];

  const topics = [
    'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'
  ];

  const sources = [
    'BBC News', 'CNN', 'Reuters', 'The New York Times', 'The Guardian', 'Al Jazeera',
    'NPR', 'ABC News', 'CBS News', 'NBC News', 'Fox News', 'MSNBC'
  ];

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // Fetch detected location
    locationAPI.getLocation().then(loc => setDetectedLocation(loc.location)).catch(() => setDetectedLocation(null));
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userAPI.getProfile();
      setProfile(profileData);
      setPreferences(profileData.preferences || { topics: [], sources: [], countries: [] });
      
      // Load recently viewed articles
      const historyData = await userAPI.getRecentlyViewed();
      setRecentlyViewed(historyData.recently_viewed || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (type, value, checked) => {
    setPreferences(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  const savePreferences = async () => {
    try {
      await userAPI.updatePreferences(preferences);
      updateUser({ preferences });
      alert('Preferences saved successfully!');
    } catch (error) {
      alert('Failed to save preferences: ' + error.message);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-red-400 text-center">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center text-gray-400">Please login to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username || user.email}</h1>
              <p className="text-cyan-100">News Aggregator User</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex">
            {[
              { id: 'profile', label: 'Profile', icon: FaUser },
              { id: 'preferences', label: 'Preferences', icon: FaCog },
              { id: 'history', label: 'Reading History', icon: FaHistory },
              { id: 'bookmarks', label: 'Bookmarks', icon: FaBookmark },
              { id: 'liked', label: 'Liked Articles', icon: FaHeart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-cyan-500 text-cyan-400 font-semibold'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="text-sm" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">Account Information</h3>
                  <p className="text-gray-300"><strong>Email:</strong> {user.email}</p>
                  <p className="text-gray-300"><strong>Username:</strong> {user.username || 'N/A'}</p>
                  <p className="text-gray-300"><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
                  <p className="text-gray-300"><strong>Detected Location:</strong> {detectedLocation ? `${detectedLocation.city || ''}${detectedLocation.city ? ', ' : ''}${detectedLocation.region || ''}${detectedLocation.region ? ', ' : ''}${detectedLocation.country_name || detectedLocation.country_code || 'Unknown'}` : 'Detecting...'}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">Statistics</h3>
                  <p className="text-gray-300"><strong>Bookmarks:</strong> {user.bookmarks?.length || 0}</p>
                  <p className="text-gray-300"><strong>Liked articles:</strong> {user.liked_articles?.length || 0}</p>
                  <p className="text-gray-300"><strong>Reading history:</strong> {user.reading_history?.length || 0}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">News Preferences</h3>
                <button
                  onClick={savePreferences}
                  className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Save Preferences
                </button>
              </div>

              {/* Countries */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                  <FaGlobe />
                  Preferred Countries
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {countries.map(country => (
                    <label key={country.code} className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={preferences.countries.includes(country.code)}
                        onChange={(e) => handlePreferenceChange('countries', country.code, e.target.checked)}
                        className="rounded bg-gray-700 border-gray-600"
                      />
                      {country.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                  <FaNewspaper />
                  Preferred Topics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {topics.map(topic => (
                    <label key={topic} className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={preferences.topics.includes(topic)}
                        onChange={(e) => handlePreferenceChange('topics', topic, e.target.checked)}
                        className="rounded bg-gray-700 border-gray-600"
                      />
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <h4 className="font-semibold mb-3 text-white">Preferred Sources</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {sources.map(source => (
                    <label key={source} className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={preferences.sources.includes(source)}
                        onChange={(e) => handlePreferenceChange('sources', source, e.target.checked)}
                        className="rounded bg-gray-700 border-gray-600"
                      />
                      {source}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reading History Tab */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Recently Viewed Articles</h3>
              {recentlyViewed.length > 0 ? (
                <div className="space-y-2">
                  {recentlyViewed.map((articleId, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded">
                      <a 
                        href={articleId} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        {articleId}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No reading history yet.</p>
              )}
            </div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Bookmarked Articles</h3>
              {user.bookmarks?.length > 0 ? (
                <div className="space-y-2">
                  {user.bookmarks.map((bookmark, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded">
                      <a 
                        href={bookmark} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        {bookmark}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No bookmarks yet.</p>
              )}
            </div>
          )}

          {/* Liked Articles Tab */}
          {activeTab === 'liked' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Liked Articles</h3>
              {user.liked_articles?.length > 0 ? (
                <div className="space-y-2">
                  {user.liked_articles.map((articleId, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded">
                      <a 
                        href={articleId} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        {articleId}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No liked articles yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
