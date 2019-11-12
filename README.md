### Projet Node M2 2020 : The hot Gnome
### R�flexion et synopsis


### Analyser

Notre projet se pr�sente sous la forme d�un site web de vente en ligne, tels qu�Amazon ou Fnac.com ou InstantGaming,
sp�cialis� dans le domaine de la pop culture. Le but de notre application est de proposer diff�rents articles, divers et vari�s,
allant des livres aux mat�riels informatiques.

La plateforme web proposera donc un syst�me d�authentification, avec des formes de privil�ges (membres premium). L�authentification
permet de pouvoir constituer un panier et de passer des commandes via la plateforme. Les membres premium auront donc certains 
avantages (vente sans frais de port�).

La plateforme propose �galement un syst�me de panier permettant � l�utilisateur d�enregistrer les articles qu�ils souhaite acheter.
Le panier est sauvegarder tant que la session de l�utilisateur est active, et effac� quand ce dernier se d�connecte.

Un syst�me de liste de souhait permet donc aux utilisateurs de sauvegarder les articles qu�ils souhaitent pour �tre pr�venu en cas de promotion.
L�utilisateur peut �galement s�parer sa liste de souhait pour pr��tablir des commandes (liste de no�l, liste d�anniversaire�)

Pour chaque article, la plateforme donne plusieurs informations en fonction du type de l�article (ISBN, r�sum� pour les livres,
caract�ristique technique pour le mat�riel informatique�) ainsi qu�un syst�me de notation et de commentaire. Ce syst�me permet
aux utilisateurs ayant achet� l�article de pouvoir laisser un commentaire ainsi qu�une note.

En prenant en compte les commandes et les avis clients, le site proposera un classement des produits les plus vendus et les mieux not�s.

Le header du site permettra d�avoir acc�s rapidement aux fonctionnalit�s de base de la plateforme (connexion, panier, liste de souhait)
ainsi qu�� une barre de recherche permettant de retrouver un article facilement parmi ceux propos� par le site.

La page d�accueil de la plateforme pr�sentera les derni�res nouveaut�s ainsi que les derni�res offres promotionnelles.

Enfin, le site proposera des billets et des posts sur des �v�nements et des actualit�s en rapport avec les articles vendus, afin de faire
la promotion d�articles peu connu, ou revenir sur le succ�s de certains produits (80 ans de batman, march� des casques de r�alit� virtuelle,
l�univers de Tolkien, le panth�on des cr�ateur de jeu Japonais ou encore la musique par le cloud�).

### Concevoir

Pour concevoir notre site, il est n�cessaire de d�finir les solutions � mettre en oeuvre pour r�pondre aux besoins du projet.
En plus de la maquette pr�sente dans le fichier maquette.png, cette partie r�pertorie les diff�rentes fonctionnalit�s r�pondant au sujet:

* Login avec comptes basiques

La premi�re fonctionnalit� basique du site sera un syst�me de login ou l�on pourra entrer son login et son mot de passe. Il sera �ventuellement
possible de retrouver son mot de passe en envoyant un mail pour le r�initialiser. Cette page de login sera �videmment accessible depuis
la page d�accueil du site dans le header du site. On enregistrera les donn�es de l�utilisateur comme son nom ou bien son adresse.

* Comptes premium fonctionnalit�s

Une fois les comptes cr��s, on ajoutera la fonctionnalit� premium qui ajoutera des avantages, tels que les frais de port gratuits ou bien
une livraison plus rapide. Les comptes premium pourront faire l�objet d�une am�lioration en y ajoutant d�autres fonctionnalit�s disponibles
uniquement pour ces comptes.

* Articles

Apr�s avoir cr�� les comptes, on ajoute les articles. Les articles sont des objets qui contiendront un nom, un prix, une date d�ajout, un 
nombre de votes et une liste de commentaires. Ils seront disponibles sur la page d�accueil et pourront �tre tri� en fonction du nom de la 
popularit� ou de la date d�ajout.

* Commandes

Pour faire le lien entre les comptes et les articles, on ajoute l�objet commande. La commande contiendra d�une part le compte �metteur de 
la commande, une date d��mission, ainsi qu�une liste d�articles, un prix total. Il ne sera possible de passer une commande que si l�utilisateur 
est connect� et a entr� une adresse dans ses donn�es personnelles. L�utilisateur pourra voir � partir des donn�es de son compte les commandes qui 
ont �t� �mises. Lorsqu�une commande est re�ue, elle sera marqu�e comme re�u.

* Barre de recherche

A partir de la page d�accueil, on ajoute une barre de recherche qui permettra � l�utilisateur (connect� ou non) de rechercher des articles en 
fonction de ce qu�il recherche. Il aura ainsi une liste en fonction de ce qu�il recherche. Si la liste est vide, on affiche un message � l�utilisateur 
pour lui signaler que son article est introuvable.

* Syst�me de panier

