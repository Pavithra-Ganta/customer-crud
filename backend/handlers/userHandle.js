const { where } = require("sequelize-cockroachdb");
const Address = require("../models/address");
const User = require("../models/user");
const { Op } = require('sequelize');

// Add new user
async function addUser(userModel) {
    const user = await User.create(userModel);
    return user;
}

async function getUsers() {
    const users = await User.findAll({
        include: [{ model: Address, as: 'addresses' }]
    });
    
    return users.map(user => {
        const userPlain = user.get({ plain: true }); 
        return {
            ...userPlain,
            addressCount: userPlain.addresses ? userPlain.addresses.length : 0 
        };
    });
}

// Get a user
async function getUser(id) {
    const user = await User.findByPk(id,{
        include: [{ model: Address, as: 'addresses' }]
    });
    return user;
}

// Show a user
async function showUser(id) {
    const user = await User.findByPk(id,{
        include: [{ model: Address, as: 'addresses' }]
    });
    return user;
}

// Update a user
async function updateUser(id, userModel) {
    await User.update(userModel, { where: { id } });
}

// Delete a user
async function deleteUser(id) {
    await User.destroy({ where: { id } });
}

// Login user
async function loginUser(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
        return null;
    }
    return user;
}

// Get default address
async function getAddress(userId) {
    const address = await Address.findOne({ where: { userId, isDefault: true } });
    return address;
  }  

// Get all addresses for a user
async function getUserAddresses(userId) {
    const addresses = await Address.findAll({ where: { userId } });
    return addresses;
}

// Add a new address for a user
async function addAddress(userId, addressModel) {
    addressModel.userId=userId;
    const address = await Address.create(addressModel);
    return address;
}

// Update an existing address
async function updateAddress(addressId, addressModel) {
    const address = await Address.findByPk(addressId);
    if (!address) throw new Error('Address not found');
    
    await address.update(addressModel);
    return address;
}

// Delete an address
async function deleteAddress(addressId) {
    const address = await Address.findByPk(addressId);
    if (!address) throw new Error('Address not found');
    
    await address.destroy();
    return address;
}

// Set default address for a user
async function setDefaultAddress(userId, addressId) {
    await Address.update({ isDefault: false }, { where: { userId, isDefault: true } });
    const address = await Address.findByPk(addressId);
    if (!address) throw new Error('Address not found');
    
    await address.update({ isDefault: true });
}

module.exports = {
    addUser,
    getUsers,
    showUser,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    addAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddress
};
