const Sequelize = require("sequelize-cockroachdb");
const sequelize = require('../db');

const Address = sequelize.define("addresses", {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    address: {
        type: Sequelize.TEXT,
    },
    city: {
        type: Sequelize.TEXT,
    },
    state: {
        type: Sequelize.TEXT,
    },
    pincode: {
        type: Sequelize.TEXT,
    },
    isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
    },
    userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Address.sync({ force: false });
module.exports = Address;
