import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

export const featuresList = [
  'ABS, ESP, ASR',
  'Asistent jízdy v pruhu',
  'Asistent rozjezdu do kopce',
  'Hlídání mrtvého úhlu',
  'Samočinné stmívání zrcátek',
  'Tísňový systém SOS',
  'ISOFIX',
  'Automatická parkovací brzda',
  'Tempomat',
  'Adaptivní tempomat',
  'Automatické dálkové světlomety',
  'Parkovací senzory',
  'Zadní parkovací kamera',
  '360° kamera',
  'Klimatizace',
  'Dvouzónová klimatizace',
  'Vyhřívaná sedadla',
  'Ventilovaná sedadla',
  'Elektrická sedadla',
  'Masážní sedadla',
  'Vyhřívaný volant',
  'Nezávislé topení',
  'Elektrické víko kufru',
  'Bezdotykové odemykání/start',
  'Dešťový senzor',
  'Ambientní osvětlení',
  'Dělená zadní sedadla',
  'Head-up displej',
  'Integrace chytrého telefonu',
  'Prémiový audiosystém',
  'Zadní infotainment systém',
  'Navigace',
  'Bluetooth',
  'Bezdrátové nabíjení',
  'DAB rádio',
  'USB porty',
  'Střešní okno',
  'Panoramatická střecha',
  'Mlhovky',
  'Střešní nosiče',
  'Tažné zařízení'
];

function Home() {
  const [listings, setListings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [filters, setFilters] = useState({
    fuel_type: '',
    drivetrain: '',
    min_price: '',
    max_price: '',
    feature: '',
    sort_by: ''
  });

  const fetchListings = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        search,
        features: JSON.stringify(selectedFeatures)
      });
  
      const response = await axios.get(`http://localhost:3030/api/cars/all?${queryParams.toString()}`);
      const data = response.data;
      if (Array.isArray(data)) {
        setListings(data);
      } else {
        console.error('Expected array, got:', data);
        setListings([]);
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  useEffect(() => {
    fetchListings();
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [filters, search, selectedFeatures]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleApplyFilters = () => {
    fetchListings();
  };

  return (
    <>
      <header className="global-header">
        <h1>Smart Bazar</h1>
        <div className="auth-buttons right">
          {isLoggedIn ? (
            <>
              <button onClick={() => window.location.href = '/profile'}>Profil</button>
              <button onClick={handleLogout}>Odhlásit</button>
              <button onClick={() => window.location.href = '/create-listing'} className="create-button">
                + Vytvořit inzerát
              </button>
            </>
          ) : (
            <button onClick={() => window.location.href = '/login'}>Přihlásit</button>
          )}
        </div>
      </header>
      <div className="homepage">
        <h2 className="homepage-title">Inzeráty</h2>

        <div className="filters-container">
          <input
            type="text"
            placeholder="Značka, model"
            value={search}
            onChange={handleSearchChange}
          />

          <select name="fuel_type" value={filters.fuel_type} onChange={handleFilterChange}>
            <option value="">Palivo</option>
            <option value="Petrol">Benzín</option>
            <option value="Diesel">Nafta</option>
            <option value="Electric">Elektro</option>
            <option value="LPG">LPG</option>
            <option value="CNG">CNG</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Hydrogen">Vodík</option>
            <option value="Other">Jiné</option>
          </select>

          <select name="drivetrain" value={filters.drivetrain} onChange={handleFilterChange}>
            <option value="">Pohon</option>
            <option value="FWD">Přední</option>
            <option value="RWD">Zadní</option>
            <option value="AWD">4x4</option>
          </select>

          <div className="form-group">
          <div className="dropdown-checkbox">
            <button
              type="button"
              id="feature-button"
              onClick={() =>
                document.getElementById('features-dropdown').classList.toggle('show')
              }
            >
              Výbava
            </button>
            <div id="features-dropdown" className="dropdown-content">
              {featuresList.map((feature, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`feature-${index}`}
                    value={feature}
                    checked={selectedFeatures.includes(feature)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setSelectedFeatures((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((f) => f !== value)
                      );
                    }}
                  />
                  <label htmlFor={`feature-${index}`}>{feature}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

          <input
            type="number"
            name="min_price"
            placeholder="Min. cena"
            value={filters.min_price}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="max_price"
            placeholder="Max. cena"
            value={filters.max_price}
            onChange={handleFilterChange}
          />

          <select name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
            <option value="">Seřadit</option>
            <option value="price_asc">Cena ↑</option>
            <option value="price_desc">Cena ↓</option>
            <option value="date_newest">Nejnovější</option>
            <option value="date_oldest">Nejstarší</option>
          </select>
        </div>

        <div className="listing-grid">
          {listings.map(listing => (
            <div
              className="listing-card"
              key={listing.id}
              onClick={() => window.location.href = `/listing/${listing.id}`}
            >
              {listing.image ? (
                <img
                  src={`http://localhost:3030/${listing.image}`}
                  alt={listing.title}
                  className="listing-img"
                />
              ) : (
                <div className="placeholder-img">No Image</div>
              )}
              <div className="listing-info">
                <h3>{listing.title}</h3>
                <p>{Number(listing.price).toLocaleString('cs-CZ')} Kč</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
