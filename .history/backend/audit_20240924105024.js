// audit.js
import User from "../models/UserModel.js";
import socket from "../socket.js"; // Importer le fichier Socket.IO si nécessaire

// Exemple d'événement pour gérer les actions utilisateur
export const logUserAction = async (userId, action) => {
try {
// Logique pour enregistrer l'action dans la base de données
console.log(`Action de l'utilisateur ${userId} : ${action}`);

// Émettre l'événement via Socket.IO
socket.emit("user-action", {
    userId: userId,
    action: action,
    timestamp: new Date(),
});
} catch (error) {
console.error("Erreur lors de l'enregistrement de l'action :", error.message);
}
};
