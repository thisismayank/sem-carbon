import React, { useState } from 'react';
import axios from "axios";

function OTPScreen({ onSecretTokenSet, onTypeUpdate }) {
    const [otp, setOtp] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const isLogin = sessionStorage.getItem('isLogin')
            const type = sessionStorage.getItem('type')
            const response = await axios.post('http://localhost:8000/v1/email/verify', { otp, isLogin, type }, {
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            const data = await response.data;
            console.log(data);
            if (data.success) {
                onSecretTokenSet(data.secretToken);
                onTypeUpdate(data.type);
                sessionStorage.setItem('display', data.display)
                sessionStorage.setItem('login', data.login)
                sessionStorage.setItem('name', data.name)
                sessionStorage.setItem('email', data.email)
            }
            // Handle verification success
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                OTP:
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </label>
            <button type="submit">Verify</button>
        </form>
    );
}

export default OTPScreen;
