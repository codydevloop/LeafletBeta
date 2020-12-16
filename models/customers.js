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
            },
            lat: {
                type: DataTypes.DECIMAL (16,14)
            },
            long: {
                type: DataTypes.DECIMAL(17,14)
            }
            
        });


    return Customer;
};