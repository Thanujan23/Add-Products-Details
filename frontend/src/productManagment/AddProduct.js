import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddProduct = () => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [category, setCategory] = useState('Dry Products');
    const [description, setDescription] = useState('');
    const [expDate, setExpDate] = useState('');
    const [manufactureDate, setManufactureDate] = useState('');

    // Validation state
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Validate individual fields
    const validateField = (field, value) => {
        let error = '';

        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        switch (field) {
            case 'name':
                if (!value.trim()) {
                    error = "Product name is required";
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = "Product name cannot contain numbers or special characters";
                }
                break;

            case 'description':
                if (!value.trim()) error = "Product description is required";
                break;

                case 'quantity':
                    if (!value || isNaN(value) || value <= 0 || !/^\d+$/.test(value)) {
                        error = "Quantity must be a positive integer";
                    }
                    break;
                
                case 'price':
                    if (!value || isNaN(value) || value <= 0 || !/^\d+(\.\d{1,2})?$/.test(value)) {
                        error = "Price must be a positive number with up to two decimal places";
                    }
                    break;                

            case 'file':
                if (!value) error = "Please upload an image";
                break;

            case 'manufactureDate':
                if (!value) error = "Manufacture date is required";
                else if (value > today) error = "Manufacture date cannot be after the current date";
                break;

            case 'expDate':
                if (!value) error = "Expiration date is required";
                else if (value < today) error = "Expiration date cannot be before the current date";
                else if (value < manufactureDate) error = "Expiration date cannot be before the manufacture date";
                break;

            case 'discount':
                if (value && (isNaN(value) || value < 0 || value > 100)) error = "Discount must be a number between 0 and 100";
                break;

            default:
                break;
        }

        return error;
    };

    // Validate form fields
    const validateForm = () => {
        let errors = {};
        errors.name = validateField('name', name);
        errors.description = validateField('description', description);
        errors.quantity = validateField('quantity', quantity);
        errors.price = validateField('price', price);
        errors.file = validateField('file', file);
        errors.manufactureDate = validateField('manufactureDate', manufactureDate);
        errors.expDate = validateField('expDate', expDate);
        errors.discount = validateField('discount', discount);

        setErrors(errors);
        return Object.keys(errors).every(key => !errors[key]); // Returns true if no errors
    };

    // Handle form submission
    const handleUpload = () => {
        if (!validateForm()) return; // If the form is invalid, stop submission

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('category', category);
        formData.append('expDate', expDate);
        formData.append('manufactureDate', manufactureDate);

        axios.post('http://localhost:5000/api/products/upload', formData)
            .then(res => {
                console.log('Upload response:', res.data);
                navigate('/admin-product');
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Individual field change handlers with validation
    const handleChange = (field, value) => {
        switch (field) {
            case 'name':
                setName(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'quantity':
                setQuantity(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'file':
                const selectedFile = value;
                setFile(selectedFile);

                // Display the selected image immediately
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(selectedFile);
                break;
            case 'manufactureDate':
                setManufactureDate(value);
                break;
            case 'expDate':
                setExpDate(value);
                break;
            case 'discount':
                setDiscount(value);
                break;
            default:
                break;
        }

        // Validate the field after updating its value
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: validateField(field, value)
        }));
    };
    const Header = () => {
        return (
            <div className="bg-green-800 text-white p-4 flex justify-center items-center shadow-md">
                <div className="flex space-x-6">
                    <Link to='/view-product' className="hover:text-green-300 transition-colors duration-300">Home</Link>
                    <Link to='/add-product' className="hover:text-green-300 transition-colors duration-300">Add Product</Link>
                    <Link to='/admin-product' className="hover:text-green-300 transition-colors duration-300">Manage Product</Link>
                    <Link to='/dashboard' className="hover:text-green-300 transition-colors duration-300">Dashboard</Link>
                </div>
            </div>
        );
    };

    return (

        <div>
                    <Header />{Header}
            <div className="bg-green-50 min-h-screen">
                <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg border border-green-200">
                    <h2 className="text-3xl font-bold mb-6 text-center text-green-800">Add New Product</h2>

                    <div className="space-y-8">
                        {/* General Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">General Information</h3>
                            <input 
                                type="text" 
                                placeholder="Product Name" 
                                value={name} 
                                onChange={e => handleChange('name', e.target.value)} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.name && <p className="text-red-600">{errors.name}</p>}

                            <textarea
                                placeholder="Product Description"
                                value={description}
                                onChange={e => handleChange('description', e.target.value)}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                            {errors.description && <p className="text-red-600">{errors.description}</p>}

                            <select
                                value={category}
                                onChange={e => handleChange('category', e.target.value)}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Dry Products">Dry Products</option>
                                <option value="Seafood">Seafood</option>
                                <option value="Handmade Eatable">Handmade Eatable</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Dairy Products">Dairy Products</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                        </div>

                        {/* Pricing and Stock */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Pricing and Stock</h3>
                            <input 
                                type="text" 
                                placeholder="Base Price" 
                                value={price} 
                                onChange={e => handleChange('price', e.target.value)} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.price && <p className="text-red-600">{errors.price}</p>}

                            <input 
                                type="number" 
                                placeholder="Stock" 
                                value={quantity} 
                                onChange={e => handleChange('quantity', e.target.value)} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.quantity && <p className="text-red-600">{errors.quantity}</p>}
                        </div>

                        {/* Date Inputs */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Manufacture and Expiration Dates</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-green-600">Manufacture Date</h4>
                                    <input
                                        type="date"
                                        value={manufactureDate}
                                        onChange={e => handleChange('manufactureDate', e.target.value)}
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.manufactureDate && <p className="text-red-600">{errors.manufactureDate}</p>}
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-green-600">Expiration Date</h4>
                                    <input
                                        type="date"
                                        value={expDate}
                                        onChange={e => handleChange('expDate', e.target.value)}
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.expDate && <p className="text-red-600">{errors.expDate}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Product Image</h3>
                            <input 
                                type="file" 
                                onChange={e => handleChange('file', e.target.files[0])} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover border rounded-lg" />
                                </div>
                            )}
                            {errors.file && <p className="text-red-600">{errors.file}</p>}
                        </div>

                        {/* Discount */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Discount</h3>
                            <input 
                                type="number" 
                                placeholder="Discount (%)" 
                                value={discount} 
                                onChange={e => handleChange('discount', e.target.value)} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.discount && <p className="text-red-600">{errors.discount}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleUpload}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Upload Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
