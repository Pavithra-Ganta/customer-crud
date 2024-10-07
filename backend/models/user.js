const Sequelize = require("sequelize-cockroachdb");
const sequelize = require('../db');
const Address = require("../models/address");

const User = sequelize.define("users", {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.TEXT,
    },
    lastName: {
        type: Sequelize.TEXT,
    },
    email: {
        type: Sequelize.TEXT,
        unique: true,
    },
    password: {
        type: Sequelize.TEXT,
    },
    phoneNumber: {
        type: Sequelize.TEXT,
    },
    category: {
        type: Sequelize.TEXT,
        defaultValue: 'c',
    },
    addressCount: {
        type: Sequelize.VIRTUAL,
        get() {
            return this.getAddresses().then(addresses => addresses.length);
        }
    },
}, {
    timestamps: true,
});

User.hasMany(Address, { as: 'addresses', foreignKey: 'userId', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId' });

User.sync({ force: false });

module.exports = User;
