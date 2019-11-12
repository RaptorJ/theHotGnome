### Projet Node M2 2020 : The hot Gnome
### Réflexion et synopsis


### Analyser

Notre projet se présente sous la forme d’un site web de vente en ligne, tels qu’Amazon ou Fnac.com ou InstantGaming,
spécialisé dans le domaine de la pop culture. Le but de notre application est de proposer différents articles, divers et variés,
allant des livres aux matériels informatiques.

La plateforme web proposera donc un système d’authentification, avec des formes de privilèges (membres premium). L’authentification
permet de pouvoir constituer un panier et de passer des commandes via la plateforme. Les membres premium auront donc certains 
avantages (vente sans frais de port…).

La plateforme propose également un système de panier permettant à l’utilisateur d’enregistrer les articles qu’ils souhaite acheter.
Le panier est sauvegarder tant que la session de l’utilisateur est active, et effacé quand ce dernier se déconnecte.

Un système de liste de souhait permet donc aux utilisateurs de sauvegarder les articles qu’ils souhaitent pour être prévenu en cas de promotion.
L’utilisateur peut également séparer sa liste de souhait pour préétablir des commandes (liste de noël, liste d’anniversaire…)

Pour chaque article, la plateforme donne plusieurs informations en fonction du type de l’article (ISBN, résumé pour les livres,
caractéristique technique pour le matériel informatique…) ainsi qu’un système de notation et de commentaire. Ce système permet
aux utilisateurs ayant acheté l’article de pouvoir laisser un commentaire ainsi qu’une note.

En prenant en compte les commandes et les avis clients, le site proposera un classement des produits les plus vendus et les mieux notés.

Le header du site permettra d’avoir accès rapidement aux fonctionnalités de base de la plateforme (connexion, panier, liste de souhait)
ainsi qu’à une barre de recherche permettant de retrouver un article facilement parmi ceux proposé par le site.

La page d’accueil de la plateforme présentera les dernières nouveautés ainsi que les dernières offres promotionnelles.

Enfin, le site proposera des billets et des posts sur des évènements et des actualités en rapport avec les articles vendus, afin de faire
la promotion d’articles peu connu, ou revenir sur le succès de certains produits (80 ans de batman, marché des casques de réalité virtuelle,
l’univers de Tolkien, le panthéon des créateur de jeu Japonais ou encore la musique par le cloud…).

### Concevoir

Pour concevoir notre site, il est nécessaire de définir les solutions à mettre en oeuvre pour répondre aux besoins du projet.
En plus de la maquette présente dans le fichier maquette.png, cette partie répertorie les différentes fonctionnalités répondant au sujet:

* Login avec comptes basiques

La première fonctionnalité basique du site sera un système de login ou l’on pourra entrer son login et son mot de passe. Il sera éventuellement
possible de retrouver son mot de passe en envoyant un mail pour le réinitialiser. Cette page de login sera évidemment accessible depuis
la page d’accueil du site dans le header du site. On enregistrera les données de l’utilisateur comme son nom ou bien son adresse.

* Comptes premium fonctionnalités

Une fois les comptes créés, on ajoutera la fonctionnalité premium qui ajoutera des avantages, tels que les frais de port gratuits ou bien
une livraison plus rapide. Les comptes premium pourront faire l’objet d’une amélioration en y ajoutant d’autres fonctionnalités disponibles
uniquement pour ces comptes.

* Articles

Après avoir créé les comptes, on ajoute les articles. Les articles sont des objets qui contiendront un nom, un prix, une date d’ajout, un 
nombre de votes et une liste de commentaires. Ils seront disponibles sur la page d’accueil et pourront être trié en fonction du nom de la 
popularité ou de la date d’ajout.

* Commandes

Pour faire le lien entre les comptes et les articles, on ajoute l’objet commande. La commande contiendra d’une part le compte émetteur de 
la commande, une date d’émission, ainsi qu’une liste d’articles, un prix total. Il ne sera possible de passer une commande que si l’utilisateur 
est connecté et a entré une adresse dans ses données personnelles. L’utilisateur pourra voir à partir des données de son compte les commandes qui 
ont été émises. Lorsqu’une commande est reçue, elle sera marquée comme reçu.

* Barre de recherche

A partir de la page d’accueil, on ajoute une barre de recherche qui permettra à l’utilisateur (connecté ou non) de rechercher des articles en 
fonction de ce qu’il recherche. Il aura ainsi une liste en fonction de ce qu’il recherche. Si la liste est vide, on affiche un message à l’utilisateur 
pour lui signaler que son article est introuvable.

* Système de panier

