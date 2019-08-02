const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'auth.db'
})

const Users = db.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

const Data = db.define('data', {
  name: {
    type: Sequelize.STRING
  },
  dob: {
    type: Sequelize.DATEONLY
  },
  pob: {
    type: Sequelize.STRING
  },
  gender: {
    type: Sequelize.STRING
  },
  fathername: {
    type: Sequelize.STRING
  },
  mothername: {
    type: Sequelize.STRING
  },
  paddress: {
    type: Sequelize.STRING
  },
  taddress: {
    type: Sequelize.STRING
  },
  nationality: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true 
  },
  phone: {
    type: Sequelize.INTEGER
  },
  course: {
    type: Sequelize.STRING
  }
})


module.exports = {
  db,
  Users,
  Data
}