import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import Profile from './components/Profile';
import CreateListing from './components/CreateListing';
import EditListing from './components/EditListing';
import ListingDetail from './components/ListingDetail';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/edit/:id" element={<EditListing />} />
      </Routes>
    </div>
  );
}

export default App;