Pour établir la commande, on ajoutera les articles au fur et à mesure avec un système de panier. Ce panier pourra aussi permettre de retirer des articles, 
modifier la quantité d’un même article, et confirmer la commande. Une fois le panier confirmé, on crée l’objet commande avec toutes les données 
correspondantes.

* Liste de souhait

En parallèle du panier, on ajoutera la liste de souhait, qui contiendra une liste d’article, et pourra notifier l’utilisateur par mail lorsqu’une 
promotion est disponible pour un article en question.


Après avoir défini le scope du projet, il est important de se pencher sur la question des différentes technologies à utiliser et de l’architecture 
projet à mettre en place. En effet, si l’utilisation de Node.js est somme toute évidente dans le cadre de ce cours, il existe plusieurs solutions 
concernant la partie front. Dans le cadre de ce projet, nous avons décidé d’utiliser Vue JS pour mettre en place la partie front. Ce Framework, bien 
que inconnu, nous semble  plutôt adapté pour ce type de projet. Pour la partie persistance des données, nous avons décidé de rester avec mongoDB dans 
un objectif de cohérence par rapport au cours.

Enfin au niveau de l’architecture, nous avions réfléchis à mettre en place une structure sous forme de SPA, mais dans le temps imparti et au vue 
de notre manque d’expérience avec le framework, nous préférons nous orienter sur une architecture plus classique avec plusieurs redirections vers 
différents fichiers vue. 


### Planifier

### Charge de travail
On définit une feuille de route des différentes étapes à implémenter dans le prototype. On définit la charge en jours-homme (8 heures) ainsi 
que l’ordre des fonctionnalités à ajouter pour le projet :

* Login avec comptes basiques : 0.5 jour-homme
* Articles : 2 jours-homme
* Commandes : 2 jours-homme
* Système de panier : 3 jours-homme
* Barre de recherche : 4 jours-homme
* Comptes premium : 1 jour-homme
* En parallèle de chaque étape, on implémente les vues qui prendront environ 1 jour-homme par page.

## Objectifs à atteindre :

* 18 novembre : Login et début d’implémentation d’articles + Vues
* 2 décembre : Articles et commandes + Vues
* 16 décembre : Système de panier et début d’implémentation de la barre de recherche + Vues 
* 30 décembre : Barre de recherche et comptes premium + Vues
* 12 janvier : Finalisation du projet + Soutenance préparée

### Réunions et sprints

On prévoit des réunions hebdomadaires pour préparer l’avancement du projet. Ces réunions auront pour vocation de présenter ce 
qui fonctionne et de discuter ce ce qui peut être amélioré. On discutera également de ce qui est prévu avant la prochaine réunion et 
des objectifs que l’on compte atteindre.

### Points à aborder pour la réunion :

* Avancement et test du prototype
* Objectifs atteints ?
* Problèmes rencontrés
* Résolution des problèmes
* Objectifs à atteindre et retard éventuel à rattraper

En fonction de l’emploi du temps de chacun, ces réunions pourront être idéalement organisées directement à l’école si possible, ou bien
par chat vocal via Internet sinon. Un compte rendu de chaque réunion sera écrit pour pouvoir retracer notre avancement.

### Définir un prototype initial

La réalisation de notre projet sera basé sur plusieurs étapes définies à partir des fonctionnalités à implémenter.

Tout d’abord, notre prototype sera constitué d’un système d’authentification, permettant à chaque utilisateur de se connecter.

De plus, notre prototype permettra aux utilisateurs connectés de créer ou modifier leur panier comportant les produits qui les intéressent. 
Le panier sera sauvegardé dans la session de l’utilisateur tant qu’il sera connecté.

Pour cela, nous avons besoin de mettre en place différents articles contenant différentes informations comme le prix. Aussi, la fonctionnalité de 
“passer une commande” sera donc importante afin que notre prototype soit fonctionnel.

Un prototype fonctionnel permettra donc de réaliser le scénario suivant :

* Un utilisateur s’inscrit / se connecte à son compte
* L’utilisateur peut modifier ses informations si besoin (Adresse de livraison, …)
* Il peut choisir l’article ou les articles qui l’intéresse(nt) en les ajoutant à son panier
* Il pourra ainsi modifier son panier si besoin
* L’utilisateur peut alors finaliser sa commande 

Ainsi, une fois que le prototype est fonctionnel, on pourra implémenter la possibilité d’avoir un compte premium. Une barre de recherche sera 
aussi mise en place afin de faciliter la recherche d’articles et la création des listes de souhait confortera cette idée de facilité.

On cherchera par la suite à mettre en place une esthétique à notre prototype dans le but d’améliorer l’expérience de l’utilisateur.
