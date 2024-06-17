import Sequelize from "sequelize";
import User from "../app/models/User";
import Product from "../app/models/Products";
import configDatabase from "../config/database";
import Category from "../app/models/Category";

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.map((model) => model.init(this.connection)).map(model => model.association && model.association(this.connection.models));
  }
}

export default new Database();
