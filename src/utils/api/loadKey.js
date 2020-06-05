import fs from 'fs';
import keyJsonFilepath from '../../../.keys/key.json';

export default () => {
  return JSON.parse(fs.readFileSync(keyJsonFilepath));
};
