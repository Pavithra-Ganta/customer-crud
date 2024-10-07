const Sequelize = require("sequelize-cockroachdb");
const sequelize = new Sequelize({
    dialect: "postgres",
    username: "pavithra", 
    password: "QErWw41TNTh8IA5qLY54eA", 
    host: "customer-2862.j77.aws-ap-south-1.cockroachlabs.cloud",
    port: "26257",
    database: "defaultdb",
    dialectOptions: {
        ssl: {
        },
    },
    logging: false,
});

module.exports = sequelize;
