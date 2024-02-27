import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'POST':
            return addBanks(req, res);
        case 'GET':
            return getBanks(req, res);
        case 'DELETE':
            return deleteBanks(req, res);
        case 'PUT':
            return updateBank(req,res);
        case 'PATCH':
            return patchBanks(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read,Post,Put o Delete'});
    }
}

const addBanks = async (req, res) =>  {
    try {

        const bank = await db.Bank.create({...req.body});

        res.status(200).json({
            bank,
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

const getBanks = async (req, res) => {
    const {roomId, enabled} = req.query;

    try{
        //los datos vienen del req.body
        let banks;
        //guardar cliente
        if(roomId){
            banks = await db.Bank.findAll({
                where: {
                    roomId: roomId
                },
                include: ['RoomBank']
            });
        }else if(enabled !== undefined) {
            banks = await db.Bank.findAll({
                where: {
                    enabled: enabled === 'true'
                }
            })
        }else {
            banks = await db.Bank.findAll({
                include: ['RoomBank']
            });
            
        }

        return res.json(banks)
    
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

const deleteBanks = async (req, res) => {
    try {
        const { id } = req.query;

        const bank = await db.Bank.findOne({ where: { id: id } });
        if (!bank) {
            return res.status(400).json({ error: true, message: 'No se encontró el banco' });
        }
        if (bank) {
            const question = await db.Question.findOne({ where: { bankId: bank.id } });
            if (question) {
                const option = await db.Option.findOne({where: {questionId: question.id}});
                if (option){
                    await db.Answer.destroy({ where: { optionId: option.id } });
                    await db.Option.destroy({ where: { questionId: question.id } });
                }
                await db.Question.destroy({ where: { bankId: bank.id } });
            }
            await db.Bank.destroy({ where: { id: bank.id } });
        }

        res.json({
            message: 'Eliminado'
        });
    } catch (error) {
        console.error('Error al eliminar la sala:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la sala', details: error.message });
    }
};


const updateBank = async (req,res) => {

    try{
        let {id} = req.query;
        await db.Bank.update({...req.body},
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

const patchBanks = async (req,res) => {
    try{
        let {id} = req.query;
        await db.Bank.update({...req.body},
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