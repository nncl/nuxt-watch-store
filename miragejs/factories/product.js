/*
 * Mirage JS guide on Factories: https://miragejs.com/docs/data-layer/factories
 */
import { Factory } from 'miragejs';

/*
 * DEPRECATED Faker Github repository: https://github.com/Marak/Faker.js#readme
 * New one: https://github.com/faker-js/fakera
 */
import { faker } from '@faker-js/faker';

export default {
  product: Factory.extend({
    title() {
      return faker.fake('{{lorem.words}}');
    },
    price() {
      return faker.fake('{{commerce.price}}');
    },
  }),
};
