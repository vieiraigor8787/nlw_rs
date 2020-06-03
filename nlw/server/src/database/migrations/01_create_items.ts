import Knex from 'knex';

export async function up(knex: Knex) {
    //CRIAR TABELA
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('icon').notNullable();
        table.string('title').notNullable();
    })
}

export async function down(knex: Knex) {
    //DELETAR TABELA
    return knex.schema.dropTable('items')
}

