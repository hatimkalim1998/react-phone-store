import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
const ProductContext = React.createContext();
//provider
//consumer

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: [...tempProducts] };
    });
  };
  componentDidMount() {
    this.setProducts();
  }
  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };
  handlDetails = id => {
    const product = this.getItem(id);
    this.setState({
      detailProduct: product
    });
  };
  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      () => {
        return { products: tempProducts, cart: [...this.state.cart, product] };
      },
      () => {
        this.addTotal();
      }
    );
  };
  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalOpen: true, modalProduct: product };
    });
  };
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };
  increment = id => {
    const tempCart = [...this.state.cart];
    const selectedItem = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedItem);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.price * product.count;
    this.setState(
      () => {
        return { cart: [...tempCart] };
      },
      () => {
        this.addTotal();
      }
    );
  };
  decrement = id => {
    const tempCart = [...this.state.cart];
    const selectedItem = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedItem);
    const product = tempCart[index];
    if (product.count > 1) {
      product.count = product.count - 1;
      product.total = product.price * product.count;
      this.setState(
        () => {
          return { cart: [...tempCart] };
        },
        () => {
          this.addTotal();
        }
      );
    } else {
      this.removeItem(id);
    }
  };
  removeItem = id => {
    let tempCart = [...this.state.cart];
    let tempProducts = [...this.state.products];
    tempCart = tempCart.filter(item => item.id !== id);
    const index = tempProducts.indexOf(this.getItem(id));
    const removedProduct = tempProducts[index];
    removedProduct.count = 0;
    removedProduct.inCart = false;
    removedProduct.total = 0;
    this.setState(
      () => {
        return { cart: tempCart, products: [...tempProducts] };
      },
      () => {
        this.addTotal();
      }
    );
  };
  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.setProducts();
        this.addTotal();
      }
    );
  };
  addTotal = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState({
      cartSubTotal: subTotal,
      cartTax: tax,
      cartTotal: total
    });
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handlDetails: this.handlDetails,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
