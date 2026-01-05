import React, { useState, userEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormEditProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const saveProduct = async(e) =>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/products', {
                name: name,
                price: price
            });
            navigate("/products");
        } catch (error) {
            if(error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };
    return (
        <div>
            <h1 className="title">Products</h1>
            <h2 className="subtitle">Edit Product</h2>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form>
                            <div className="field">
                                <label lassName="label">Name</label>
                                <div className="control">
                                    <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
                                </div>
                            </div>
                            <div className="field">
                                <label lassName="label">Price</label>
                                <div className="control">
                                    <input type="text" className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button type="submit" className="button is-success">Update</button>
                                </div>
                            </div>            
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FormEditProduct;