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
    use_env_variable: true,
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
}