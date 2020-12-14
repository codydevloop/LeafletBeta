module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer",{
            lastname: {
                type: DataTypes.STRING,
                
            },
            address: {
                type: DataTypes.STRING,
                
            },
            garage: {
                type: DataTypes.STRING
            },
            notes: {
                type: DataTypes.STRING
            }
        });


    return Customer;
};