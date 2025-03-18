import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [brand, setBrand] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [mileage, setMileage] = useState('');
  const [price, setPrice] = useState('');
  const [drivetrain, setDrivetrain] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('/api/listings', {
        params: {
          brand,
          fuelType,
          mileage,
          price,
          drivetrain
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <label>Brand:</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div>
          <label>Fuel Type:</label>
          <input type="text" value={fuelType} onChange={(e) => setFuelType(e.target.value)} />
        </div>
        <div>
          <label>Mileage:</label>
          <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>Drivetrain:</label>
          <input type="text" value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)} />
        </div>
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map(result => (
          <li key={result.id}>
            {result.title} - {result.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
