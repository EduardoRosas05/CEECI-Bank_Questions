import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'POST':
            return addCategories(req, res);
        case 'GET':
            return getCategories(req, res);
        case 'DELETE':
            return deleteCategories(req, res);
        case 'PUT':
            return updateCategories(req,res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read,Post,Put o Delete'});
    }
}

const addCategories = async (req, res) =>  {
    try {

        const category = await db.Category.create({...req.body});

        res.status(200).json({
            category,
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

const getCategories = async (req, res) => {
    try{
        //los datos vienen del req.body
        console.log(req.body);
        //guardar cliente
        const category = await db.Category.findAll({
            attributes: ['name']
        });
        return res.json(category)
    
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

const deleteCategories = async (req,res) => {
    try{
      const {id} = req.query;

        await db.Category.destroy({
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

const updateCategories = async (req,res) => {

    try{
        let {id} = req.query;
        await db.Category.update({...req.body},
            {
            where :{ id : id }
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