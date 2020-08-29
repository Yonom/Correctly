import csvParser from 'neat-csv';
import { generateToken } from '../../../../utils/api/auth/tokenJWT';
import { setCookie } from '../../../../utils/api/auth/tokenCookie';
import { authProvider } from '../../../../utils/config';
import handleRequestMethod from '../../../../utils/api/handleRequestMethod';
import { upsertUser } from '../../../../services/api/database/user';
import { getRole } from '../../../../utils/api/auth/role';
import { loadCSVUsers } from '../../../../utils/api/loadConfig';

// API erwartet einen POST-Request im JSON-Format mit den Attributen
// email und password
const csvLogin = async (req, res) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  if (authProvider !== 'csv') {
    return res.status(400).json({ code: 'auth/csv-not-enabled' });
  }

  const givenEmail = req.body.email;
  const givenPassword = req.body.password;

  const csvArray = await csvParser(loadCSVUsers());

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
    const role = getRole(foundUser.email);

    // upsertUser aufrufen zur Synchronisation der Daten
    upsertUser(foundUser.userId, foundUser.email, foundUser.firstName, foundUser.lastName, foundUser.studentId, true);

    // Cookies setzen
    setCookie(res, await generateToken(foundUser.userId, role), req.secure);

    // 200 OK zurückgeben
    return res.status(200).json({ });
  }

  // Benutzer nicht gefunden
  // 403 Forbidden
  return res.status(403).json({ code: 'auth/wrong-password' });
};

export default csvLogin;
