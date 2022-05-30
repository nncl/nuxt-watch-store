import Vue from 'vue';

export default {
  install: (Vue) => {
    /* istanbul ignore next */
    Vue.prototype.$cart = new CartManager();
  },
};

const initialState = {
  open: false,
  items: [],
};

export class CartManager {
  state;

  constructor() {
    this.state = Vue.observable(initialState);
  }

  getState() {
    return this.state;
  }

  open() {
    this.state.open = true;
    return this.getState();
  }

  close() {
    this.state.open = false;
    return this.getState();
  }

  isProductInTheCart(product) {
    return !!this.state.items.find(({ id }) => id === product.id);
  }

  hasProducts() {
    return !!this.state.items.length;
  }

  addProduct(product) {
    if (!this.isProductInTheCart(product)) {
      this.state.items.push(product);
    }

    return this.getState();
  }

  removeProduct(id) {
    this.state.items = this.state.items.filter((item) => item.id !== id);

    return this.getState();
  }

  clearProducts() {
    this.state.items = [];
    return this.getState();
  }

  clearCart() {
    this.clearProducts();
    this.close();

    return this.getState();
  }
}
