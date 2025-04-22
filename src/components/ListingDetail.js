import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

function ListingDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const formatPhone = (phone) => {
    if (!phone) return '';
    if (phone.includes(' ')) return phone;
  
    const cleaned = phone.replace(/[^\d+]/g, '');
  
    if (cleaned.startsWith('+420') && cleaned.length === 13) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10, 13)}`;
    }
  
    return phone;
  };

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/api/cars/details/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error('Chyba při načítání detailu vozu:', error);
      }
    };

    fetchCar();
  }, [id]);

  if (!car) return <div className="detail-container">Načítání...</div>;

  return (
    <>
      <header className="global-header">
        <h1>Smart Bazar</h1>
      </header>
  
      <div className="detail-container">
        <button 
          className="back-button"
          onClick={() => window.location.href = '/'}
        >
          ⬅ Zpět na hlavní stránku
        </button>
  
        <h1>{car.brand} {car.model}</h1>
  
        <div className="detail-gallery">
          {Array.isArray(car.images) && car.images.length > 0 ? (
            car.images.map((img, i) => (
              <img key={i} src={`http://localhost:3030/${img}`} alt={`car-${i}`} />
            ))
          ) : (
            <p className="no-images">Žádné obrázky k dispozici.</p>
          )}
        </div>
  
        <div className="detail-info">
          <p><strong>Cena:</strong> {Number(car.price).toLocaleString('cs-CZ')} Kč</p>
          <p><strong>Registrace:</strong> {car.first_registration_month}/{car.first_registration_year}</p>
          <p><strong>Nájezd:</strong> {Number(car.mileage).toLocaleString('cs-CZ')} km</p>
          <p><strong>Výkon:</strong> {car.power_kw} kW</p>
          <p><strong>Barva:</strong> {car.exterior_color}</p>
          <p><strong>Palivo:</strong> {car.fuel_type}</p>
          <p><strong>Pohon:</strong> {car.drivetrain}</p>
          <p><strong>Světla:</strong> {car.headlight_type}</p>
          <p><strong>Interiér:</strong> {car.interior_material}, {car.interior_color}</p>
        </div>
  
        <div className="detail-features">
          <h3>Výbava</h3>
          {Array.isArray(car.features) && car.features.length > 0 ? (
            <ul>
              {car.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          ) : (
            <p>Bez specifikované výbavy.</p>
          )}
        </div>
  
        <p><strong>Inzerující:</strong> {car.username}</p>
        <p><strong>Kontakt:</strong> {formatPhone(car.contact_phone)}</p>
      </div>
    </>
  );
}

export default ListingDetail;