import config from '../../config/db.config.js';
import Sequelize from 'sequelize';

export default new Sequelize(config.uri, config);
