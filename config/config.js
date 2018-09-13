module.exports = {
  'development': {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  'test': {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  'production': {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
}