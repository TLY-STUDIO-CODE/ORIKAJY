import React, { useState, userEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {LoginUser, reset } from "../features/authSlice";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
            <section class="hero has-background-grey-light is-fullheight is-fullwidth">
                <div class="hero-body">
                    <div class="container">
                        <div className="columns is-centered">
                            <div className="column is-4">
                                <form className="box">
                                    <h1 className="title is-2">Sign In</h1>
                                    <div className="field">
                                        <label lassName="label">Email</label>
                                        <div className="control">
                                            <input type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label lassName="label">Password</label>
                                        <div className="control">
                                            <input type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="******"/>
                                        </div>
                                    </div>
                                    <div className="field mt-5">
                                        <div className="button is-success is-fullwidth">
                                            Login
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
};

export default Login;