  module.exports = {

      development: {
        username: 'development-username',
        password: 'development-password',
        database: 'development-database-name',
        host: '127.0.0.1', // or, localhost
        port: '5432',
        dialect: 'postgres',
        //host: '/tmp/.s.PGSQL.5432'
        //host: `/var/run/postgresql/.s.PGSQL.5432`
        // dialectOptions: {
        //   socketPath: '/var/run/postgresql/.s.PGSQL.5432'
        // }
      },
      production: {
        username: 'production-username',
        password: 'production-password',
        database: "production-database-name",
        host: "127.0.0.1", // or, localhost
        port: '5432',
        dialect: "postgres",
        use_env_variable: "DATABASE_URL"
      },
      test: {
        username: "test-username",
        password: 'test-password',
        database: "test-database-name",
        host: "127.0.0.1", // or, localhost
        dialect: "mysql"
      }
  }


