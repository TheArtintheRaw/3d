import React, { useState } from 'react'

const OrderModal = ({ show, toggle, color, size, file }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [postal, setPostal] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Collect the user's purchasing information and send the order data to Printful
    // Call the createAndOrderShirt function with the necessary data
  }

  return (
    <>
      {show && (
        <div className="order-modal">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <br />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <br />
            <label htmlFor="address">Address:</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <br />
            <label htmlFor="city">City:</label>
            <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            <br />
            <label htmlFor="country">Country:</label>
            <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
            <br />
            <label htmlFor="postal">Postal Code:</label>
            <input type="text" id="postal" value={postal} onChange={(e) => setPostal(e.target.value)} required />
            <br />
            <button type="button" onClick={toggle}>
              Close
            </button>
            <button type="submit">Confirm Purchase</button>
          </form>
        </div>
      )}
    </>
  )
}

export default OrderModal
