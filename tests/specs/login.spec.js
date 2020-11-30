import { getMyData, logout } from '../../src/services/auth';
import { LECTURER, STUDENT, SUPERUSER } from '../../src/utils/auth/role';
import { addTestLecturer, addTestStudent, addTestSuperuser } from '../models/User';
import setLogin from '../utils/setLogin';

describe('login', () => {
  test('my data and logout', async () => {
    {
      const myData = await getMyData();
      expect(myData).toStrictEqual({ loggedIn: false });
    }

    const lecturer = await addTestLecturer();
    {
      await setLogin(lecturer);
      const myData = await getMyData();
      expect(myData.loggedIn).toBe(true);
      expect(myData.role).toBe(LECTURER);

      await logout();

      const myData2 = await getMyData();
      expect(myData2).toStrictEqual({ loggedIn: false });
    }

    const student = await addTestStudent();
    {
      await setLogin(student);
      const myData = await getMyData();
      expect(myData.loggedIn).toBe(true);
      expect(myData.role).toBe(STUDENT);
    }

    const superuser = await addTestSuperuser();
    {
      await setLogin(superuser);
      const myData = await getMyData();
      expect(myData.loggedIn).toBe(true);
      expect(myData.role).toBe(SUPERUSER);
    }
  });
});
