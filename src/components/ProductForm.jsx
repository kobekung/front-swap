import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Product.css';

const ProductForm = ({ userId, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        status: 'available',
        userId: userId || '',
        categoryId: '',
        image: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = '';
            
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const response = await axios.post('http://localhost:3001/products/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                imageUrl = response.data.fileUrl; // Get the URL of the uploaded image
            }

            const dataToSubmit = {
                ...formData,
                status: 'available',
                userId: Number(formData.userId), // Ensure userId is a number
                categoryId: Number(formData.categoryId), // Ensure categoryId is a number
                price: Number(formData.price), // Ensure price is a number
                image: imageUrl || formData.image, // Use uploaded image URL or the existing URL
            };

            console.log('Submitting data:', dataToSubmit);
            await axios.post('http://localhost:3001/products/create', dataToSubmit, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSuccessMessage('Product created successfully!');
            setFormData({
                name: '',
                price: '',
                description: '',
                status: 'available',
                userId: userId || '',
                categoryId: '',
                image: '',
            });
            setError('');
            setImageFile(null);

            setTimeout(() => {
                setSuccessMessage('');
                onClose(); // Close the form after success
            }, 3000);
        } catch (error) {
            console.error('Error creating product:', error.response ? error.response.data : error.message);
            setError('Failed to create product.');
        }
    };

    return (
        <div className="product-form">
            <h2>Create Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0" 
                        step="1" 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="available">Available</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="categoryId">Category:</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Submit and Close buttons */}
                <div className="form-actions">
                    <button type="submit" className="add-product-btn">Create Product</button>
                    <button type="button" className="close-btn1" onClick={onClose}>Close</button>
                </div>

                {/* Success and error messages */}
                {successMessage && <div className="success-message">{successMessage}</div>}
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default ProductForm;
