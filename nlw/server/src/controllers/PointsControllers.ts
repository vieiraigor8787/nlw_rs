import { Request, Response } from 'express'; 
import knex from '../database/connection';

class PointsController {
    //filtrar ponto específico
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;
        
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedIPoints = points.map(point => {
            return { 
                ...point,
                icon_url: `http://192.168.15.15:3333/uploads/${point.icon}`
            }
        })

        return response.json(serializedIPoints)
    }
    //buscar ponto de coleta
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Ponto de coleta não encontrado' })
        }

        const serializedIPoint = {
            ...point,
            icon_url: `http://192.168.15.15:3333/uploads/${point.icon}`
        };
        //join com tabela items
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point: serializedIPoint, items });
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
          icon: request.file.filename,
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
    
        const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
            return { 
              item_id,
              point_id
            }
        })
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return response.json({ 
            id: point_id,
            ...point,
        })
    }
}

export default PointsController;