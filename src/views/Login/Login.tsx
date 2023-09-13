import './Login.scss';
import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import MainView from '../MainView/MainView';

const Login: React.FC = () => {
  // const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    window.location.replace('../MainView/MainView');
    // history.push(MainView);
    // อ่านข้อมูลผู้ใช้จากไฟล์ JSON (ในสรา้งแอพของคุณ คุณต้องใช้วิธีการแบบนี้เพื่ออ่านข้อมูลจากไฟล์ JSON)
    // window.location.replace('../MainView/MainView');
    // fetch('/users.json')
    //   .then(response => response.json())
    //   .then(data => {
    //     const { users } = data;
    //     const user = users.find((user: any) => user.username === username && user.password === password);
    //     if (user) {
    //       // ถ้าเจอข้อมูลผู้ใช้ ให้เข้าสู่ระบบและเปลี่ยนเส้นทางไปยังหน้าหลัก
    //       // history.push('../MainView/MainView');
    //       window.location.replace('../MainView/MainView');
    //     } else {
    //       alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    //     }
    //   });
  };

  const handleRegister = () => {
    // อ่านข้อมูลผู้ใช้จากไฟล์ JSON (ในสรา้งแอพของคุณ คุณต้องใช้วิธีการแบบนี้เพื่ออ่านข้อมูลจากไฟล์ JSON)
    fetch('/users.json')
      .then(response => response.json())
      .then(data => {
        const { users } = data;
        const userExists = users.some((user: any) => user.username === username);

        if (userExists) {
          alert('ชื่อผู้ใช้นี้มีอยู่แล้ว');
        } else {
          // เพิ่มข้อมูลผู้ใช้ใหม่ลงใน JSON
          const newUser = { username, password };
          users.push(newUser);

          // บันทึกข้อมูลลงในไฟล์ JSON (ในสรา้งแอพของคุณ คุณต้องใช้วิธีการแบบนี้เพื่อบันทึกข้อมูล)
          fetch('/users.json', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          alert('ลงทะเบียนสำเร็จ');
          // history.push('/login');
        }
      });
  };

  return (
    <div>
      <h2>Welcome to Login page</h2>
      <div>
        <div>Username:</div>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <div>Password:</div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Login;
