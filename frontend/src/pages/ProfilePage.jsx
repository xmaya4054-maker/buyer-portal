import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        navigate('/login');
        return;
      }

      setUser(JSON.parse(storedUser));

      try {
        const response = await api.get('/favourites');
        setFavourites(response.data);
      } catch (error) {
        toast.error('Failed to load favourites');
      }
    };

    fetchProfileData();
  }, [navigate]);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header user={user} />
      <main className="container mx-auto px-4 lg:px-8 py-10 flex-grow">
        
        {/* User Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
          
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user.name}</h2>
              <p className="text-gray-500 font-medium mt-1">{user.email}</p>
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                  {user.role} account
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700">
                  Active
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none text-center bg-slate-50 border border-slate-100 px-8 py-5 rounded-2xl">
              <span className="block text-4xl font-black text-indigo-600">{favourites.length}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Saved Houses</span>
            </div>
          </div>
        </div>

        {/* Favourites Section */}
        <section>
          <div className="flex items-center mb-8 pl-2">
            <div className="p-3 bg-red-50 text-red-500 rounded-xl mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800">Your Favourites</h3>
          </div>

          {favourites.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl shadow-sm text-center border border-gray-100">
              <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No favourites yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't added any properties to your favourites. Browse the marketplace to find the home of your dreams.</p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-600 transition-colors shadow-md"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favourites.map((fav) => (
                <PropertyCard
                  key={fav._id}
                  property={{
                    id: fav.propertyId,
                    title: fav.title,
                    price: fav.price,
                    description: fav.description,
                    imageUrl: fav.imageUrl,
                    location: fav.location,
                  }}
                  isFavourite={true}
                  onAdd={() => {}}
                  onRemove={handleRemoveFavourite}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
