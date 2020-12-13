import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import querystring from 'query-string'
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

let socket;
const Chat = () => {
    const { search } = useLocation()
    const query = querystring.parse(search)
    const { name, room } = query
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        socket = io('https://aqueous-thicket-63614.herokuapp.com/')
        socket.emit('join', { name, room }, error => {
            if (error) {
                alert(error)
            }
        })


        socket.on("message", (message) => {
            setMessages(existingMsg => [...existingMsg, message])    
        })


        socket.on("userList",({roomUsers})=>{
            setUsers(roomUsers)
        })

        
        return () => {
            socket.emit('disconnect')
            socket.close() ;
        }
    }, [])
    const sendMessage = (e) => {
        if (e.key === 'Enter' && e.target.value) {
            socket.emit('message', e.target.value)
            e.target.value = ""
        }
    }
    console.log(messages);
    return (
        <div className="chat">
            <div className="user-list">
                <div>user name</div>
                {users.map(user => <div key={user.id}>{user.name}</div>)}
            </div>
            <div className="chat-section">            
            <div className="chat-head">
                <div className="room">{room}</div>
                <Link to="/">X</Link>
            </div>
            <div className="chat-box">
                <ScrollToBottom className="messages">
                    {messages.map((message, index) => <div key={index} className={`message ${name === message.user ? "self" : ""}`} >
                        <span className="user">{message.user}</span>  <span className="message-text">{message.text}</span>
                    </div>)}
                </ScrollToBottom>
                <input type="text" onKeyDown={sendMessage} placeholder="message" />
            </div>
            </div>
        </div>
    );
};

export default Chat;