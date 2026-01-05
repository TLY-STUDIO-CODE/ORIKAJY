import React from 'react';
import Layout from './Layout';
import FormAddUser from '../components/FormAddUser';


const AddUser = () => {
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
            <FormAddUser />
        </Layout>
    )
}

export default AddUser;