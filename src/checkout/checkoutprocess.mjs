import { getLocalStorage, setLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

// Helper function to convert form data to JSON
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const jsonObj = {};
  
  formData.forEach((value, key) => {
    jsonObj[key] = value;
  });
  
  return jsonObj;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = getLocalStorage(this.key);
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.externalServices = new ExternalServices();
  }
  
  init() {
    this.calculateItemSummary();
  }
  
  calculateItemSummary() {
    // Calculate and display the total amount of the items in the cart
    const summaryElement = document.querySelector(this.outputSelector + " #subtotal");
    
    // Calculate total
    this.itemTotal = this.list.reduce((total, item) => {
      return total + item.FinalPrice * item.quantity;
    }, 0);
    
    // Display total
    summaryElement.textContent = "$" + this.itemTotal.toFixed(2);
    
    // Update shipping and total
    this.calculateOrdertotal();
  }
  
  calculateOrdertotal() {
    // Calculate the shipping and tax amounts, then calculate the order total
    
    // Calculate total items count (for shipping calculation)
    const totalItems = this.list.reduce((count, item) => count + item.quantity, 0);
    
    // Shipping: $10 for first item + $2 for each additional item
    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    
    // Tax: 6% of subtotal
    this.tax = this.itemTotal * 0.06;
    
    // Order total: subtotal + shipping + tax
    this.orderTotal = this.itemTotal + this.shipping + this.tax;
    
    // Display the totals
    document.querySelector(this.outputSelector + " #shipping").textContent = "$" + this.shipping.toFixed(2);
    document.querySelector(this.outputSelector + " #tax").textContent = "$" + this.tax.toFixed(2);
    document.querySelector(this.outputSelector + " #order-total").textContent = "$" + this.orderTotal.toFixed(2);
  }
  
  packageItems() {
    // Convert the list of products from localStorage to the simpler form required for the checkout process
    return this.list.map(item => {
      return {
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.quantity
      };
    });
  }
  
  async checkout(form) {
    // Build the order object from the form
    const formData = formDataToJSON(form);
    
    // Add orderDate, items array, and totals
    const order = {
      ...formData,
      orderDate: new Date().toISOString(),
      items: this.packageItems(),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2)
    };
    
    try {
      // Send the order to the server
      const response = await this.externalServices.checkout(order);
      
      console.log("Order submitted successfully!");
      console.log(response);
      
      // Clear the cart and redirect to success page
      setLocalStorage("so-cart", []);
      
      // Redirect to success page
      location.href = "../checkout/success.html";
      
      return response;
    } catch (error) {
      console.log(error);
      // Display error message to user
      alert("There was a problem with your order. Please try again.");
    }
  }
}
