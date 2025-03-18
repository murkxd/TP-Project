import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/listings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListings(response.data);
      } catch (error) {
        console.error('Failed to fetch listings', error);
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/listings/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(listings.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Failed to delete listing', error);
    }
  };

  return (
    <div>
      <h1>Your Listings</h1>
      <ul>
        {listings.map(listing => (
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => handleDelete(listing.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
