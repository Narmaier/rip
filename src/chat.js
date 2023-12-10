import React,{useState, useEffect} from "react";
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [isConnect, setIsConnect] = useState(false);
    useEffect(() => {
        console.log("start");
        let newSocket;
        if (!isConnect){
            setIsConnect(true);
            newSocket = new WebSocket('ws://localhost:8080/');
            newSocket.onopen = () =>{
                console.log('Connection established');
            }
            newSocket.onmessage = (e) => {
                setMessages((prevMessages) => [...prevMessages,e.data]);
                console.log(e.data);
            }
            setSocket(newSocket);
        }
        console.log("End");
        return () => {
            if (newSocket && newSocket.readyState === 1){
                newSocket.close();
            }
        }
    },[isConnect]);

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const handleSendMessage = () => {
        
            socket.send(input);
            
            setInput('');
        
    };


    return (
        <div>
            <div>
                <div>
                    {messages.map((message,index) => (
                        <div key={index}>{message}</div>
                    ))}
                </div>
                <input value={input} onChange={handleInputChange}/>
                <button onClick={handleSendMessage}>Отправить</button>
            </div>
        </div>
    )
}

export default Chat;