import React, { useState } from 'react';
import axios from 'axios';


function ImageUploader() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedImage);
        const secretToken = sessionStorage.getItem('secretToken');
        try {
            const response = await axios.post('http://localhost:8000/v1/image', formData, {
                headers: {
                    'Authorization': `Bearer ${secretToken}`
                }
            });
            const data = await response.json();
            console.log(data);
            // Handle success
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleImageChange} />
            <button type="submit">Upload Image</button>
        </form>
    );
}

export default ImageUploader;
