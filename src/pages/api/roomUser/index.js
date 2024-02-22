import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){
        case 'GET':
            return getRooms(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read, Post, Put o Delete'});
    }
}

const getRooms = async (req, res) => {

    try {

        let rooms;
            // Si se proporciona enabled, buscar las salas asociadas a ese usuario
            rooms = await db.Room.findAll({
                where: {
                    enabled: true
                },
            });
        

        // Devolver las salas encontradas
        return res.json(rooms);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};



