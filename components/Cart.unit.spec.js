import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';

import { makeServer } from '@/miragejs/server';
import { CartManager } from '@/managers/CartManager';

describe('Cart - unit', () => {
  let server;

  const mountCart = () => {
    const products = server.createList('product', 2);

    const cartManager = new CartManager();
    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
      mocks: {
        $cart: cartManager,
      },
    });

    return { wrapper, products, cartManager };
  };

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const { wrapper } = mountCart();
    expect(wrapper.vm).toBeDefined();
  });

  it('should emit close event', async () => {
    const { wrapper } = mountCart();
    const button = wrapper.find('[data-testid="close-button"]');

    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('should hide the cart when no prop isOpen is passed', () => {
    const { wrapper } = mountCart();

    expect(wrapper.classes()).toContain('hidden');
  });

  it('should display the cart when no prop isOpen is passed', () => {
    const wrapper = mount(Cart, {
      propsData: {
        isOpen: true,
      },
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('should display "Cart is empty" when there are no products', async () => {
    const { wrapper } = mountCart();

    wrapper.setProps({ products: [] });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('should have 2 instances of product-item', () => {
    const { wrapper } = mountCart();

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });

  it('should display a button to clear cart', () => {
    const { wrapper } = mountCart();
    const button = wrapper.find('[data-testid="clear-cart-button"]');

    expect(button.exists()).toBe(true);
  });

  it('should call cart clearProducts() when button gets clicked', async () => {
    const { wrapper, cartManager } = mountCart();
    const spy = jest.spyOn(cartManager, 'clearProducts');

    await wrapper.find('[data-testid="clear-cart-button"]').trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
