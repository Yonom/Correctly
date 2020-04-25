//API erwartet einen POST-Request im JSON-Format mit den Attributen
//email und password
export default async (req, res) => {
    
    //Prüfung auf POST-Request
    if (req.method === 'POST') {

        //CSV-Parser wird installiert
        const csvParser = require('csv-parser');
        const fs = require('fs');
        const csv_array = [];

        //users.csv Pfad wird definiert und foundUser auf false gesetzt
        const csv_filepath = ".keys/users.csv";
        let foundUser = false;


        const givenEmail = req.body.email;
        const givenPassword = req.body.password;
    
        
        fs.createReadStream(csv_filepath)
        .pipe(csvParser())
        .on('data', (data) => csv_array.push(data))
        .on('end', () => {   
        //users.csv wird Case-Insensitive nach email durchsucht
        for (let i of csv_array){
            if(i.email.toLowerCase().localeCompare(givenEmail.toLowerCase())===0) {
                //falls email gefunden wird, wird Case-Sensitive das Passwort verglichen und 
                //foundUser auf true gesetzt
                if(i.password.localeCompare(givenPassword,'de')===0) {
                    foundUser = true;
                    
                }
            }
        }

        //foundUser wird als JSON response zurückgegeben
        res.status(200)(foundUser);
        
    });
  
  }
  //Antwort falls Request keine POST Methode ist
  else
  {
    res.status(400).json(
        {
            
        }
    )
  }

}


