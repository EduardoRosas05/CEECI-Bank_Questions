import db from '../../../../database/models';

export default function handler(req, res) {
    switch(req.method) {
        case 'GET':
            return showImages(req, res);

        default:
            res.status(400).json({error: true, message: 'Petición errónea'});
    }
  }

  const showImages = async (req, res) => {
    const {typeCard} = req.query;
    try {
      let image;

      if (typeCard) {
         image = await db.Cards.findAll({
          where: {typeCard: typeCard}
      });
      } else {
        image = await db.Cards.findAll({
          order: [
            ['typeCard', 'ASC'] // ASC para orden ascendente, DESC para orden descendente
          ]
        })
      }

        return res.json(image);
    } catch(error){
        console.log(error);
        return res.status(400).json(
            {
                error: true,
                message: `Ocurrio un error al procesar la petición: ${error.message}`
            }
        )
    }
  }

  
 