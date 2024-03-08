import React, { useState } from 'react';
import axios from 'axios';


function ImageUploader() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [responseData, setResponseData] = useState(null);


    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedImage);
        const secretToken = sessionStorage.getItem('secretToken');
        const userId = sessionStorage.getItem('userId');

        try {
            const response = await axios.post('http://localhost:8000/v1/image', formData, {
                headers: {
                    'Authorization': `${userId},${secretToken}`,
                }
            });
            const data = await response.data;
            console.log('data', data);
            setResponseData({ ...data });
            console.log('resp', responseData);
            // Handle success

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (<>
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleImageChange} />
            <button type="submit">Upload Image</button>
        </form>
        {responseData && <div style={{ height: 100, width: 600, margin: 32, padding: 32, alignContent: "center", alignItems: "center", backgroundColor: "greenyellow", fontWeight: "bold" }}>
            <table>
                <tr>
                    <td>Message: </td>
                    <td style={{ padding: 8 }}>{responseData.message}</td>
                </tr>
                <tr>
                    <td>Slot: </td>
                    <td style={{ padding: 8 }}>{responseData.slot}</td>
                </tr>
                <tr>
                    <td>Location: </td>
                    <td style={{ padding: 8 }}>{responseData.location}</td>
                </tr>
            </table>
        </div>}
    </>
    );
}

export default ImageUploader;
