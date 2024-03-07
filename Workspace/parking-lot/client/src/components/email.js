import React, { useState } from 'react';
import axios from "axios";

function EmailScreen({ onOtpSet }) {
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('HERREEE')
        try {
            const response = await axios.post('http://localhost:8000/v1/email', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;
            if (data.success) {
                onOtpSet(data.otp);
                sessionStorage.setItem('isLogin', data.isLogin)
                sessionStorage.setItem('email', data.email)
                sessionStorage.setItem('type', data.type)
            }
            // Handle success or navigate to OTP screen
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <button type="submit">Send</button>
        </form>
    );
}

export default EmailScreen;
