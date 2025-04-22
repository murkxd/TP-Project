import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

function CreateListing() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    first_registration_year: '',
    first_registration_month: '',
    mileage: '',
    doors: '',
    fuel_type: '',
    power_kw: '',
    exterior_color: '',
    interior_material: '',
    interior_color: '',
    headlight_type: '',
    drivetrain: '',
    price: '',
    features: [],
    contact_phone: '',
  });
  const [images, setImages] = useState([]);

  const featuresList = [
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      features: checked ? [...prev.features, value] : prev.features.filter((f) => f !== value),
    }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
  
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, key === 'features' ? JSON.stringify(value) : value);
    });
    Array.from(images).forEach((img) => data.append('images', img));
  
    try {
      await axios.post('http://localhost:3030/api/cars/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Inzerát byl úspěšně vytvořen!');
      window.location.href = '/profile';
    } catch (error) {
      console.error('Chyba při vytváření inzerátu', error);
      alert('Nepodařilo se vytvořit inzerát. Zkuste to prosím znovu.');
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

        <h2 id="create-listing-heading">Vytvořit nový inzerát</h2>  

        <form className="create-listing-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Značka:</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Model:</label>
            <input type="text" name="model" value={formData.model} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Rok první registrace:</label>
            <input type="number" name="first_registration_year" value={formData.first_registration_year} onChange={handleInputChange} onWheel={(e) => e.target.blur()} required />
          </div>
          <div className="form-group">
            <label>Měsíc první registrace:</label>
            <select name="first_registration_month" value={formData.first_registration_month} onChange={handleInputChange} required>
              <option value="">Vyber</option>
              {[...Array(12).keys()].map((month) => (
                <option key={month + 1} value={month + 1}>{month + 1}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Nájezd (km):</label>
            <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} onWheel={(e) => e.target.blur()} required />
          </div>
          <div className="form-group">
            <label>Počet dveří:</label>
            <select name="doors" value={formData.doors} onChange={handleInputChange} required>
              <option value="">Vyber</option>
              <option value="2/3">2/3</option>
              <option value="4/5">4/5</option>
            </select>
          </div>
          <div className="form-group">
            <label>Palivo:</label>
            <select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} required>
              <option value="">Vyber</option>
              <option value="Petrol">Benzín</option>
              <option value="Diesel">Nafta</option>
              <option value="Electric">Elektro</option>
              <option value="LPG">LPG</option>
              <option value="CNG">CNG</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Hydrogen">Vodík</option>
              <option value="Other">Jiné</option>
            </select>
          </div>
          <div className="form-group">
            <label>Výkon (kW):</label>
            <input type="number" name="power_kw" value={formData.power_kw} onChange={handleInputChange} onWheel={(e) => e.target.blur()} required />
          </div>
          <div className="form-group">
            <label>Barva karoserie:</label>
            <input type="text" name="exterior_color" value={formData.exterior_color} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Materiál interiéru:</label>
            <select name="interior_material" value={formData.interior_material} onChange={handleInputChange} required>
              <option value="">Vyber</option>
              <option value="Full Leather">Celokožený</option>
              <option value="Part Leather">Částečně kůže</option>
              <option value="Alcantara">Alcantara</option>
              <option value="Cloth">Látka</option>
              <option value="Other">Jiné</option>
            </select>
          </div>
          <div className="form-group">
            <label>Barva interiéru:</label>
            <select name="interior_color" value={formData.interior_color} onChange={handleInputChange} required>
              <option value="">Vyber</option>
              <option value="White">Bílá</option>
              <option value="Gray">Šedá</option>
              <option value="Black">Černá</option>
              <option value="Beige">Béžová</option>
              <option value="Brown">Hnědá</option>
              <option value="Other">Jiná</option>
            </select>
          </div>
          <div className="form-group">
            <label>Typ světlometů:</label>
            <select name="headlight_type" value={formData.headlight_type} onChange={handleInputChange} required>
              <option value="">Vyber</option>
              <option value="Bi-Xenon">Bi-Xenon</option>
              <option value="Xenon">Xenon</option>
              <option value="LED">LED</option>
              <option value="Laser">Laser</option>
              <option value="Halogen">Halogen</option>
              <option value="Other">Jiné</option>
            </select>
          </div>
          <div className="form-group">
            <label>Pohon:</label>
            <select name="drivetrain" value={formData.drivetrain} onChange={handleInputChange} required>
              <option value="">Vyber</option>
              <option value="FWD">Přední</option>
              <option value="RWD">Zadní</option>
              <option value="AWD">4x4</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cena (Kč):</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} onWheel={(e) => e.target.blur()} required />
          </div>
          <div className="form-group">
            <label><strong>Výbava:</strong></label>
            <div className="feature-grid">
              {featuresList.map((feature, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`feature-${index}`}
                    value={feature}
                    onChange={handleFeatureChange}
                  />
                  <label htmlFor={`feature-${index}`}>{feature}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Kontaktní telefon:</label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fotografie:</label>
            <input type="file" multiple onChange={handleImageChange} accept="image/*" required />
          </div>
          <button type="submit">Vytvořit inzerát</button>
        </form>
      </div>
    </>
  );
}

export default CreateListing;