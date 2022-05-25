import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';
import { cartState } from '@/state';

let server;

const mountProductCart = () => {
  const product = server.create('product', {
    title: 'Pretty watch', // Overriding miragejs
    price: '23.00', // Overriding miragejs
    image:
      'https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80', // Overriding miragejs
  });

  return {
    wrapper: mount(ProductCard, {
      propsData: {
        product,
      },
    }),
    product,
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
    const { wrapper } = mountProductCart();

    await wrapper.find('button').trigger('click');

    expect(cartState.items).toHaveLength(1);
  });

  it.todo('should ensure product is not added twice to the cart');
});
