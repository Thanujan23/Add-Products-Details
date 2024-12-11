import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
    const [categoriesData, setCategoriesData] = useState({});
    const [products, setProducts] = useState([]);

    // Fetch products data
    useEffect(() => {
        axios.get('http://localhost:5000/api/products/getImages')
            .then(res => {
                setProducts(res.data);
                const categories = {};

                res.data.forEach(product => {
                    const category = product.category;
                    if (!categories[category]) {
                        categories[category] = { names: [], quantities: [] };
                    }
                    const index = categories[category].names.indexOf(product.name);
                    if (index === -1) {
                        categories[category].names.push(product.name);
                        categories[category].quantities.push(product.quantity);
                    } else {
                        categories[category].quantities[index] += product.quantity;
                    }
                });

                setCategoriesData(categories);
            })
            .catch(err => console.log(err));
    }, []);

    // Prepare chart data for each category
    const charts = Object.keys(categoriesData).map(category => {
        const { names, quantities } = categoriesData[category];

        const barData = {
            labels: names,
            datasets: [
                {
                    label: 'Product Quantity',
                    data: quantities,
                    backgroundColor: '#4CAF50', // Green
                },
            ],
        };

        return (
            <div key={category} className="my-6">
                {/* Bar Chart */}
                <div className="bg-white p-4 rounded-lg shadow-lg h-80 border border-green-300">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">{category} - Product Quantities</h3>
                    <Bar 
                        data={barData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return tooltipItem.label + ': ' + tooltipItem.raw;
                                        }
                                    }
                                }
                            },
                            layout: {
                                padding: 20,
                            }
                        }} 
                        height={300} 
                    />
                </div>
            </div>
        );
    });

    const Header = () => {
        return (
            <div className="bg-green-800 text-white p-4 flex justify-center items-center shadow-md">
                <div className="flex space-x-6">
                <Link to='/view-product' className="hover:text-green-300 transition-colors duration-300">Home</Link>
                <Link to='/add-product' className="hover:text-green-300 transition-colors duration-300">Add Product</Link>
                <Link to='/admin-product' className="hover:text-green-300 transition-colors duration-300">Manage Product</Link>
                <Link to='/dashboard' className="hover:text-green-300 transition-colors duration-300">Dashboard</Link>
                <Link to='/cart-admin' className="hover:text-green-300 transition-colors duration-300">Cart Admin</Link>
                <Link to='/payment-admin' className="hover:text-green-300 transition-colors duration-300">Payment Admin</Link>
                <Link to='/packaging-admin' className="hover:text-green-300 transition-colors duration-300">Packaging Admin</Link>
                <Link to='/delivery' className="hover:text-green-300 transition-colors duration-300">Delivery</Link>
                <Link to='/review' className="hover:text-green-300 transition-colors duration-300">Review</Link>
                <Link to='/return' className="hover:text-green-300 transition-colors duration-300">Return</Link>

                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <Header />
            <h2 className="text-2xl font-semibold mb-6 text-green-700">Dashboard</h2>
            {charts}
        </div>
    );
};

export default Dashboard;
