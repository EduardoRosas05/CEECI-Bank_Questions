import extToMimes from "../../../../database/config/extToMimes";
import path from "path";
import fs from "fs";

export default function handler(req, res) {
    switch(req.method) {
      case 'GET':
        return viewImage(req, res);
  
      default:
        res.status(400).json({error: true, message: 'Peticion errónea'});
    }
}

const viewImage = async (req, res) => {
    try { 
        const fileName = req.query.file;
        const serverFilesPath = "/Users/erikg/Desktop/CEECI-Bank_Questions/uploads/";

        if (fileName === 'cards') {
            const cardsFolderPath = path.join(serverFilesPath, 'cards');
            const cardFiles = fs.readdirSync(cardsFolderPath);
            
            res.json(cardFiles.map(file => {
                return {
                    name: file,
                    url: `http://localhost:3000/api/card/view?file=cards/${file}`
                };
            }));
        } else {
            const filePath = path.join(serverFilesPath, fileName);

            if(!fs.existsSync(filePath)) {
                res.setHeader("Content-Type", "text/html");
                res.write("<h1>El archivo no existe</h1>");
                return res.status(404);
            }

            const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
            res.setHeader("Content-Type", extToMimes[ext] || 'application/document');
            res.setHeader("Content-Disposition", "inline");

            const fileBuffer = fs.readFileSync(filePath);
            res.send(fileBuffer);       
        }
    } catch (error) {
        return res.status(400).json(
            {
              error: true,
              message: `Ocurrió un error al leer el archivo: ${error.message}`
            }
        )
    }
}