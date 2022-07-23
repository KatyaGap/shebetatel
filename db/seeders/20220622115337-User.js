'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Mike',
          email: '1@mail.ru',
          password: await bcrypt.hash('123', Number(process.env.SALTROUNDS)),
        },
        {
          name: 'Katya',
          email: '2@mail.ru',
          password: await bcrypt.hash('1234', Number(process.env.SALTROUNDS)),
        },
        {
          name: 'Masha',
          email: '3@mail.ru',
          password: await bcrypt.hash('12345', Number(process.env.SALTROUNDS)),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
