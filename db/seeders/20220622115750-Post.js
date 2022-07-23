'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Posts',
      [
        {
          image: '/uploads/image-1655898260406-483240796.jpeg',
          date: '2022-06-22 10:00',
          user_id: 2,
          text: 'Обожаю джек расселов!',
        },
        {
          image: '/uploads/image-1655898615845-630810195.jpeg',
          date: '2022-06-05 13:16',
          user_id: 2,
          text: 'Хочу мороженое!',
        },
        {
          image: '/uploads/image-1658608733776-154977353.jpeg',
          date: '2022-05-21 11:00',
          user_id: 1,
          text: 'Как же хочется спать!',
        },
        {
          image: '/uploads/image-1655899726076-637178838.jpeg',
          date: '2022-06-15 11:00',
          user_id: 3,
          text: '...Сейчас бы на природу!',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
