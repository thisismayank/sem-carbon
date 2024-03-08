import React, { useState, useEffect } from 'react';
import axios from 'axios';
function SlotBooking() {
    const [bookingDetails, setBookingDetails] = useState({
        date: '',
        location: ''
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [responseDataBooking, setResponseDataBooking] = useState(null);

    useEffect(() => {
        if (bookingDetails.date && bookingDetails.location) {
            fetchAvailableSlots();
        }
    }, [bookingDetails.date, bookingDetails.location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
        // Reset slots when changing date or location
        if (name === 'date' || name === 'location') {
            setAvailableSlots([]);
            setSelectedSlot('');
        }
    };

    const fetchAvailableSlots = async () => {
        const storedSecretToken = sessionStorage.getItem('secretToken');

        const response = await axios.get(`http://localhost:8000/v1/slots?date=${bookingDetails.date}&location=${bookingDetails.location}`, {
            headers: {
                'Authorization': `Bearer ${storedSecretToken}`,
            },
        });
        const data = await response.data;
        console.log('data', data);

        setAvailableSlots(data || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedSecretToken = sessionStorage.getItem('secretToken');

        console.log('Selected Slot:', selectedSlot);
        const response = await axios.post(`http://localhost:8000/v1/slots`, { date: bookingDetails.date, location: bookingDetails.location, slot: selectedSlot }, {
            headers: {
                'Authorization': `Bearer ${storedSecretToken}`,
            },
        });
        const data = await response.data;
        console.log('data', data);
        if (data.success) {
            sessionStorage.setItem('bookingSlot', data.slot)
            sessionStorage.setItem('bookingDate', data.date)
            sessionStorage.setItem('bookingLocation', data.location)
            sessionStorage.setItem('bookingDone', data.bookingDone)
            setResponseDataBooking({ ...data })
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Date and Location selection */}
            <div>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={bookingDetails.date}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Location:
                    <select name="location" value={bookingDetails.location} onChange={handleChange} required>
                        <option value="">Select a location</option>
                        <option value="location1">Location 1</option>
                        <option value="location2">Location 2</option>
                    </select>
                </label>
            </div>

            {/* Display available slots */}
            <div>
                {availableSlots.length > 0 ? (
                    <div>
                        <p>Select a slot:</p>
                        {availableSlots.map((slot, index) => (
                            <button key={index} type="button" onClick={() => setSelectedSlot(slot)} style={{ margin: "5px", backgroundColor: selectedSlot === slot ? 'green' : 'white' }}>
                                {slot}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p>No slots available. Please select a date and location.</p>
                )}
            </div>

            <button type="submit" disabled={!selectedSlot}>Book Slot</button>

            {responseDataBooking && <div style={{ height: 100, width: 600, margin: 32, padding: 32, alignContent: "center", alignItems: "center", backgroundColor: "greenyellow", fontWeight: "bold" }}>
                <table>
                    <tr>
                        <td>Message: </td>
                        <td style={{ padding: 8 }}>{responseDataBooking.message}</td>
                    </tr>
                    <tr>
                        <td>Slot: </td>
                        <td style={{ padding: 8 }}>{responseDataBooking.slot}</td>
                    </tr>
                    <tr>
                        <td>Location: </td>
                        <td style={{ padding: 8 }}>{responseDataBooking.location}</td>
                    </tr>
                </table>
            </div>}
        </form>
    );
}

export default SlotBooking;
