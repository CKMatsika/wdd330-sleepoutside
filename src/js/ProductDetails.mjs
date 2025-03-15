// ProductDetails.mjs
import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      // Use the datasource to get the details for the current product
      this.product = await this.dataSource.findProductById(this.productId);
      
      // Once the product details are available, render the HTML
      this.renderProductDetails();
      
      // Add event listener to Add to Cart button
      document.getElementById('addToCart')
        .addEventListener('click', this.addProductToCart.bind(this));
    } catch (error) {
      console.error("Error in init:", error);
    }
  }

  addProductToCart() {
    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
    
    // If cart isn't an array, convert it
    if (!Array.isArray(cart)) {
      cart = [cart];
    }
    
    // Add this product to the cart
    cart.push(this.product);
    
    // Save updated cart back to localStorage
    setLocalStorage('so-cart', cart);
  }

  renderProductDetails() {
    // Check if product data exists
    if (!this.product) {
      document.querySelector('.product-detail').innerHTML = 
        `<p>Product not found. Please check the product ID.</p>`;
      return;
    }

    // Select the container
    const container = document.querySelector('.product-detail');
    
    // Get brand name correctly (handle if it's an object)
    const brandName = typeof this.product.Brand === 'object' ? 
                    (this.product.Brand?.Name || 'Brand not available') : 
                    this.product.Brand || 'Brand not available';
  
    // Create the HTML using the correct data structure
    container.innerHTML = `
      <h3>${brandName}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand || 'Product name not available'}</h2>
      <img
        class="divider"
        src="${this.product.Image || '../images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg'}"
        alt="${this.product.NameWithoutBrand || 'Product image'}"
      />
      <p class="product-card__price">$${this.product.FinalPrice || this.product.ListPrice || '0.00'}</p>
      <p class="product__color">${this.product.Colors && this.product.Colors[0] ? this.product.Colors[0].ColorName : 'Color not available'}</p>
      <p class="product__description">
        ${this.product.Description || this.product.DescriptionHtmlSimple || 'Description not available'}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
}