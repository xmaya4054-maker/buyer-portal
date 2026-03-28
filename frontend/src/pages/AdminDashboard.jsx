import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [usersFavourites, setUsersFavourites] = useState([]);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' or 'users'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    location: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        navigate('/login');
        return;
      }
      setUser(JSON.parse(storedUser));
    };

    fetchUser();
    loadProperties();
  }, [navigate]);

  const loadProperties = async () => {
    try {
      const [propRes, favRes] = await Promise.all([
        api.get('/properties'),
        api.get('/favourites/all')
      ]);
      setProperties(propRes.data);
      setUsersFavourites(favRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (property) => {
    setIsEditing(true);
    setFormData({
      _id: property._id,
      title: property.title,
      description: property.description,
      price: property.price,
      imageUrl: property.imageUrl,
      location: property.location || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${id}`);
        toast.success('Property deleted');
        loadProperties();
      } catch (error) {
        toast.error('Error deleting property');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/properties/${formData._id}`, {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          imageUrl: formData.imageUrl,
          location: formData.location,
        });
        toast.success('Property updated');
      } else {
        await api.post('/properties', {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          imageUrl: formData.imageUrl,
          location: formData.location,
        });
        toast.success('Property added');
      }
      setIsEditing(false);
      setFormData({ _id: '', title: '', description: '', price: '', imageUrl: '', location: '' });
      loadProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving property');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header user={user} />
      <main className="container mx-auto px-4 lg:px-8 py-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Control Center</h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Manage properties and monitor user activity across the portal.</p>
          </div>
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex space-x-1">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-2.5 font-bold rounded-xl transition-all duration-300 text-sm ${
                activeTab === 'properties' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center"><span className="mr-2">🏠</span> Manage Properties</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2.5 font-bold rounded-xl transition-all duration-300 text-sm ${
                activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center"><span className="mr-2">👥</span> User Activity</span>
            </button>
          </div>
        </div>

        {activeTab === 'properties' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm h-fit border border-gray-100 sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                {isEditing ? '✏️ Edit Property' : '✨ Add New Property'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Modern Villa"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the property..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="500000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Miami"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="pt-4 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    {isEditing ? 'Save Changes' : 'Publish Property'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ _id: '', title: '', description: '', price: '', imageUrl: '', location: '' });
                      }}
                      className="w-full mt-3 bg-slate-100 text-slate-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Properties List Section */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 px-2">Live Registry</h3>
              {properties.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-500 font-medium text-lg">No properties listed yet. Create one via the form!</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Property Title</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {properties.map((prop) => (
                        <tr key={prop._id} className="hover:bg-slate-50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <img src={prop.imageUrl} alt={prop.title} className="h-10 w-10 rounded-lg object-cover mr-4 shadow-sm" />
                              <span className="font-semibold text-slate-800">{prop.title}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-600">{prop.location}</td>
                          <td className="py-4 px-6 font-bold text-indigo-600">${prop.price.toLocaleString()}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => startEdit(prop)}
                              className="bg-blue-50 text-blue-600 font-bold py-1.5 px-4 rounded-lg mr-2 hover:bg-blue-600 hover:text-white transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(prop._id)}
                              className="bg-red-50 text-red-600 font-bold py-1.5 px-4 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* User Activity Tab */
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-2xl font-bold mb-8 text-gray-800">Platform Favourites Logs</h3>
            {usersFavourites.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <span className="text-4xl mb-4 block">👀</span>
                <p className="text-slate-500 font-medium text-lg">No properties have been saved by users yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Property</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Location Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersFavourites.map((fav) => (
                      <tr key={fav._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800">{fav.user?.name || 'Unknown User'}</div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">{fav.user?.email || 'N/A'}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-indigo-600">{fav.title}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                            {fav.location || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
