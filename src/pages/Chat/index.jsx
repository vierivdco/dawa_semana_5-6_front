import { ModalRegister, DrawerList } from "../../components";
import { useState, useEffect } from "react";
import { get } from "../../services";
import Pusher from "pusher-js";

import HeaderLayout from "../../layout";

const Chat = () => {

  const [ users, setUsers ] = useState([]);

  const fetchUsers = async() => {
    const { id } = JSON.parse(localStorage.getItem("user"));

    const response = await get(`/user/${id}`);
    
    console.log(response);
    setUsers(response.data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const pusher = new Pusher('aae972dfb4a20c145d88', {
      cluster: 'us2'
    }) 

    const channel = pusher.subscribe('my-chat')

    channel.bind('my-list-contacts', async({ message }) => {
      console.log('message from pusher', message);
    })
  }, [])

  return (
    <HeaderLayout>
      {users.length > 0 && <DrawerList users={users} />}
      <ModalRegister 
        fetchUsers={fetchUsers}/>
    </HeaderLayout>
  );
};

export default Chat;