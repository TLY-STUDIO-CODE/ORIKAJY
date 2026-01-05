import React from 'react';
import Layout from './Layout';
import Productlist from '../components/Productlist';

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isError} = useSelector((state => state.auth));

    useEffect(() => {
        dispatch(getMe());
    }, [ dispatch]);

    useEffect(() => {
        if(isError){
            navigate("/");
        }
    }, [isError, navigate]);
    return (
        
        <Layout>
            <Productlist />
        </Layout>
    )
}

export default Products;