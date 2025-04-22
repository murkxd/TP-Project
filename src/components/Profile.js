import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, listingsRes] = await Promise.all([
          axios.get('http://localhost:3030/api/auth/me', { headers }),
          axios.get('http://localhost:3030/api/cars/my-listings', { headers }),
        ]);

        setUser(userRes.data);
        const listingsData = listingsRes.data;
        setListings(Array.isArray(listingsData) ? listingsData : []);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleDelete = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3030/api/cars/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Failed to delete listing', error);
    }
  };

  return (
    <>
      <header className="global-header">
        <h1>Smart Bazar</h1>
      </header>

      <div className="homepage">
        <button 
          onClick={() => window.location.href = '/'} 
          className="back-button"
        >
          ⬅ Zpět na hlavní stránku
        </button>

        <h1>Profil uživatele</h1>
        {user && <p><strong>Uživatel:</strong> {user.username}</p>}

        <h2>Moje inzeráty</h2>
        {listings.length === 0 ? (
          <p>Nemáš zatím žádné inzeráty.</p>
        ) : (
          <div className="listing-grid">
            {listings.map(listing => (
              <div
                className="listing-card"
                key={listing.id}
                onClick={(e) => {
                  if (e.target.tagName.toLowerCase() === 'button') return;
                  navigate(`/listing/${listing.id}`);
                }}
                style={{ cursor: 'pointer' }}
              >
                {listing.image ? (
                  <img src={`http://localhost:3030/${listing.image}`} alt={listing.title} />
                ) : (
                  <div className="placeholder-img">No Image</div>
                )}
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p>{Number(listing.price).toLocaleString('cs-CZ')} Kč</p>
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${listing.id}`);
                    }}
                  >
                    Upravit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(listing.id);
                    }}
                    className="delete-button"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;