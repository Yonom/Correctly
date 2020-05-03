import csvParser from 'neat-csv';
import fs from 'fs';
import { generateToken } from '../../../../utils/api/auth/tokenJWT';
import { setCookie } from '../../../../utils/api/auth/tokenCookie';
import { authProvider } from '../../../../utils/config';
import { upsertUser } from '../../../../services/api/database/user';

const csvFilepath = '.keys/users.csv';

// API erwartet einen POST-Request im JSON-Format mit den Attributen
// email und password
export default async (req, res) => {
  if (authProvider !== 'csv') {
    return res.status(400).json({ error: 'Server does not support csv login.' });
  }

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

    // prüfung, ob ein Benutzer gefunden wurde
    if (foundUser) {
      // upsertUser aufrufen zur Synchronisation der Daten
      upsertUser(foundUser.userId, foundUser.email, foundUser.firstName, foundUser.lastName, foundUser.studentId, foundUser.email_verified);

      // Cookies setzen
      setCookie(res, await generateToken(foundUser.userId), req.secure);

      // 200 OK zurückgeben
      return res.status(200).json({ });
    }

    // Benutzer nicht gefunden
    // 403 Forbidden
    return res.status(403).json({ error: 'Invalid credentials sent!' });
  }

  // Antwort falls Request keine POST Methode ist
  return res.status(400).json({ });
};
