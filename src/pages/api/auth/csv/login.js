import csvParser from 'csv-parser';
import fs from 'fs';

const csvFilepath = '.keys/users.csv';

// API erwartet einen POST-Request im JSON-Format mit den Attributen
// email und password
export default async (req, res) => {
  // Prüfung auf POST-Request
  if (req.method === 'POST') {
    const csvArray = [];

    // users.csv Pfad wird definiert und foundUser auf false gesetzt
    let foundUser = false;

    const givenEmail = req.body.email;
    const givenPassword = req.body.password;

    fs.createReadStream(csvFilepath)
      .pipe(csvParser())
      .on('data', (data) => csvArray.push(data))
      .on('end', () => {
        // users.csv wird Case-Insensitive nach email durchsucht
        for (const i of csvArray) {
          if (i.email.toLowerCase().localeCompare(givenEmail.toLowerCase()) === 0) {
            // falls email gefunden wird, wird Case-Sensitive das Passwort verglichen und
            // foundUser auf true gesetzt
            if (i.password.localeCompare(givenPassword, 'de') === 0) {
              foundUser = true;
            }
          }
        }

        // foundUser wird als JSON response zurückgegeben
        res.status(200).json({
            "csv_login":foundUser
        });
      });
  } else {
    // Antwort falls Request keine POST Methode ist
    res.status(400).json({ });
  }
};
