import React, { useEffect, useState } from 'react';
import EmailScreen from './components/email';
import OTPScreen from './components/otp';

// import Dashboard from './components/Dashboard';
import SlotBooking from './components/slotBooking';
import ImageUploader from './components/imageUploader';

function App() {
  // const userType = 'customer'; // This should be dynamically determined
  const [otp, setOtp] = useState(null)
  const [secretToken, setSecretToken] = useState(null)
  const [type, setType] = useState(null)

  useEffect(() => {
    // This effect syncs the state with sessionStorage when the component mounts
    const storedOtp = sessionStorage.getItem('otp');
    setOtp(storedOtp);
  }, []);

  useEffect(() => {
    // This effect syncs the state with sessionStorage when the component mounts
    const storedSecretToken = sessionStorage.getItem('secretToken');

    setSecretToken(storedSecretToken);

  }, []);

  useEffect(() => {
    const storedType = sessionStorage.getItem('type');
    setType(storedType);
  }, [])



  const handleOtpUpdate = (newOtp) => {
    setOtp(newOtp); // Update local state to reflect new OTP
    sessionStorage.setItem('otp', newOtp); // Optionally, ensure sessionStorage is also updated
  };

  const handleSecretTokenUpdate = (secretToken) => {
    setSecretToken(secretToken); // Update local state to reflect new OTP
    sessionStorage.setItem('secretToken', secretToken); // Optionally, ensure sessionStorage is also updated
  };

  const handleTypeUpdate = (type) => {
    setType(type); // Update local state to reflect new OTP
    sessionStorage.setItem('type', type); // Optionally, ensure sessionStorage is also updated
  };

  return (
    <div>
      {!otp ? <EmailScreen onOtpSet={handleOtpUpdate} /> : secretToken ? <></> : <OTPScreen onSecretTokenSet={handleSecretTokenUpdate} onTypeUpdate={handleTypeUpdate} />}
      {secretToken && type === 'manager' ? <><ImageUploader /><SlotBooking /></> : <></>}
    </div>
  );
}

export default App;
