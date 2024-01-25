import { DataTypes } from 'sequelize';
import sequelize from '../config';

const Image = sequelize.define(
  'Image',
  {
    fileid: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileformat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'images',
    timestamps: false,
  },
);

export default Image;
