import { useEffect, useRef, useState } from 'react';
import { imgurl, callApi, apibaseurl } from './lib';
import './App.css';
import ProgressBar from './components/ProgressBar.jsx';

const fallbackRoles = [
    { role: 1, rolename: "User" },
    { role: 2, rolename: "Manager" },
    { role: 3, rolename: "Admin" },
    { role: 4, rolename: "Guest" }
];

const App = () => {
    const [isSignin, setIsSignIn] = useState(true);
    const finput = useRef();
    const [isProgress, setIsProgress] = useState(false);
    const [errorData, setErrorData] = useState({});
    const [roles, setRoles] = useState(fallbackRoles);
    const [signupData, setSignupData] = useState({
        fullname: "",
        phone: "",
        email: "",
        password: "",
        retypepassword: "",
        role: ""
    });

    const [signinData, setSigninData] = useState({
        username: "",
        password: "",
        role: ""
    });

    useEffect(()=>{
        setTimeout(() => {finput.current?.focus();}, 0);
    }, [isSignin]);

    useEffect(() => {
        fetch(apibaseurl + "/authservice/roles")
            .then((res) => res.json())
            .then((data) => setRoles(data.roles || fallbackRoles))
            .catch(() => setRoles(fallbackRoles));
    }, []);

    function switchWindow(){
        setIsSignIn(prev => !prev);
        setErrorData({});
        setSigninData({
            username: "",
            password: "",
            role: ""
        });

        setSignupData({
            fullname: "",
            phone: "",
            email: "",
            password: "",
            retypepassword: "",
            role: ""
        });
    }

    function handleSigninInput(e){
        const {name, value} = e.target;
        setSigninData({...signinData, [name]: value});
    }

    function handleSignupInput(e){
        const {name, value} = e.target;
        setSignupData({...signupData, [name]: value});
    }

    function validateSignup(){
        let errors = {};
        if(signupData.fullname === "") errors.fullname = true;
        if(signupData.phone === "") errors.phone = true;
        if(signupData.email === "") errors.email = true;
        if(signupData.password === "") errors.password = true;
        if(signupData.retypepassword === "" || signupData.password !== signupData.retypepassword) errors.retypepassword = true;
        if(signupData.role === "") errors.role = true;
        setErrorData(errors);
        return Object.keys(errors).length > 0;
    }

    function validateSignin(){
        let errors = {};
        if(signinData.username === "") errors.username = true;
        if(signinData.password === "") errors.password = true;
        if(signinData.role === "") errors.role = true;
        setErrorData(errors);
        return Object.keys(errors).length > 0;
    }

    function signin(){
        /*Connect backend using callApi() function from lib.js
        Refer lib.js for callApi() parameters*/
        if(validateSignin())
            return;

        setIsProgress(true);
        callApi("POST", apibaseurl + "/authservice/signin", {...signinData, username: signinData.username.trim()}, null, signinResponseHandler);
    }

    function signup(){
        /*Connect backend using callApi() function from lib.js
        Refer lib.js for callApi() parameters*/
        if(validateSignup())
            return;

        setIsProgress(true);
        callApi("POST", apibaseurl + "/authservice/signup", signupData, null, signupResponseHandler);
    }

    function signinResponseHandler(res){
        if(res.code != 200)
            alert(res.message);
        else{
            localStorage.setItem("token", res.jwt);
            localStorage.setItem("username", signinData.username);
            window.location.replace("/home");
        }  
        setIsProgress(false);
    }

    function signupResponseHandler(res){
        alert(res.message);
        setIsProgress(false);
        setSignupData({
            fullname: "",
            phone: "",
            email: "",
            password: "",
            retypepassword: "",
            role: ""
        });
        finput.current?.focus();
    }

    return (
        <div className='app'>
            <div className='container' key={isSignin ? "signin" : "signup"}>
                <div className='container-header'>
                    <label>{isSignin ? "Login": "Create Account"}</label>
                    <img src={imgurl + "logo.png"} alt='' />
                </div>
                <div className='container-content'>
                    {isSignin? 
                        <>
                        <label>Username*</label>
                        <div className='input-group'>
                            <img src={imgurl + "user.png"} />
                            <input type='text' ref={finput} className={errorData.username ? 'error' : ''} placeholder='Enter email id' autoComplete='off' name="username" value={signinData.username} onChange={(e)=>handleSigninInput(e)} />
                        </div>
                        <label>Password*</label>
                        <div className='input-group'>
                            <img src={imgurl + "padlock.png"} />
                            <input type='password' className={errorData.password ? 'error' : ''} placeholder='Enter password' name='password' value={signinData.password} onChange={(e)=>handleSigninInput(e)} />
                        </div>
                        <label>Role*</label>
                        <div className='input-group'>
                            <select name='role' className={errorData.role ? 'error' : ''} value={signinData.role} onChange={(e)=>handleSigninInput(e)}>
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option value={role.role} key={role.role}>{role.rolename}</option>
                                ))}
                            </select>
                        </div>
                        <p>Forgot <span>Password?</span></p>
                        <button onClick={()=>signin()}>Login</button>
                        <label onClick={()=>switchWindow()}>Don't have an account? <span>Sign up</span></label>
                        </>
                    :
                        <>
                        <label>Full Name*</label>
                        <div className='input-group'>
                            <img src={imgurl + "user.png"} />
                            <input type='text' ref={finput} className={errorData.fullname ? 'error' : ''}  placeholder='Enter full name' autoComplete='off' name='fullname' value={signupData.fullname} onChange={(e)=>handleSignupInput(e)} />
                        </div>
                        <label>Mobile Number*</label>
                        <div className='input-group'>
                            <img src={imgurl + "phone.png"} />
                            <input type='text' className={errorData.phone ? 'error' : ''} placeholder='Enter mobile number' autoComplete='off' name='phone' value={signupData.phone} onChange={(e)=>handleSignupInput(e)} />
                        </div>
                        <label>Email Address*</label>
                        <div className='input-group'>
                            <img src={imgurl + "email.png"} />
                            <input type='text' className={errorData.email ? 'error' : ''} placeholder='Enter email id' autoComplete='off' name='email' value={signupData.email} onChange={(e)=>handleSignupInput(e)} />
                        </div>
                        <label>Password*</label>
                        <div className='input-group'>
                            <img src={imgurl + "padlock.png"} />
                            <input type='password' className={errorData.password ? 'error' : ''} placeholder='Enter password' autoComplete='off' name='password' value={signupData.password} onChange={(e)=>handleSignupInput(e)} />
                        </div>
                        <label>Re-type Password*</label>
                        <div className='input-group'>
                            <img src={imgurl + "padlock.png"} />
                            <input type='password' className={errorData.retypepassword ? 'error' : ''} placeholder='Re-type your password' autoComplete='off' name='retypepassword' value={signupData.retypepassword} onChange={(e)=>handleSignupInput(e)} />
                        </div>
                        <label>Role*</label>
                        <div className='input-group'>
                            <select name='role' className={errorData.role ? 'error' : ''} value={signupData.role} onChange={(e)=>handleSignupInput(e)}>
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option value={role.role} key={role.role}>{role.rolename}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={()=>signup()}>Register</button>
                        <label onClick={()=>switchWindow()}>Already have an account? <span>Sign in</span></label>
                        </>
                    }
                </div>
                <div className='container-footer'>Copyright @ 2026. All rights reserved.</div>
            </div>

            <ProgressBar isProgress={isProgress}/>
        </div>
    );
}

export default App;
