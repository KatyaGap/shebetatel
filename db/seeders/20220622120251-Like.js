'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Likes',
      [
        {
          user_id: 1,
          post_id: 2,
        },
        {
          user_id: 2,
          post_id: 1,
        },
        {
          user_id: 2,
          post_id: 3,
        },
        {
          user_id: 3,
          post_id: 1,
        },
        {
          user_id: 3,
          post_id: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Likes', null, {});
  },
};
