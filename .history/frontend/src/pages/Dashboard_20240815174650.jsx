import React, { useEffect } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';


const Dashboard = () => {
    return  <Layout>
                <Welcome />
            </Layout>;
};

export default Dashboard;