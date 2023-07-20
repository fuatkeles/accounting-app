import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import "../App.css"

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    
    const SignUp = async (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword (auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            navigate('/login');
        })
        .catch((error) => {
            console.log(error);
        }

        )       
    }
      
    const handleLogInClick = () => {
        navigate('/login'); // SignUp sayfasına yönlendir
    };
 return ( 
    <>  
        <div className='signup-container'>
            <form onSubmit={SignUp}>
                <h1>Create an Account</h1>
                <input type="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button type='submit'>Sign Up</button>
                <div className="mt-3">
                <p>
                  Have an Account?{' '}
                  <button type="button" onClick={handleLogInClick}>
                    Log In
                  </button>
                </p>
              </div>
            </form>
        </div>
    </>
  )
}

export default SignUp