import React from 'react';

const PropertyCard = ({ property, isFavourite, onAdd, onRemove }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden transform hover:-translate-y-1">
      
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-extrabold text-gray-900 shadow-lg">
          ${property.price.toLocaleString()}
        </div>

        {/* Location Badge */}
        {property.location && (
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white shadow flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {property.location}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/50">
        <div>
          <h4 className="text-lg font-bold text-gray-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {property.title}
          </h4>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {property.description}
          </p>
        </div>
        
        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {isFavourite ? (
            <button
              onClick={() => onRemove(property.id)}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all duration-300 group/btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Remove Favourite
            </button>
          ) : (
            <button
              onClick={() => onAdd(property)}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-blue-600 transition-all duration-300 group/btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform text-pink-500 group-hover/btn:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Save to Favourites
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
