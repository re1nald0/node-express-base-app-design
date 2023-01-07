module.exports = {
  config: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST, // or, localhost
    port: process.env.DB_PORT,
    dialect: 'postgres',
    //host: '/tmp/.s.PGSQL.5432'
    //host: `/var/run/postgresql/.s.PGSQL.5432`
    // dialectOptions: {
    //   socketPath: '/var/run/postgresql/.s.PGSQL.5432'
    // }
  }
}
