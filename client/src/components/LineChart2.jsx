import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";


const LineChart = ({  isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ventes2, setVentes2] = useState([]);
  const [achats, setAchats] = useState([]);
  const [commandes, setCommandes] = useState([]);

  // Récupération des données ventes
  useEffect(() => {
    getVentes2();
    getAchats();
    getCommandes();
  }, []);

  const groupVentesByClient = (ventes) => {
    const grouped = ventes.reduce((acc, vente) => {
      const { name_client } = vente;
      if (!acc[name_client]) {
        acc[name_client] = {
          uuid: vente.uuid,
          name_client,
          names: [],
          montant_total: 0,
        };
      }
      acc[name_client].names.push(vente.name);
      acc[name_client].montant_total += vente.montant * vente.qte;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const groupAchatsByFournisseur = (achats) => {
    const grouped = achats.reduce((acc, achat) => {
      const { name_four } = achat;
      if (!acc[name_four]) {
        acc[name_four] = {
          name_four,
          names: [],
          montant_total: 0,
        };
      }
      acc[name_four].names.push(achat.name);
      acc[name_four].montant_total += achat.montant_total;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const groupCommandesByClient = (commandes) => {
    const grouped = commandes.reduce((acc, commande) => {
      const { name_client } = commande;
      if (!acc[name_client]) {
        acc[name_client] = {
          uuid: commande.uuid,
          name_client,
          names: [],
          montant_totalC: 0,
        };
      }
      acc[name_client].names.push(commande.name);
      acc[name_client].montant_totalC += commande.montantC * commande.qte;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const getVentes2 = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ventes2');
      setVentes2(groupVentesByClient(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes", error);
    }
  };

  const getAchats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/achats');
      setAchats(groupAchatsByFournisseur(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des achats", error);
    }
  };

  const getCommandes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/commandes');
      setCommandes(groupCommandesByClient(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes", error);
    }
  };

  const formatLineData = () => {
    const ventesData = {
        id: "Ventes",
        color: "#4CAF50", // Vert pour le montant
        data: ventes2.map((vente) => ({
            x: `Client: ${vente.name_client}\nProduits: ${vente.names.length > 4 
                  ? `${vente.names[0]}, ${vente.names[1]}, et autres` 
                  : vente.names.join(", ")}`,
            y: vente.montant_total,
            fullLabel: `Client: ${vente.name_client}\nProduits: ${vente.names.join(", ")}` // Affichage complet dans l'info-bulle
        })),
    };

    const achatsData = {
        id: "Achats",
        color: "#2196F3", // Bleu pour les achats
        data: achats.map((achat) => ({
            x: `Fournisseur: ${achat.name_four}\nProduits: ${achat.names.length > 4 
                  ? `${achat.names[0]}, ${achat.names[1]}, et autres` 
                  : achat.names.join(", ")}`,
            y: achat.montant_total,
            fullLabel: `Fournisseur: ${achat.name_four}\nProduits: ${achat.names.join(", ")}` // Affichage complet dans l'info-bulle
        })),
    };

    const commandesData = {
        id: "Commandes",
        color: "#FFEB3B", // Jaune pour les commandes
        data: commandes.map((commande) => ({
            x: `Client: ${commande.name_client}\nProduits: ${commande.names.length > 4 
                  ? `${commande.names[0]}, ${commande.names[1]}, et autres` 
                  : commande.names.join(", ")}`,
            y: commande.montant_totalC,
            fullLabel: `Client: ${commande.name_client}\nProduits: ${commande.names.join(", ")}` // Affichage complet dans l'info-bulle
        })),
    };

    return [ventesData, achatsData, commandesData];
};

// Rendu du graphique
return (
    <ResponsiveLine
        data={formatLineData()}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
                fontSize: 12,
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
                fontSize: 5,
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
              fontSize: 12,
            },
          },
          tooltip: {
            container: {
              backgroundColor: colors.primary[500], // Couleur de fond de l'info-bulle
              color: '#fff', // Texte blanc pour l'info-bulle
              borderRadius: '5px',
              padding: '10px',
            },
          },
        }}
        colors={isCustomLineColors || isDashboard ? { datum: "color" } : { scheme: "nivo" }} // Couleurs personnalisées ou par défaut
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Produits",
            legendOffset: 36,
            legendPosition: "middle",
        }}
        axisLeft={{
            orient: "left",
            tickValues: 5,
            tickSize: 3,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Montant total",
            legendOffset: -40,
            legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        tooltip={({ point }) => (
            <div>
                <strong>{point.data.fullLabel}</strong>
                <br />
                Montant total: {point.data.yFormatted}
            </div>
        )}
        legends={[
            {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                    { on: "hover", style: { itemBackground: "rgba(0, 0, 0, .03)", itemOpacity: 1 } },
                ],
            },
        ]}
    />
);

};

export default LineChart;