Pour �tablir la commande, on ajoutera les articles au fur et � mesure avec un syst�me de panier. Ce panier pourra aussi permettre de retirer des articles, 
modifier la quantit� d�un m�me article, et confirmer la commande. Une fois le panier confirm�, on cr�e l�objet commande avec toutes les donn�es 
correspondantes.

* Liste de souhait

En parall�le du panier, on ajoutera la liste de souhait, qui contiendra une liste d�article, et pourra notifier l�utilisateur par mail lorsqu�une 
promotion est disponible pour un article en question.


Apr�s avoir d�fini le scope du projet, il est important de se pencher sur la question des diff�rentes technologies � utiliser et de l�architecture 
projet � mettre en place. En effet, si l�utilisation de Node.js est somme toute �vidente dans le cadre de ce cours, il existe plusieurs solutions 
concernant la partie front. Dans le cadre de ce projet, nous avons d�cid� d�utiliser Vue JS pour mettre en place la partie front. Ce Framework, bien 
que inconnu, nous semble  plut�t adapt� pour ce type de projet. Pour la partie persistance des donn�es, nous avons d�cid� de rester avec mongoDB dans 
un objectif de coh�rence par rapport au cours.

Enfin au niveau de l�architecture, nous avions r�fl�chis � mettre en place une structure sous forme de SPA, mais dans le temps imparti et au vue 
de notre manque d�exp�rience avec le framework, nous pr�f�rons nous orienter sur une architecture plus classique avec plusieurs redirections vers 
diff�rents fichiers vue. 


### Planifier

### Charge de travail
On d�finit une feuille de route des diff�rentes �tapes � impl�menter dans le prototype. On d�finit la charge en jours-homme (8 heures) ainsi 
que l�ordre des fonctionnalit�s � ajouter pour le projet :

* Login avec comptes basiques : 0.5 jour-homme
* Articles : 2 jours-homme
* Commandes : 2 jours-homme
* Syst�me de panier : 3 jours-homme
* Barre de recherche : 4 jours-homme
* Comptes premium : 1 jour-homme
* En parall�le de chaque �tape, on impl�mente les vues qui prendront environ 1 jour-homme par page.

## Objectifs � atteindre :

* 18 novembre : Login et d�but d�impl�mentation d�articles + Vues
* 2 d�cembre : Articles et commandes + Vues
* 16 d�cembre : Syst�me de panier et d�but d�impl�mentation de la barre de recherche + Vues 
* 30 d�cembre : Barre de recherche et comptes premium + Vues
* 12 janvier : Finalisation du projet + Soutenance pr�par�e

### R�unions et sprints

On pr�voit des r�unions hebdomadaires pour pr�parer l�avancement du projet. Ces r�unions auront pour vocation de pr�senter ce 
qui fonctionne et de discuter ce ce qui peut �tre am�lior�. On discutera �galement de ce qui est pr�vu avant la prochaine r�union et 
des objectifs que l�on compte atteindre.

### Points � aborder pour la r�union :

* Avancement et test du prototype
* Objectifs atteints ?
* Probl�mes rencontr�s
* R�solution des probl�mes
* Objectifs � atteindre et retard �ventuel � rattraper

En fonction de l�emploi du temps de chacun, ces r�unions pourront �tre id�alement organis�es directement � l��cole si possible, ou bien
par chat vocal via Internet sinon. Un compte rendu de chaque r�union sera �crit pour pouvoir retracer notre avancement.

### D�finir un prototype initial

La r�alisation de notre projet sera bas� sur plusieurs �tapes d�finies � partir des fonctionnalit�s � impl�menter.

Tout d�abord, notre prototype sera constitu� d�un syst�me d�authentification, permettant � chaque utilisateur de se connecter.

De plus, notre prototype permettra aux utilisateurs connect�s de cr�er ou modifier leur panier comportant les produits qui les int�ressent. 
Le panier sera sauvegard� dans la session de l�utilisateur tant qu�il sera connect�.

Pour cela, nous avons besoin de mettre en place diff�rents articles contenant diff�rentes informations comme le prix. Aussi, la fonctionnalit� de 
�passer une commande� sera donc importante afin que notre prototype soit fonctionnel.

Un prototype fonctionnel permettra donc de r�aliser le sc�nario suivant :

* Un utilisateur s�inscrit / se connecte � son compte
* L�utilisateur peut modifier ses informations si besoin (Adresse de livraison, �)
* Il peut choisir l�article ou les articles qui l�int�resse(nt) en les ajoutant � son panier
* Il pourra ainsi modifier son panier si besoin
* L�utilisateur peut alors finaliser sa commande 

Ainsi, une fois que le prototype est fonctionnel, on pourra impl�menter la possibilit� d�avoir un compte premium. Une barre de recherche sera 
aussi mise en place afin de faciliter la recherche d�articles et la cr�ation des listes de souhait confortera cette id�e de facilit�.

On cherchera par la suite � mettre en place une esth�tique � notre prototype dans le but d�am�liorer l�exp�rience de l�utilisateur.
