import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../../utils/api";
import Contact from "../component/Contact";
import Welcome from "../component/Welcome";
import ChatContainer from "../component/ChatContainer";
import { io } from "socket.io-client";

export default function Chat() {
  const socket = useRef()
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(()=>{
    const fetchCurrentUser =()=>{
      if(currentUser){
        socket.current = io(host)
        socket.current.emit("add-user", currentUser._id)
      }
    }
    fetchCurrentUser()
  },[currentUser])

  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        const user = JSON.parse(localStorage.getItem("chat-app-user"));
        setCurrentUser(user);
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchData();
  }, [currentUser, navigate]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contact
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (max-width: 720px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
