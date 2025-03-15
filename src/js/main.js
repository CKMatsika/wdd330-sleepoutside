// Import the ProductData module
import { ProductData } from './ProductData.js';
// Import the ProductList module
import ProductList from './ProductList.mjs';

// Create an instance of ProductData
const productData = new ProductData();

// Get the element where we'll render the product list
const listElement = document.querySelector('.product-list');

// Create an instance of ProductList for a specific category (e.g., 'tents')
const productList = new ProductList('tents', productData, listElement);

// Initialize the product list
productList.init();