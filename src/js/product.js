import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get the current cart items (if any)
  let cart = getLocalStorage("so-cart");

  // If cart doesn't exist yet, initialize it as an empty array
  if (!cart) {
    cart = [];
  }
  // If cart exists but isn't an array (just a single product object), convert it to an array with that product
  else if (!Array.isArray(cart)) {
    cart = [cart];
  }

  // Add the new product to the cart array
  cart.push(product);

  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
