// ProductList.mjs with utility function
import { renderListWithTemplate } from './utils.mjs';

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // the dataSource will return a Promise...so you can use await to resolve it.
    const list = await this.dataSource.getData();
    // Filter by category
    this.list = list.filter(item => item.category === this.category);
    // render the list
    this.renderList();
  }

  renderList() {
    // Use the utility function to render the list
    renderListWithTemplate(
      productCardTemplate, 
      this.listElement, 
      this.list
    );
  }
}

// Template function for product cards
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}