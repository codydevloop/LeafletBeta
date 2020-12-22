module.exports = (sequelize, DataTypes) => {
    const January_Master = sequelize.define("January_Master",{
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
            },
            completed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
            
        });


    return January_Master;
};