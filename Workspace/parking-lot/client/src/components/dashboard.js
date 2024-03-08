import React, { useState, useEffect } from 'react';
import axios from "axios";

function DashboardScreen() {


    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);


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
                setBookedSlots([...data.bookedSlots])
            }
        }
    }
    return <>
        <div style={{ textAlign: 'center', padding: 16, }}>
            <div style={{ margin: 16, fontWeight: 'bold', fontSize: 20 }}>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={selectedDate}
                        onChange={handleChange}
                        required
                        style={{ padding: 4, margin: 8, }}
                    />
                </label>
            </div>
            <br />
            {availableSlots.length > 0 ? <div style={{ width: "40%", display: "inline-block" }}>
                <h3 >Available Slots</h3>
                <br />
                <>{availableSlots.map(slot => <div style={{ height: 20, width: 200, backgroundColor: 'green', color: "white", borderRadius: 8, padding: 8, margin: 8, display: 'inline-block' }}>{slot}</div>)}</>
            </div>
                : <></>}

            {bookedSlots.length > 0 ? <div style={{ width: "40%", display: "inline-block" }}>
                <h3 >Booked Slots</h3>
                <br />

                <>{bookedSlots.map(slot => <div style={{ height: 20, width: 200, backgroundColor: '#b00202', color: "white", borderRadius: 8, padding: 8, margin: 8, display: 'inline-block' }}>{slot}</div>)}</>
            </div >
                : <></>}
        </div>
    </>;
}

export default DashboardScreen;
