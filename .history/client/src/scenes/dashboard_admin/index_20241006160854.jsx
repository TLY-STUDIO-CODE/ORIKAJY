import { Box,  Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; 
import Header from "../../components/Header";
import React, { useEffect, useState } from 'react';
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
const [stocks, setStocks] = useState([]);
const [transactions, setTransactions] = useState([]);
const [stockCount, setStockCount] = useState(0); 
const [transactionCount, setTransactionCount] = useState(0); 
const [commandeCount, setCommandeCount] = useState(0); 
const [achatCount, setAchatCount] = useState(0); 
const [vente2Count, setVente2Count] = useState(0); 
const [commandes, setCommandes] = useState([]);
const [totalMontant, setTotalMontant] = useState(0);
const [achats, setAchats] = useState([]);
const [montantTotal, setMontantTotal] = useState(0);
const [ventes2, setVentes2] = useState([]);
const [montantTotal2, setMontantTotal2] = useState(0);


const maxCommandes = 500; // Objectif pour les commandes, achats, et ventes
const maxAchats = 500;
const maxVentes2 = 500;

// Calculer les pourcentages pour chaque catégorie
const progressCommande = Math.min(commandeCount / maxCommandes, 1);
const progressAchat = Math.min(achatCount / maxAchats, 1);
const progressVente2 = Math.min(vente2Count / maxVentes2, 1);


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
    fetchStockCount();
    fetchTransactionCount();
    getStocks();
    getTransactions();
    fetchCommandeCount();
    fetchAchatCount();
    fetchVente2Count();
    getCommandes();
    getAchats();
    getVentes2();
}, []);

const groupVentesByClient = (ventes) => {
    const grouped = ventes.reduce((acc, vente) => {
        const { name_client } = vente;

        if (!acc[name_client]) {
            acc[name_client] = {
                uuid: vente.uuid,
                name_client,
                names: [],
                descriptions: [],
                categories: [],
                qtes: [],
                units: [],
                montants: [],
                montant_total: 0,
                date_vente: vente.date_vente,
                num_factV: vente.num_factV,
                createdBy: vente.user.name,
                validated: vente.validated,
            };
        }

        acc[name_client].names.push(vente.name);
        acc[name_client].descriptions.push(vente.description);
        acc[name_client].categories.push(vente.categories);
        acc[name_client].qtes.push(vente.qte);
        acc[name_client].units.push(vente.unit);
        acc[name_client].montants.push(vente.montant);
        acc[name_client].montant_total += vente.montant * vente.qte;

        return acc;
    }, {});

    return Object.values(grouped);
};

const getVentes2 = async () => {
    try {
        const response = await axios.get('http://localhost:5000/ventes2');
        const groupedVentes = groupVentesByClient(response.data);
        setVentes2(groupedVentes);

        // Calculer la somme totale de montant_total
        const totalMontant2 = groupedVentes.reduce((total, client) => total + client.montant_total, 0);

        // Mettre à jour l'état pour le montant total
        setMontantTotal2(totalMontant2);
    } catch (error) {
        console.error("Erreur lors de la récupération des ventes", error);
    }
};

const getAchats = async () => {
    try {
        const response = await axios.get('http://localhost:5000/achats');
        setAchats(response.data);
        
        // Calculer la somme totale de montant_total
        const totalMontant = response.data.reduce((total, achat) => total + achat.montant_total, 0);
        
        // Mettre à jour l'état pour le montant total
        setMontantTotal(totalMontant);
    } catch (error) {
        console.error("Erreur lors de la récupération des achats", error);
    }
};

