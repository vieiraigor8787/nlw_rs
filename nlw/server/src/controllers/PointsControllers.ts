import { Request, Response } from 'express'; 
import knex from '../database/connection';

class PointsController {
    //buscar ponto de coleta
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Ponto de coleta não encontrado' })
        }

        return response.json(point)
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