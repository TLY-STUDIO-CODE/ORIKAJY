import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
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
  const [userCount, setUserCount] = useState(0); 
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [productCount, setProductCount] = useState(0); 
  const [transactionCount, setTransactionCount] = useState(0); 

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
    fetchUserCount();
    fetchProductCount();
    fetchTransactionCount();
    getProducts();
    getTransactions();
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
const getProducts = async () => {
    const response = await axios.get('http://localhost:5000/products');
    setProducts(response.data);
};

  const getUsers = async () => {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
  };

  const fetchProductCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setProductCount(response.data.totalProducts); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'utilisateurs', error);
    }
  };
  const fetchTransactionCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/transactions/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setTransactionCount(response.data.totalTransactions); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'utilisateurs', error);
    }
  };
  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setUserCount(response.data.totalUsers); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'utilisateurs', error);
    }
  };


  const groupTransactionsByClient = (transactions) => {
        const grouped = transactions.reduce((acc, transaction) => {
            const { num_factT } = transaction;
            
            if (!acc[num_factT]) {
                acc[num_factT] = {
                    uuid: transaction.uuid, 
                    num_factT,
                    descriptions: [],
                    types: [],
                    qtes: [],
                    montants: [],
                    montant_total: 0,
                    date_transaction: transaction.date_transaction,
                    createdBy: transaction.user.name,
                };
            }

            acc[num_factT].descriptions.push(transaction.description_transaction);
            acc[num_factT].qtes.push(transaction.qte_transaction);
            acc[num_factT].types.push(transaction.type_transaction);
            acc[num_factT].montants.push(transaction.montant_transaction);
            acc[num_factT].montant_total += transaction.montant_transaction * transaction.qte_transaction;

            return acc;
        }, {});

        return Object.values(grouped); // Convertir l'objet en tableau
    };

    const getTransactions = async () => {
        const response = await axios.get('http://localhost:5000/transactions');
        const groupedTransactions = groupTransactionsByClient(response.data);
        setTransactions(groupedTransactions);
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
          gridColumn="span 4"
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
              <span style={{ color: colors.greenAccent[500], fontSize: '16px', marginRight: '5px' }}>
                <sup>{userCount}</sup> {/* Nombre d'utilisateurs en exposant */}
              </span>
              Utilisateurs
            </Typography>
            <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          <Link to="/users" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
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
                  {user.email}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {user.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}></Box>
              <Box
                
                p="5px 10px"
                borderRadius="4px"
              >
                <img 
                  src={`http://localhost:5000${user.image}`} 
                  alt="User" 
                  style={{ width: 50, height: 50, borderRadius: '50%' }} 
                />
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          gridColumn="span 4"
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
              <span style={{ color: colors.greenAccent[500], fontSize: '16px', marginRight: '5px' }}>
                <sup>{transactionCount}</sup> {/* Nombre d'utilisateurs en exposant */}
              </span>
              Transactions
            </Typography>
            <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          <Link to="/transactions" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
        </Typography>
          </Box>
          {transactions.map((transaction, index) => (
            <Box
              key={`${transaction.id}-${index + 1}`}
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
                  {index + 1}
                </Typography>
                <Typography color={colors.grey[100]}>
                    {transaction.types.join(", ")}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date_transaction}</Box>
              <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
              >
                {transaction.montants.join(", ")} AR
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          gridColumn="span 4"
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
              <span style={{ color: colors.greenAccent[500], fontSize: '16px', marginRight: '5px' }}>
                <sup>{productCount}</sup> {/* Nombre d'utilisateurs en exposant */}
              </span>
              Produits
            </Typography>
            <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          <Link to="/products" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
        </Typography>
          </Box>
          {products.map((product, index) => (
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
                  {index + 1}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {product.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>Crée par {product.user.name}</Box>
              <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
              >
              {product.price} AR
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
        
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default DashboardAdmin;
