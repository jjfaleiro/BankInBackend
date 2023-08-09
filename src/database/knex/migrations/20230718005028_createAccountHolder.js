exports.up = knex =>
  knex.schema.createTable('accountHolder', table => {
    table.increments('account')
    table.integer('bank_id').references('id').inTable('bank').default(1)
    table.varchar('name')
    table.varchar('cpf')
    table.varchar('email')
    table.varchar('password')
    table.varchar('avatar').default(null)
    table.varchar('accountType').default('normal')
    table.integer('balance').default(0)
    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
  })

exports.down = knex => knex.schema.dropTable('accountHolder')
