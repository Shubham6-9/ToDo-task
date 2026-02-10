import React from 'react'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter all the details');
      return;
    }
  }

  return (
    <>
        <div>
            <h1>Login</h1>
            <form action="">
                <input type="text" placeholder='john@example.com' />
                <input type="password" placeholder='Password' />
                <button type='submit'>Login</button>
            </form>
        </div>
    </>
  )
}
