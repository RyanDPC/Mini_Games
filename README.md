Mini Games Store

Description

Mini Games Store est une plateforme en ligne que nous avons développée, Alessandro et moi, dans le cadre de notre formation à l'ETML. Cette application permet aux utilisateurs de se connecter, d'explorer et de jouer à divers jeux en ligne. Elle comprend des fonctionnalités sociales pour permettre aux utilisateurs de se connecter et interagir avec leurs amis.

Fonctionnalités principales

Page d'accueil interactive : Comprend un en-tête avec un logo, une barre de recherche, et une section utilisateur permettant de se connecter ou de voir son profil.

Jeux disponibles : Une collection de jeux en ligne, dont Blackjack, Morpion, et Snake, présentée sous forme de cartes avec une image et un nom.

Gestion des amis : Les utilisateurs connectés peuvent voir leur liste d'amis, les rechercher, les ajouter, ou les supprimer.

Jeux dynamiques : Les jeux sont accessibles via des pages dédiées, chaque jeu ayant ses propres fonctionnalités. Un bouton permet de revenir à l'accueil.

Session utilisateur persistante : Les utilisateurs restent connectés même après un rafraîchissement de la page.

Technologies utilisées

Node.js & Express : Backend et serveur.

EJS : Pour le rendu des vues côté serveur.

SQLite : Base de données pour stocker les utilisateurs, les jeux, et la liste d'amis.

JavaScript (Front-end) : Pour gérer la logique des jeux côté client.

HTML & CSS : Pour la structure et le style des pages.

HTTPS & Helmet : Pour la sécurité, l'application est servie en HTTPS et sécurisée avec des mesures CSP.

Comment exécuter le projet

Clonez le repository GitHub :

git clone <lien_du_repo>

Naviguez dans le dossier du projet :

cd Mini_Games_Store

Installez les dépendances :

npm install

Créez un fichier .env pour les variables d'environnement suivantes :

JWT_SECRET

REFRESH_TOKEN_SECRET

Démarrez le serveur (en HTTPS) :

npm start

Accédez à l'application sur https://localhost:4000

Collaboration

Ce projet a été réalisé par Alessandro et Ryan dans le cadre d'un projet de développement à l'ETML. Nous avons collaboré sur toutes les parties de l'application, depuis la planification, la conception des fonctionnalités, jusqu'à l'implémentation et la phase de tests.

Contribuer

Les contributions sont les bienvenues. Pour contribuer :

Fork le projet.

Créez une nouvelle branche :

git checkout -b feature/ma_nouvelle_fonctionnalite

Effectuez les modifications et validez-les :

git commit -m "Ajout de ma nouvelle fonctionnalité"

Poussez sur votre branche :

git push origin feature/ma_nouvelle_fonctionnalite

Ouvrez une Pull Request.

Licence

Ce projet est sous licence MIT. Vous pouvez librement l'utiliser et le modifier.

Contact

Pour toute question, vous pouvez nous contacter via nos profils GitHub.