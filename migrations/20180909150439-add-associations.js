'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn(
     // User hasMany Message
     'Messages', // name of traget model
     'UserId', // name of the key we're adding
     {
       type: Sequelize.INTEGER,
       references: {
         model: 'Users',
         key: 'id',
       },
       onUpdate: 'CASCADE',
       onDelete: 'SET NULL',
     }
   );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      // remove User hasMany Message
      'Messages', // name of the target model
      'UserId', // key to be removed
    );
  }
};
