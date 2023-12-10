import React, {useState} from 'react';
import axios from 'axios';

const Login = ({LogIn}) => {
    const [logData,setLogData] = useState({
    email: "",
    password: "",    
    });
    const [token, setToken] = useState('');
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/login_check',{
                username: logData.email,
                password: logData.password
            });
            const token = response.data.token;
            setToken(token);
            window.localStorage.setItem('token', token);
            LogIn();
        }
        catch (error){
            console.error('Login error: ', error);
            //setLg('ошибка входа');
        }
        
    };
  
    return (<div>
        <input type="text" placeholder='Email' onChange={(e) => setLogData((prevState)=>({
            ...prevState,
            email:e.target.value
        }))}/>
        <input type="password" placeholder='Password' onChange={(e) => setLogData((prevState)=>({
            ...prevState,
            password:e.target.value
        }))}/>
        <button onClick={handleLogin}>Login</button>
    </div>);
};

export default Login;