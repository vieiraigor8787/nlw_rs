import express from 'express';
import knex from './database/connection'

const routes = express.Router();

routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
        return { 
            id: item.id,
            name: item.title,
            icon_url: `http://localhost:3333/uploads/${item.icon}`
        }
    })

    return response.json(serializedItems);
});
//cadastro pontos de coleta
routes.post('/points', async (request, response) => {
    const { 
        name,
        email,
        whatsapp,
        latitude,
        altitude,
        city,
        uf,
        items
    } = request.body;

    // transaction() não insere os dados se uma das queries falhar
    const trx = await knex.transaction()

    const insertedIds = await trx('points').insert({
        icon: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        altitude,
        city,
        uf
    })

    const point_id = insertedIds[0]

    const pointItems = items.map((item_id: number) => {
        return { 
            item_id,
            point_id
        }
    })
    await trx('point_items').insert(pointItems);

    return response.json({ success: true })
})

export default routes;