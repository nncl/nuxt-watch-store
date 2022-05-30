import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';
import { CartManager } from '~/managers/CartManager';

let server;

const mountProductCart = () => {
  const product = server.create('product', {
    title: 'Pretty watch', // Overriding miragejs
    price: '23.00', // Overriding miragejs
    image:
      'https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80', // Overriding miragejs
  });

  const cartManager = new CartManager();

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  });

  return {
    wrapper,
    product,
    cartManager,
  };
};

describe('ProductCard - unit', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should match snapshot', () => {
    const { wrapper } = mountProductCart();

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should mount the component', () => {
    const { wrapper } = mountProductCart();

    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Pretty watch');
    expect(wrapper.text()).toContain('$23.00');
  });

  it('should add item to cartState on button click', async () => {
    const { wrapper, cartManager, product } = mountProductCart();
    const spy = jest.spyOn(cartManager, 'open');
    const spy2 = jest.spyOn(cartManager, 'addProduct');

    await wrapper.find('button').trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(product);
  });
});
