import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'POST':
            return addQuestions(req, res);
        case 'GET':
            return getQuestions(req, res);
        case 'DELETE':
            return deleteQuestions(req, res);
        case 'PUT':
            return updateQuestions(req,res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read,Post,Put o Delete'});
    }
}

const addQuestions = async (req, res) =>  {
    try {

        const question = await db.Question.create({...req.body});

        res.status(200).json({
            question,
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

const getQuestions = async (req, res) => {

    const bankId = req.query.bankId;

    try{
        //los datos vienen del req.body
        let questions;
        //guardar cliente
        if(bankId){
            questions = await db.Question.findAll({
                where: {
                    bankId: bankId
                },
                include: ['QuestionBank']
            });
        }else {
            questions = await db.Question.findAll({
                include: ['QuestionBank']
            });
            
        }

        return res.json(questions)
    
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

const deleteQuestions = async (req,res) => {
    try{
      const {id} = req.query;

        await db.Question.destroy({
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

const updateQuestions = async (req,res) => {

    try{
        let {id} = req.query;
        await db.Question.update({...req.body},
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