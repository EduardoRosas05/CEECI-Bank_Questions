    import db from '../../../../database/models';

    export default function handler(req, res) {

        switch(req.method){

            case 'POST':
                return addGameGroup(req, res);
            case 'GET':
                return getGameGroup(req, res);
            default:
                res.status(400).json({error: true, message:'Petición errónea, utiliza Read o Post'});
        }
    }

    const addGameGroup = async (req, res) =>  {

        const { groupName, maxPlayers } = req.body;
    
        try {
        // Crea un nuevo grupo de juego en la base de datos
        const newGameGroup = await db.GameGroups.create({ groupName, maxPlayers, currentPlayers: 0 });
    
        return res.status(201).json(newGameGroup);
        } catch (error) {
        console.error('Error al crear el grupo de juego:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    const getGameGroup = async (req, res) =>  {

        const { userId, groupId } = req.body;

        try{
            //los datos vienen del req.body
            console.log(req.body);
            //guardar cliente
            const gameGroup = await db.GameGroups.findByPk( 
                groupId, {
                attributes: ['groupName', 'maxPlayers', 'currentPlayers']
            });     
            if (!gameGroup) {
                return res.status(404).json({ error: 'Grupo de juego no encontrado' });
            }
             //Verifica si hay espacio disponible en el grupo de juego
            if (gameGroup.currentPlayers >= gameGroup.maxPlayers) {
                return res.status(400).json({ error: 'El grupo de juego está lleno' });
            } else {
            //Crea una nueva entrada en userGameGroup para asociar al usuario con el grupo de juego
            await db.UserGameGroups.create({ userId, groupId });  
            
            // Incrementa el número de jugadores actuales en el grupo de juego
            await db.GameGroups.increment('currentPlayers', {
                by: 1,
                where: { id: groupId }
            });

            }
             

            return res.json({gameGroup, message: 'agregado al juego'})

            
       

       
        

        // return res.status(200).json({ message: '¡Te has unido al grupo de juego con éxito!' });
    } catch (error) {
        console.error('Error al unirse al grupo de juego:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
    }
