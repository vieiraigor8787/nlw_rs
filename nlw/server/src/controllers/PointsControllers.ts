import { Request, Response } from 'express'; 
import knex from '../database/connection';

class PointsController {
    //filtrar ponto específico
    async index(request: Request, response: Response) {

    }
    //buscar ponto de coleta
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Ponto de coleta não encontrado' })
        }
        //join com tabela items
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point, items });
    }

    async create (request: Request, response: Response) {
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

        const point = {
          icon: 'image-fake',
          name,
          email,
          whatsapp,
          latitude,
          altitude,
          city,
          uf
        }
    
        const insertedIds = await trx('points').insert(point)
    
        const point_id = insertedIds[0]
    
        const pointItems = items.map((item_id: number) => {
            return { 
                item_id,
                point_id
            }
        })
        await trx('point_items').insert(pointItems);
    
        return response.json({ 
            id: point_id,
            ...point,
        })
    }
}

export default PointsController;