const groupCommandesByClient = (commandes) => {
        const grouped = commandes.reduce((acc, commande) => {
            const { name_client } = commande;

            if (!acc[name_client]) {
                acc[name_client] = {
                    uuid: commande.uuid,
                    name_client,
                    names: [],
                    descriptions: [],
                    categories: [],
                    qtes: [],
                    units: [],
                    montants: [],
                    montant_totalC: 0,
                    date_commande: commande.date_commande,
                    num_factC: commande.num_factC,
                    createdBy: commande.user.name,
                    validated: commande.validated,
                };
            }

            acc[name_client].names.push(commande.name);
            acc[name_client].descriptions.push(commande.description);
            acc[name_client].categories.push(commande.categories);
            acc[name_client].qtes.push(commande.qte);
            acc[name_client].units.push(commande.unit);
            acc[name_client].montants.push(commande.montantC);
            acc[name_client].montant_totalC += commande.montantC * commande.qte;

            return acc;
        }, {});

        return Object.values(grouped);
    };

    const getCommandes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/commandes');
            const groupedCommandes = groupCommandesByClient(response.data);
            setCommandes(groupedCommandes);
              const totalMontant = groupedCommandes.reduce((total, client) => total + client.montant_totalC, 0);

        // Mettre à jour l'état ou les props pour utiliser totalMontant
        setTotalMontant(totalMontant);
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes", error);
        }
    };
    
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
const getStocks = async () => {
    const response = await axios.get('http://localhost:5000/stocks');
    setStocks(response.data);
};

  const getUsers = async () => {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
  };

  const fetchStockCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stocks/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setStockCount(response.data.totalStocks); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de\'produit', error);
    }
  };
  const fetchTransactionCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/transactions/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setTransactionCount(response.data.totalTransactions); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de\'transactions', error);
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

  const fetchCommandeCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/commandes/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setCommandeCount(response.data.totalCommandes); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de\'commandes', error);
    }
  };
  const fetchAchatCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/achats/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setAchatCount(response.data.totalAchats); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'achats', error);
    }
  };
  const fetchVente2Count = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ventes2/count'); // Appel API pour obtenir le nombre d'utilisateurs
      setVente2Count(response.data.totalVentes2); // Mettre à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'ventes', error);
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
        <Header title="TABLEAU DE BORD" subtitle="Bienvenue" name={user && user.name}  />

        <Box>
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
                <sup>{stockCount}</sup> {/* Nombre d'utilisateurs en exposant */}
              </span>
              Stocks
            </Typography>
            <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          <Link to="/stocks" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
        </Typography>
          </Box>
          {stocks.map((stock, index) => (
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
                  {stock.qte}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {stock.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{stock.date_stock}</Box>
              <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
              >
              {stock.montantS} AR
              </Box>
            </Box>
          ))}
        </Box>


        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="15px"
        >
          <Box
            display="flex"  // Utiliser flex pour aligner en parallèle
            justifyContent="space-between" // Espacement entre les éléments
            alignItems="center" // Aligner verticalement les éléments
            p="10px"  // Optionnel, pour espacer les éléments
          >
            {/* Texte Rapport sur les commandes */}
            <Typography variant="h5" fontWeight="600">
              Rapport sur les commandes
            </Typography>

            {/* Lien Voir plus */}
            <Typography
              variant="h5"
              fontStyle="italic"
              sx={{ color: colors.greenAccent[600] }}
            >
              <Link
                to="/commandes"
                style={{ textDecoration: "none", color: colors.greenAccent[600] }}
              >
                Voir plus
              </Link>
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            {/* Progress Circle avec le pourcentage */}
            <ProgressCircle size="125" progress={progressCommande} />
            <Typography
              variant="h5"
              color={progressCommande === 1 ? colors.greenAccent[500] : colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {commandeCount} commandes
            </Typography>
            <Typography variant="h6" color={colors.blueAccent[500]}>
              {Math.round(progressCommande * 100)}% atteint
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="15px"
        >
        <Box
            display="flex"  // Utiliser flex pour aligner en parallèle
            justifyContent="space-between" // Espacement entre les éléments
            alignItems="center" // Aligner verticalement les éléments
            p="10px"  // Optionnel, pour espacer les éléments
          >
          <Typography variant="h5" fontWeight="600">
            Rapport sur les achats
          </Typography>
          <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          <Link to="/achats" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                Voir plus
              </Link>
        </Typography>
        </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            {/* Progress Circle avec le pourcentage */}
            <ProgressCircle size="125" progress={progressAchat} />
            <Typography
              variant="h5"
              color={progressAchat === 1 ? colors.greenAccent[500] : colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {achatCount} achats
            </Typography>
            <Typography variant="h6" color={colors.blueAccent[500]}>
              {Math.round(progressAchat * 100)}% atteint
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="15px"
        >
          <Box
            display="flex"  // Utiliser flex pour aligner en parallèle
            justifyContent="space-between" // Espacement entre les éléments
            alignItems="center" // Aligner verticalement les éléments
            p="10px"  // Optionnel, pour espacer les éléments
          >
            <Typography variant="h5" fontWeight="600">
              Rapport sur les ventes
            </Typography>
            <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ color: colors.greenAccent[600] }}
          >
            <Link to="/Ventes2" style={{ textDecoration: 'none', color: colors.greenAccent[600] }}>
                  Voir plus
                </Link>
          </Typography>
        </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            {/* Progress Circle avec le pourcentage */}
            <ProgressCircle size="125" progress={progressVente2} />
            <Typography
              variant="h5"
              color={progressVente2 === 1 ? colors.greenAccent[500] : colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {vente2Count} ventes
            </Typography>
            <Typography variant="h6" color={colors.greyAccent[500]}>
              {montantTotal2}
            </Typography>
            <Typography variant="h6" color={colors.blueAccent[500]}>
              {Math.round(progressVente2 * 100)}% atteint
            </Typography>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default DashboardAdmin;
