import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndData = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        navigate('/login');
        return;
      }

      setUser(JSON.parse(storedUser));

      try {
        const [favRes, propRes] = await Promise.all([
          api.get('/favourites'),
          api.get('/properties')
        ]);
        setFavourites(favRes.data);
        setProperties(propRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };

    fetchUserAndData();
  }, [navigate]);

  const handleAddFavourite = async (property) => {
    try {
      const response = await api.post('/favourites', {
        propertyId: property._id,
        title: property.title,
        description: property.description,
        price: property.price,
        imageUrl: property.imageUrl,
        location: property.location,
      });
      setFavourites([...favourites, response.data]);
      toast.success('Added to Favourites!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding favourite');
    }
  };

  const handleRemoveFavourite = async (propertyId) => {
    const favouriteToRemove = favourites.find((f) => f.propertyId === propertyId);
    if (!favouriteToRemove) return;

    try {
      await api.delete(`/favourites/${favouriteToRemove._id}`);
      setFavourites(favourites.filter((f) => f._id !== favouriteToRemove._id));
      toast.success('Removed from Favourites');
    } catch (error) {
      toast.error('Error removing favourite');
    }
  };

  const filteredProperties = properties.filter((prop) =>
    (prop.location || '').toLowerCase().includes(searchLocation.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Find Your Dream Home
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 font-medium">
            Discover premium properties curated just for you. Filter by location and save your absolute favourites.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by location (e.g. New York, Miami)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-0 ring-4 ring-white/20 focus:ring-blue-500/50 bg-white/95 backdrop-blur-sm text-lg text-gray-800 placeholder-gray-400 shadow-2xl transition-all duration-300 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-16 flex-grow -mt-10">
        <div className="flex justify-between items-end mb-8 pl-2">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {searchLocation ? 'Search Results' : 'Featured Properties'}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{filteredProperties.length} properties available</p>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏜️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-500">We couldn't find any properties matching "{searchLocation}". Try a different location.</p>
            <button 
              onClick={() => setSearchLocation('')}
              className="mt-6 text-blue-600 font-semibold hover:text-blue-800"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={{...property, id: property._id}}
                isFavourite={favourites.some((f) => f.propertyId === property._id)}
                onAdd={handleAddFavourite}
                onRemove={handleRemoveFavourite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
