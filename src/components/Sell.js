import React, { useState } from 'react';
import axios from 'axios';

function Sell() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (event) => {
    setImages(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      // Redirect to profile or home page
    } catch (error) {
      console.error('Failed to create listing', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <label>Images:</label>
        <input type="file" multiple onChange={handleImageChange} accept="image/*" required />
      </div>
      <button type="submit">Create Listing</button>
    </form>
  );
}

export default Sell;
