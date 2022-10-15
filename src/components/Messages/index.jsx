import { useState, useEffect, useRef } from "react";
import { Input, Button, Layout } from "antd";
import { get, post } from "../../services"
import Pusher from "pusher-js";
import Message from "../Message";

import "./index.css";

const MessageList = ({ user }) => {

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const ref = useRef(null);

  const fetchMessages = async () => {
    const { id } = JSON.parse(localStorage.getItem("user"));

    const response = await get(`/message/${id}/${user.id}`);
    setMessages(response.data);
    console.log(response.data);
    scroll()
  }

  const sendMessage = async () => {
    const { id } = JSON.parse(localStorage.getItem("user"));

    const data = {
      user_id: id,
      sender_id: user.id,
      message
    }
    setMessage("");
    await post("/message", data);
  }

  function scroll() {
    const messageContent = document.querySelector(".message__content");
    messageContent.scrollTop = messageContent.scrollHeight;
  }
  
  useEffect(() => {
    fetchMessages();
  }, [messages]);



  useEffect(() => {
    const { id } = JSON.parse(localStorage.getItem("user"));
    const pusher = new Pusher("4f8959b5b3fd57c01e15", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("my-chat");
    channel.bind(`new-message-${id}-${user.id}`, async ({
      message
    }) => {
      console.log("message from pusher", message);
    });
  }, []);

  return (
    <div className="message-list">
      <div className="message">
        <div className="message__content">
          <Layout.Header
            theme='light'
            className="header__container"
          >
            <div className="header">
              <img width={40} height={40} 
                className="message__content__avatar__img" 
                src={user.profile_url}
                alt="yara causaaaaaaa" 
              />
              <h4 className="">Conversation with <strong>{user.name}</strong></h4>
            </div>
          </Layout.Header>
          <div className="message__content__avatar">
            {
              messages.length > 0 &&
              messages.map((message, index) => (
                <Message senderUser={user} message={message} key={index} />
              ))
            }
          </div>
        </div>
      </div>
      <div className="input-message">
        <Input.Group>
          <Input
            size="large"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje pe causa..."
            style={{
              width: "calc(100% - 100px)",
            }}
          />
          <Button size="large" type="primary"
            onClick={sendMessage}
          >
            Enviar
          </Button>
        </Input.Group>
      </div>
    </div>
  );
};

export default MessageList;