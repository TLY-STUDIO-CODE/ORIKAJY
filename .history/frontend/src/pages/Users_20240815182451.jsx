import React from 'react';
import Layout from './Layout';
import Userlist from '../components/Userlist';


const Users = () => {
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
            <Userlist />
        </Layout>
    );
};

export default Users;