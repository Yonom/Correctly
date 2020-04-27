import csvParser from 'neat-csv';
import fs from 'fs';
import { generateToken } from '../../../../utils/api/auth/tokenJWT';
import { setCookie } from '../../../../utils/api/auth/tokenCookie';

const csvFilepath = '.keys/users.csv';

// API erwartet einen POST-Request im JSON-Format mit den Attributen
// email und password
export default async (req, res) => {
  // Prüfung auf POST-Request
  if (req.method === 'POST') {
    const givenEmail = req.body.email;
    const givenPassword = req.body.password;

    const csvArray = await csvParser(await fs.promises.readFile(csvFilepath));

    // users.csv wird Case-Insensitive nach email durchsucht
    let foundUser;
    for (const i of csvArray) {
      if (i.email.toLowerCase().localeCompare(givenEmail.toLowerCase(), 'de') === 0) {
        // falls email gefunden wird, wird Case-Sensitive das Passwort verglichen und
        // foundUser auf true gesetzt
        if (i.password.localeCompare(givenPassword, 'de') === 0) {
          foundUser = i;
        }
      }
    }

    if (foundUser) {
      (() => {})(foundUser.userId, foundUser.email, foundUser.firstName, foundUser.lastName, foundUser.studentId, foundUser.email_verified);

      setCookie(res, await generateToken(foundUser.userId), req.secure);
    }

    // foundUser wird als JSON response zurückgegeben
    res.status(200).json({
      csv_login: foundUser !== undefined,
    });
  } else {
    // Antwort falls Request keine POST Methode ist
    res.status(400).json({ });
  }
};
