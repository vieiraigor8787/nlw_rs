import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: 'lâmpadas', icon: 'lampadas.svg'},
        { title: 'Pilhas e baterias', icon: 'baterias.svg'},
        { title: 'Papéis e papelão', icon: 'papeis-papelao.svg'},
        { title: 'Resíduos eletrônicos', icon: 'eletronicos.svg'},
        { title: 'Resíduos orgânicos', icon: 'organicos.svg'},
        { title: 'Óleo de cozinha', icon: 'oleo.svg'}
    ])
}