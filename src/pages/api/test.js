import loadKey from '../../utils/api/loadKey';

const fs = require('fs');
const files = fs.readdirSync('/');
export default async (req, res) => {
  if (false) loadKey();
  res.json({
    __filename,
    __dirname,
    files,
    cwd: process.cwd(),
  });
};
