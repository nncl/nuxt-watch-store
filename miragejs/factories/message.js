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
  message: Factory.extend({
    content() {
      return faker.fake('{{lorem.paragraph}}');
    },
    date() {
      const date = new Date(faker.fake('{{date.past}}'));
      return date.toLocaleDateString();
    },
  }),
};
