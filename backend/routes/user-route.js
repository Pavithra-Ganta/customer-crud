const express = require("express");
const {
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
    getAddress,
} = require('../handlers/userHandle');
const Address = require("../models/address");

const router = express.Router();

router.post("/users", async (req, res) => {
    try {
        const user = await addUser(req.body);
        if (req.body.address) {
            const addressData = {
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                isDefault: true,
                userId: user.id
            };
            await addAddress(user.id, addressData);
        }
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "User Email Already Exists" });
    }
});

router.put("/users/:id/default-address/:addressId", async (req, res) => {
    try {
        await setDefaultAddress(req.params.id, req.params.addressId);
        res.send({ message: 'Default address updated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error updating default address' });
    }
});

router.get("/users/:id/addresses", async (req, res) => {
    try {
        const addresses = await getUserAddresses(req.params.id);
        res.send(addresses);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching addresses' });
    }
});

router.post("/users/:id/addresses", async (req, res) => {
    try {
        const address = await addAddress(req.params.id, req.body);
        await setDefaultAddress(req.params.id, address.id);
        res.status(201).send(address);
    } catch (error) {
        res.status(500).send({ error: 'Error adding address' });
    }
});

router.put("/addresses/:addressId", async (req, res) => {
    try {
        console.log('500');
        const address = await updateAddress(req.params.addressId, req.body);
        console.log(address);
        await setDefaultAddress(address.userId, req.params.addressId);
        res.send({ message: 'Address updated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error updating address' });
    }
});

router.delete("/addresses/:addressId", async (req, res) => {
    try {
        const deletedAddress = await deleteAddress(req.params.addressId);
        res.send({ message: 'Address deleted successfully' });
        const userId = deletedAddress.userId;
        const remainingAddresses = await getUserAddresses(userId);
        if (remainingAddresses.length > 0) {
            const lastAddress = remainingAddresses[remainingAddresses.length - 1];
            await setDefaultAddress(userId, lastAddress.id);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error deleting address' });
    }
});

router.get("/users", async (req, res) => {
    try {
        const users = await getUsers();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error fetching users' });
    }
});

router.get("/users/show/:id", async (req, res) => {
    try {
        const user = await showUser(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ error: 'Server Error' });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ error: 'Server Error' });
    }
});

router.put("/users/:id", async (req, res) => {
    try {
        await updateUser(req.params.id, req.body);
        res.send({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error updating user' });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting user' });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        if (!user) {
            return res.status(400).send({ message: 'Invalid Email or Password' });
        }
        res.send({ category: user.category });
    } catch (error) {
        res.status(500).send({ error: 'Server Error' });
    }
});

router.get("/users/:id/address", async (req, res) => {
    try {
        const address = await getAddress(req.params.id);
        if (address) {
            res.send(address);
        } else {
            res.status(404).send({ message: "Address not found" });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error fetching addresses' });
    }
});

module.exports = router;
