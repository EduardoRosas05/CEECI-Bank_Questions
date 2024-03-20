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
        case 'PATCH': 
            return patchQuestions(req, res);
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
    const { bankId, enabled } = req.query;

    try {
        let questions;

        if (bankId) {
            questions = await db.Question.findAll({
                where: {
                    bankId: bankId
                },
                include: ['QuestionBank', 'QuestionOption', 'QuestionAnswer']
            });
        } else if (enabled !== undefined) {
            questions = await db.Question.findAll({
                where: {
                    enabled: enabled === 'true'
                },
                include: ['QuestionBank', 'QuestionOption', 'QuestionAnswer']
            });
        } else {
            questions = await db.Question.findAll({
                include: ['QuestionBank', 'QuestionOption', 'QuestionAnswer']
            });
        }

        return res.json(questions);

    } catch (error) {
        console.log(error);
        let errors = [];

        if (error.errors) {
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
            }));
        }

        return res.status(400).json({
            message: 'Ocurrió un error al procesar la petición: ${error.message}',
            errors,
        });
    }
};

const deleteQuestions = async (req, res) => {
    try {
        const { id } = req.query;

        const question = await db.Question.findOne({ where: { id: id } });
        if (!question) {
            return res.status(400).json({ error: true, message: 'No se encontró la pregunta' });
        }
            if (question) {
                const option = await db.Option.findOne({where: {questionId: question.id}});
                if (option){
                    await db.Answer.destroy({ where: { optionId: option.id } });
                    await db.Option.destroy({ where: { questionId: question.id } });
                }
                await db.Question.destroy({ where: { id: question.id } });
            }

        res.json({
            message: 'Eliminado'
        });
    } catch (error) {
        console.error('Error al eliminar la sala:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la sala', details: error.message });
    }
};

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

const patchQuestions = async (req,res) => {
    try{
        let {id} = req.query;
        await db.Question.update({...req.body},
            {
            where :{ id : id }
        })
        res.json({
            message: 'Cambiado  '
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