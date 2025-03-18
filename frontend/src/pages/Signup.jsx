import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import '../css/Signup.css';

function Signup() {
    const navigate=useNavigate()
    const [data,setData]=useState({
        name: '',
        email: '',
        password: '',
    })

    const registerUser = async (e) => 
    {
        e.preventDefault()
        const {name,email,password}=data
        try {
            const {data} = await axios.post('http://localhost:8000/signup',{name,email,password})
            if(data.error)
            {
                toast.error(data.error)
            }
            else
            {
                setData({ name: '', email: '', password: '' });

                toast.success('Login successfull')
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="signup-container">
        <form onSubmit={registerUser} className="signup-form">
            <label>Name</label>
            <input type="text" placeholder='Fullname' value={data.name} onChange={(e)=>setData({...data, name: e.target.value})}  className="signup-input" />
            <label>Email</label>
            <input type="email" placeholder='Email' value={data.email} onChange={(e)=>setData({...data, email: e.target.value})}  className="signup-input" />
            <label>Password</label>
            <input type="password" placeholder='Password' value={data.password} onChange={(e)=>setData({...data, password: e.target.value})} className="signup-input" />
            <button type='submit'  className="signup-button">Submit</button>
        </form>
    </div>
  )
}

export default Signup