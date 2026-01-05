import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const Productlist = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () =>{
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
    }
    return (
        <div>
            <h1 className="title">Products</h1>
            <h2 className="subtitle">List of Products</h2>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index)=>(
                        <tr key={product.uuid}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.user.name}</td>
                            <td>
                                <Link to={`/products/edit/${product.uuid}`} className="button is-small is-info">Edit</Link>
                                <button onClick={()=> deleteProduct(product.uuid)} className="button is-small is-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Productlist;