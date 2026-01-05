import React from 'react'

const Login = () => {
    return (
            <section class="hero has-background-grey-light is-fullheight is-fullwidth">
                <div class="hero-body">
                    <div class="container">
                        <div className="columns is-center">
                            <div className="column is-4">
                                <form className="box">
                                    <div className="field">
                                        <label lassName="label">Email</label>
                                        <div className="control">
                                            <input type="text" className="input" placeholder="Email"/>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label lassName="label">Password</label>
                                        <div className="control">
                                            <input type="password" className="input" placeholder="******"/>
                                        </div>
                                    </div>
                                    <div className="field">
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

export default Login