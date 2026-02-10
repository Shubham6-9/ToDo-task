import React, { useState } from 'react'

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            alert('Please enter all the details');
            return;
        }
    }

    return (
        <>
            <div>
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='john@example.com' />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='john@example.com' />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='123456' />
                    <button type='submit'>Register</button>
                </form>
            </div>
        </>
    )
}
