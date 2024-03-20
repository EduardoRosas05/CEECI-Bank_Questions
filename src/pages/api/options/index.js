import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'POST':
            return addOptions(req, res);
        case 'GET':
            return getOptions(req, res);
        case 'DELETE':
            return deleteOptions(req, res);
        case 'PUT':
            return updateOptions(req,res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read,Post,Put o Delete'});
    }
}

const addOptions = async (req, res) =>  {
    try {

        const option = await db.Option.create({...req.body});

        res.status(200).json({
            option,
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

const getOptions = async (req, res) => {

    const questionId = req.query;

    try{
        let option;
            if(questionId){
                option = await db.Option.findAll({
                    where: {
                        questionId : donkey 
                    },
                    include: ['OptionQuestion']
                });
            } else {
                option = await db.Option.findAll({
                    include: ['OptionQuestion']
                });
            }
        return res.json(option)
    
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

const deleteOptions = async (req,res) => {
    try{
      const {id} = req.query;

        await db.Option.destroy({
            where: { id: id }
        })

        res.json({
            message: 'Eliminado'
        })

      }
         catch (error){
            res.status(400).json({ error: "error al momento de borrar el estado"})
    }
}

const updateOptions = async (req,res) => {

    try{
        let {id} = req.query;

        const { option1, option2, option3, correctA } = req.body;
        if (typeof option1 !== 'string' || typeof option2 !== 'string' || typeof option3 !== 'string' || typeof correctA !== 'string') {
          throw new Error('Los campos deben ser strings');
        }
        
        await db.Option.update({...req.body},
            {
            where :{ id : id },
        })
        res.json({
            message: 'Actualizado'
        })

      }
      catch (error) {

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