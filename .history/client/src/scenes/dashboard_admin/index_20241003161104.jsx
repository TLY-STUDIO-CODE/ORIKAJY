import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockUsers } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; 
import Header from "../../components/Header";
import React, { useEffect, useState } from 'react';
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { getMe } from '../../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrendingFlatOutlinedIcon from '@mui/icons-material/TrendingFlatOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state => state.auth));
  const [totalVentes, setTotalVentes] = useState(0);
  const [depenseTotal, setDepenseTotal] = useState(0);
  const [pertes, setPertes] = useState(0);
  const [beneficeTotal, setBeneficeTotal] = useState(0);
  const [users, setUsers] = useState([]);

    useEffect(() => {
        dispatch(getMe());
    }, [ dispatch]);

useEffect(() => {
      if (isError) {
          navigate("/");
      }
      if (user && user.role !== "admin") {
          navigate("/dashboard");
      }
  }, [isError, user, navigate]);


useEffect(() => {
    getTolalVentes();
    getBeneficeTotal();
    getDepensesTotal();
    getPerteTotal();
    getUsers();
}, []);

const getTolalVentes = async () => {
    try {
            const response = await axios.get(`http://localhost:5000/ventes`);
            setTotalVentes(response.data.totalVentes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des ventes.");
        }
};
const getBeneficeTotal = async () => {
    try {
            const response = await axios.get(`http://localhost:5000/benefice`);
            setBeneficeTotal(response.data.benefice);
        } catch (error) {
            toast.error("Erreur lors de la récupération des revenus.");
        }
};
const getDepensesTotal = async () => {
   try {
            const response = await axios.get(`http://localhost:5000/depenses`);
            setDepenseTotal(response.data.totalDepenses);
        } catch (error) {
            toast.error("Erreur lors de la récupération des dépenses.");
        }
};
const getPerteTotal = async () => {
      try {
            const response = await axios.get(`http://localhost:5000/pertes`);
            setPertes(response.data.pertes);
        } catch (error) {
            toast.error("Erreur lors de la récupération des pertes.");
        }
    
};

  const getUsers = async () => {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
  };




  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TABLEAU DE BORD ADMIN" subtitle="Bienvenue" name={user && user.name}  />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={beneficeTotal}
            subtitle="Bénéfice en AR"
            subtitle2={
              <Link to="/revenues" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
            }
            icon2={
              <TrendingFlatOutlinedIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            progress="0.75"
            increase="+14%"
            icon={
              <TrendingUpIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={pertes}
            subtitle="Perte en AR"
            subtitle2={
              <Link to="/revenues" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
            }
            icon2={
              <TrendingFlatOutlinedIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            progress="0.50"
            increase="+21%"
            icon={
              <TrendingDownIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={depenseTotal}
            subtitle="Dépense en AR"
            subtitle2={
              <Link to="/revenues" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
            }
            icon2={
              <TrendingFlatOutlinedIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            progress="0.30"
            increase="+5%"
            icon={
              <ShoppingCartOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalVentes}
            subtitle="Ventes en AR"
            subtitle2={
              <Link to="/revenues" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
            }
            icon2={
              <TrendingFlatOutlinedIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            progress="0.80"
            increase="+43%"
            icon={
              <ShoppingBagOutlinedIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Utilisateurs
            </Typography>
          </Box>
          {users.map((user, index) => (
            <Box
              key={`${user.uuid}-${index}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {user.uuid}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {user.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{user.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${user.image}
              </Box>
            </Box>
          ))}
        </Box>
         <Box
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Utilisateurs
            </Typography>
          </Box>
          {users.map((user, index) => (
            <Box
              key={`${user.uuid}-${index}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {user.uuid}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {user.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{user.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${user.image}
              </Box>
            </Box>
          ))}
        </Box>
         <Box
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Utilisateurs
            </Typography>
          </Box>
          {users.map((user, index) => (
            <Box
              key={`${user.uuid}-${index}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {user.uuid}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {user.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{user.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${user.image}
              </Box>
            </Box>
          ))}
        </Box>
         <Box
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Utilisateurs
            </Typography>
          </Box>
          {users.map((user, index) => (
            <Box
              key={`${user.id}-${index + 1}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {index +1}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {user.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{user.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {user.role}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default DashboardAdmin;
