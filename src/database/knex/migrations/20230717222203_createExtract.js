
exports.up = knex => knex.schema.createTable("extract", table => {
  table.increments('id');
  table.integer('account_id').references('account').inTable("accountHolder");
  table.integer('previousBalance');
  table.integer('debts');
  table.integer('currentBalance');
  table.timestamp('created_at').default(knex.fn.now());
  table.varchar('description');

});

exports.down = knex => knex.schema.dropTable("extract");
