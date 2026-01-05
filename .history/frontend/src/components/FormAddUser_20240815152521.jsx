import React from 'react';

const FormAddUser = () => {
    return (
        <div>
            <h1 className="title">Users</h1>
            <h2 className="subtitle">Add New User</h2>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form>
                            <div className="field">
                                <label lassName="label">Name</label>
                                <div className="control">
                                    <input type="text" className="input" placeholder="Name" />
                                </div>
                            </div>
                            <div className="field">
                                <label lassName="label">Email</label>
                                <div className="control">
                                    <input type="text" className="input" placeholder="Email" />
                                </div>
                            </div>
                            <div className="field">
                                <label lassName="label">Password</label>
                                <div className="control">
                                    <input type="password" className="input" placeholder="******"/>
                                </div>
                            </div>
                            <div className="field">
                                <label lassName="label">Confirm Password</label>
                                <div className="control">
                                    <input type="password" className="input" placeholder="******"/>
                                </div>
                            </div>
                            <div className="field">
                                <label lassName="label">Role</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <div className="button is-success is-fullwidth">
                                        Login
                                    </div>
                                </div>
                            </div>            
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FormAddUser;