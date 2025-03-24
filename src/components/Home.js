import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await axios.get('/api/featured-listings');
        setFeaturedListings(response.data);
      } catch (error) {
        console.error('Failed to fetch featured listings', error);
      }
    };

    fetchFeaturedListings();
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('/api/listings', {
        params: { query: searchQuery }
      });
      setFeaturedListings(response.data);
    } catch (error) {
      console.error('Failed to fetch search results', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <div>
      <header>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <button onClick={() => window.location.href = '/profile'}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => window.location.href = '/login'}>Login</button>
            </>
          )}
        </div>
      </header>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search listings..."
        />
        <button type="submit">Search</button>
      </form>
      <h1>Featured Listings</h1>
      <ul>
        {featuredListings.map(listing => (
          <li key={listing.id}>
            {listing.title} - {listing.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
