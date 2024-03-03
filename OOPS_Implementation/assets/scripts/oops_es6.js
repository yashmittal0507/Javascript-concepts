class Component {
  constructor(renderHookId) {
    this.renderHookId = renderHookId;
  }

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes?.length > 0) {
      for (attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.renderHookId).append(rootElement);
    return rootElement;
  }
}

class Product {
  constructor(title, image, desc, price) {
    this.title = title;
    this.image = image;
    this.description = desc;
    this.price = price;
  }
}

class ProductItem extends Component {
  constructor(productItem, renderHookId) {
    super(renderHookId);
    this.productItem = productItem;
    this.renderProductItem();
  }

  addToCart() {
    console.log("Inside add to cart method");
    App.addProductToCart(this.productItem);
  }

  renderProductItem() {
    // const productEl = document.createElement("li");
    // productEl.className = "product-item";
    const productEl = this.createRootElement("li", "product-item");
    productEl.innerHTML = `
      <div class="imgContainer">
      <img src="${this.productItem.image}" alt ="${this.productItem.description}">
      <div class ="product-item__content" >
      <h2>${this.productItem.title}</h2>
      <h3>\$${this.productItem.price}</h3>
      <p>${this.productItem.description}</p>
      <button>Add to Cart</button>
      </div>
      </div>
      `;

    const addToCartButton = productEl.querySelector("button");
    addToCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
    this.render();
  }

  #products = [
    // # before the products variable refers to private variabe ,so products here is a private propery
    new Product(
      "A pillow",
      "https://i.etsystatic.com/40202456/r/il/a62e1b/4512912010/il_794xN.4512912010_dzpr.jpg",
      "A soft pillow",
      99
    ),
    new Product(
      "A chair",
      "https://magnoliahome.co.in/wp-content/uploads/2021/08/Jasper-Arm-Chair-1.1-1.jpg",
      "A comfortable chair",
      1999
    ),
    new Product(
      "A carpet",
      "https://i.etsystatic.com/19474876/r/il/a39a5f/5551448052/il_794xN.5551448052_ltz7.jpg",
      "A long carpet",
      11999
    ),
  ];

  render() {
    // const productListContainer = document.createElement("ul");
    // productListContainer.className = "product-list";
    const productListContainer = this.createRootElement("ul");
    productListContainer.id = "product-list";
    for (const product of this.#products) {
      const productItem = new ProductItem(product, productListContainer.id);
    }
  }
}

class ShoppingCart extends Component {
  constructor(renderHookId) {
    super(renderHookId);
    this.render();
  }
  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalValueOutputEl.innerHTML = `
    <h2>Total: \$${this.totalProductsCost}</h2>
    `;
  }

  get totalProductsCost() {
    const totalCost = this.items.reduce(
      (prevValue, currItem) => prevValue + currItem.price,
      0
    );
    return totalCost;
  }

  orderProducts = () => {
    // we are using the arrow function here so that while accessing this.items, this points to the new object instance of the class created
    console.log("ordering products...");
    console.log(this.items);
  };

  addProduct(product) {
    const updatedProductsInCart = [...this.items];
    updatedProductsInCart.push(product);
    this.cartItems = updatedProductsInCart;
  }
  render() {
    const cartEl = this.createRootElement("section", "cart");

    cartEl.innerHTML = `
    <h2>Total: \$${0}</h2>
    <button>Order Now !</button>
    `;
    this.totalValueOutputEl = cartEl.querySelector("h2");
    const orderButton = cartEl.querySelector("button");
    orderButton.addEventListener("click", this.orderProducts);
  }
}

class Shop {
  constructor() {
    this.render();
  }

  render() {
    const appContainer = document.getElementById("app");
    this.cart = new ShoppingCart("app");
    const productListContainer = new ProductList("app");
  }
}

class App {
  cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product); // We are basically passing product from ProductItem class to Shopping cart class
  }
}

App.init();
