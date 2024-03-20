import fs from 'fs';
import path from 'path';
import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){
        case 'GET':
            return getImage(req, res);
        case 'POST':
            return uploadImage(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Get'});
    }
}

const getImage = async (req, res) => {

    const { filename } = req.query;

    try {
        // Obtener la ruta completa del archivo de imagen
        const imagePath = path.resolve(process.cwd(), 'database/uploads/cards', filename);
        console.log(imagePath);
        // Verificar si el archivo existe
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: true, message: 'La imagen no existe' });
        }

        // Enviar el archivo como respuesta
        res.setHeader('Content-Type', 'image/jpeg'); // Cambia el tipo MIME según el tipo de imagen
        fs.createReadStream(imagePath).pipe(res);

    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).json({ error: true, message: 'Ocurrió un error al obtener la imagen' });
    }
};

const uploadImage = async (req, res) =>  {
    try {

        let card

        if(!card == null) {
            
            card = await db.Cards.create({...req.body});

            res.status(200).json({
                card,
                message: 'Registrado'
            });
        } else {
            res.status(404).json({ message: 'mal envio'})
        }
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


// export const config = {
//     api: {
//         externalResolver: true,
//     },
// }

// const getCards = async (req, res) => {
//     try{
//         const cards = await db.Cards.findAll();
//         return res.json(cards);
    
//     } catch(error){
//         console.log(error);
//         let errors = []

//         if(error.errors){
//             errors = error.errors.map((item) => ({
//                 error: item.message, 
//                 field: item.path,
//             }));
//         }

//         return res.status(400).json({
//             message: `Ocurrió un error al procesar la petición: ${error.message}`,
//             errors,
//         })
//     }
// }
