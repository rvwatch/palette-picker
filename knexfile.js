// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      filename: 'postgres://localhost/palettes'
    },
    migrations: './db/migrations',
    useNullAsDefault: true
  }

};
