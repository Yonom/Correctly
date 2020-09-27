import useUsers from '../services/courses';
import { useOnErrorAlert } from '../utils/errors';

const test = (func) => {
    const {data: users } = useOnErrorAlert(useUsers());
    const userList  = [];

    for(let i = 0; i < users.length; i++){
        userList.push(users.userid[i]);
    }

    shuffle(userList);

    //for-schleife über userList
        //SQL für Anlegen von Review
        //if (letzer Student) --> letzer kontrolliert ersten im array
}

const shuffle = (func) => {
    //content
}

export default test;