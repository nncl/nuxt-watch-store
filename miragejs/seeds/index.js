/*
 * Mirage JS guide on Seeds: https://miragejs.com/docs/data-layer/factories#in-development
 */

const usersSeeder = (server) => {
  server.createList('user', 10);
};

const productsSeeder = (server) => {
  server.createList('product', 25);
};

export default function seeds(server) {
  server.loadFixtures();
  usersSeeder(server);
  productsSeeder(server);
}
