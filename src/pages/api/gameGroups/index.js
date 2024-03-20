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
    try {

        const gameGroup = await db.GameGroups.create({...req.body});

        res.status(200).json({
            gameGroup,
            message: 'Registrado'
        });

    } catch (error) {

        console.log(error);

        let errors = [];
        if (error.errors){
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
                }));
        }
      return res.status(400).json( {
        error: true,
        message: `Ocurrió un error al procesar la petición: ${error.message}`,
        errors,
        } 
      )
    }
}

const getGameGroup = async (req, res) => {
    try{
        //los datos vienen del req.body
        console.log(req.body);
        //guardar cliente
        const gameGroup = await db.GameGroups.findAll({
           attributes: ['groupName', 'maxPlayers', 'currentPlayers']
        });     
        return res.json(gameGroup)
    
    }catch(error){
        console.log(error);
        let errors = []

        if(error.errors){
            //extrae la info
            errors = error.errors.map((item) => ({
                error: item.message, 
                field: item.path,
            }));
        }

        return res.status(400).json({
            message: `Ocurrió un error al procesar la petición: ${error.message}`,
            errors,
        })
    }
}