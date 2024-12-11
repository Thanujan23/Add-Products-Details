import React, { useState } from 'react';
import axios from 'axios';

const UpdateProductPopup = ({ product, onClose, onUpdate }) => {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [quantity, setQuantity] = useState(product.quantity);
    const [price, setPrice] = useState(product.price);
    const [discount, setDiscount] = useState(product.discount || 0);
    const [category, setCategory] = useState(product.category || '');
    const [expDate, setExpDate] = useState(product.expDate ? new Date(product.expDate).toISOString().substr(0, 10) : '');
    const [manufactureDate, setManufactureDate] = useState(product.manufactureDate ? new Date(product.manufactureDate).toISOString().substr(0, 10) : '');

    // Validation state
    const [errors, setErrors] = useState({});

    // Validation functions
    const validateName = (value) => {
        if (!value.trim()) return "Product name is required";
        return null;
    };

    const validateDescription = (value) => {
        if (!value.trim()) return "Product description is required";
        return null;
    };

    const validateQuantity = (value) => {
        if (!value || value <= 0 || isNaN(value) || /\D/.test(value)) return "Quantity must be a positive number";
        return null;
    };

    const validatePrice = (value) => {
        if (!value || value <= 0 || isNaN(value) || /\D/.test(value)) return "Price must be a positive number";
        return null;
    };

    const validateDiscount = (value) => {
        if (isNaN(value) || value < 0 || value > 100) return "Discount must be a number between 0 and 100";
        return null;
    };

    const validateExpDate = (value) => {
        const today = new Date().toISOString().split('T')[0];
        if (value < today) return "Expiration date cannot be before the current date";
        if (value < manufactureDate) return "Expiration date cannot be before the manufacture date";
        return null;
    };

    const validateManufactureDate = (value) => {
        const today = new Date().toISOString().split('T')[0];
        if (value > today) return "Manufacture date cannot be after the current date";
        return null;
    };

    // Handle change and validation
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setErrors((prev) => ({ ...prev, name: validateName(value) }));
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        setErrors((prev) => ({ ...prev, description: validateDescription(value) }));
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setQuantity(value);
        setErrors((prev) => ({ ...prev, quantity: validateQuantity(value) }));
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);
        setErrors((prev) => ({ ...prev, price: validatePrice(value) }));
    };

    const handleDiscountChange = (e) => {
        const value = e.target.value;
        setDiscount(value);
        setErrors((prev) => ({ ...prev, discount: validateDiscount(value) }));
    };

    const handleExpDateChange = (e) => {
        const value = e.target.value;
        setExpDate(value);
        setErrors((prev) => ({ ...prev, expDate: validateExpDate(value) }));
    };

    const handleManufactureDateChange = (e) => {
        const value = e.target.value;
        setManufactureDate(value);
        setErrors((prev) => ({ ...prev, manufactureDate: validateManufactureDate(value) }));
    };

    // Check if form has changed
    const isFormChanged = () => {
        return (
            name !== product.name ||
            description !== product.description ||
            quantity !== product.quantity ||
            price !== product.price ||
            discount !== (product.discount || 0) ||
            category !== product.category ||
            expDate !== (product.expDate ? new Date(product.expDate).toISOString().substr(0, 10) : '') ||
            manufactureDate !== (product.manufactureDate ? new Date(product.manufactureDate).toISOString().substr(0, 10) : '')
        );
    };

    const handleSave = () => {
        let errors = {};

        // Validate all fields before submission
        errors.name = validateName(name);
        errors.description = validateDescription(description);
        errors.quantity = validateQuantity(quantity);
        errors.price = validatePrice(price);
        errors.discount = validateDiscount(discount);
        errors.expDate = validateExpDate(expDate);
        errors.manufactureDate = validateManufactureDate(manufactureDate);

        setErrors(errors);

        if (Object.values(errors).some(error => error !== null)) return; // If any error exists, stop submission

        // Proceed with the update
        axios.put(`http://localhost:5000/api/products/update/${product._id}`, {
            name, description, quantity, price, discount, category, expDate, manufactureDate
        })
        .then(() => {
            onUpdate(); // Refresh product list
            onClose(); // Close the popup
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-xl font-semibold mb-4">Update Product</h3>

                {/* Form Fields */}
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Product Name"
                />
                {errors.name && <p className="text-red-600 text-sm mb-2">{errors.name}</p>}

                <input
                    type="text"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Description"
                />
                {errors.description && <p className="text-red-600 text-sm mb-2">{errors.description}</p>}

                <input
                    type="number"
                    value={price}
                    onChange={handlePriceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Price"
                />
                {errors.price && <p className="text-red-600 text-sm mb-2">{errors.price}</p>}

                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Quantity"
                />
                {errors.quantity && <p className="text-red-600 text-sm mb-2">{errors.quantity}</p>}

                <input
                    type="number"
                    value={discount}
                    onChange={handleDiscountChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Discount (%)"
                />
                {errors.discount && <p className="text-red-600 text-sm mb-2">{errors.discount}</p>}

                {/* Category Dropdown */}
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                >
                    <option value="">Select Category</option>
                    <option value="Dry Products">Dry Products</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Handmade Eatable">Handmade Eatable</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Snacks">Snacks</option>
                </select>

                <input
                    type="date"
                    value={expDate}
                    onChange={handleExpDateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                />
                {errors.expDate && <p className="text-red-600 text-sm mb-2">{errors.expDate}</p>}

                <input
                    type="date"
                    value={manufactureDate}
                    onChange={handleManufactureDateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                />
                {errors.manufactureDate && <p className="text-red-600 text-sm mb-2">{errors.manufactureDate}</p>}

                {/* Action Buttons */}
                <div className="flex justify-between">
                    <button 
                        onClick={handleSave}
                        disabled={!isFormChanged()}
                        className={`px-4 py-2 rounded-lg ${isFormChanged() ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    >
                        Save
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductPopup;
