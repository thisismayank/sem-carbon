import React, { useState, useEffect } from 'react';
import axios from "axios";

function DashboardScreen() {

    // 1. Need to see all the booked slots 
    // 2. Need to see all the available slots sorted by day
    // 3. Need to see any complaint by the user
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        if (selectedDate) {
            getAvailableSlots()
        }
    }, [selectedDate])

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('name', name, 'value', value);
        setSelectedDate(value);
    }
    const getAvailableSlots = async () => {
        const secretToken = sessionStorage.getItem('secretToken');
        console.log('secer', secretToken, 'selecdate', selectedDate);
        if (selectedDate) {
            const response = await axios.get(`http://localhost:8000/v1/slots/available?date=${selectedDate}`, {
                headers: {
                    "Authorization": `Bearer ${secretToken}`
                }
            })
            const data = response.data;
            if (data.success) {
                setAvailableSlots([...data.availableSlots])
            }
        }
    }
    return <>
        <div>
            <label>
                Date:
                <input
                    type="date"
                    name="date"
                    value={selectedDate}
                    onChange={handleChange}
                    required
                />
            </label>

            <>{availableSlots}</>
        </div>
    </>;
}

export default DashboardScreen;
