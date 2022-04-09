 // Recuperation du panier depuis le localStorage
 let panier = JSON.parse(localStorage.getItem("panier"));
 // Recuperation de l'element graphique cart__items (section pour afficher le panier)
 const cartItem = document.getElementById("cart__items");
 // Recuperation de l'element graphique totalQuantity (span pour afficher le total des quantité)
 const totalQuantity = document.getElementById('totalQuantity');
 // Recuperation de l'element graphique totalprice (span pour afficher le total des prix total)
 const totalPrice = document.getElementById('totalPrice');
 // Recuperation de l'element graphique delete item (class pour afficher le total des prix total)
 const deleteItems = document.getElementsByClassName('deleteItem');
 // Definition de la variable qui va sommer les quantités
 let sumQuantity = 0;
 // Definition de la variable qui va sommer les prix total
 let sumPrice = 0;

 // Appel de la fonction displayPanier
 displayPanier();

 /* 
     Fontion qui affiche le panier avec tous les produits achetés
     Elle calculera egalement la somme des quantités dans la boucle qui affiche le contenu du panier
 */
 async function displayPanier() {
     panier = panier ? panier : []
         // Copie de la liste de panier pour pouvoir avoir la possibilité de modifier panier dans la boucle
     const result = panier ? [...panier] : [];
     // Parcours de la liste panier recuperée depuis localStorage
     for (let i = 0; i < panier.length; i++) {
         // Definition de la variable produit qui va se balader dans la boucle
         const produit = panier[i];
         // Appel de la fonction findArticleById
         await findArticleById(produit.produit)
             .then((article) => {
                 // Vérification de l'existance de la variable retournée par l'appel de la fonction findArticleById
                 if (article) {
                     // Calcule de la somme du prix total
                     sumPrice += Number(produit.quantite) * Number(article.price);
                     // Appel de la fonction displayProduit
                     displayProduit(produit, article);
                     // Affichage du total des prix total (verification de l'existance de l'element totalPrice)
                     if (totalPrice) {
                         totalPrice.innerHTML = sumPrice;
                     }
                     // Modification de la copie de panier pour garder le prix de l'article
                     result[i] = {...produit, price: article.price }
                 }
             })
             .catch((error) => {
                 console.log("Erreur de la requête API", error);
             });
         // Calcule de la somme des quantitées
         sumQuantity += Number(panier[i].quantite)
     }
     // Affichage du total des quantités (verification de l'existance de l'element totalQuantity)
     if (totalQuantity) {
         totalQuantity.innerHTML = sumQuantity
     }
     for (let i = 0; i < deleteItems.length; i++) {
         // Recuperation de l'element HTML du produit courant
         const contenu = cartItem.children[i];
         // Recuperation du contenu du panier (produit avec le prix de l'article)
         const produit = result[i];
         // Appel de la fonction addEventDelete
         addEventDelete(i, contenu, produit);
         // Appel de la fonction addEventChange
         addEventChange(i, contenu, produit);
         //console.log("contenu", contenu);
     }
 }

 /* 
    Fonction d'appel de API qui retourne un produit en fonction de son id.
    param : id = l'identifiant du produit
 */
 function findArticleById(id) {
     return fetch("http://localhost:3000/api/products/" + id).then((res) => res.json());
 }

 /* 
    Fonction qui affiche le detail d'un contenu du panier
    Définition des evenements sur la modification de la quantité et le clic sur le bouton supprimer
    param : index = position de du produit dans la liste panier
            produit = element produit ajouté dans le panier
            article = element article pris depuis la base de donnée
 */
 function displayProduit(produit, article) {
     // Ajout de l'expression HTML du produit (balise article) dans le panier (element cartItem)
     cartItem.innerHTML += `<article class="cart__item" data-id="${article._id}" data-color="${produit.couleur}">
                <div class="cart__item__img">
                  <img src="${article.imageUrl}" alt="${article.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${article.name}</h2>
                    <p>${produit.couleur}</p>
                    <p>${article.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantite}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
 }

 /* 
    Fonction qui definit l'evenement sur le click du bouton supprimer
    param : index = position de du produit dans la liste panier
            produit = element produit ajouté dans le panier
            contenu = element HTML du contenu du panier
 */
 function addEventDelete(index, contenu, produit) {
     // Recuperation de la liste des bouton supprimer definit sur le panier
     const btns_supprimer = contenu.getElementsByClassName('deleteItem');
     // Verification de l'existance de l'element btn_supprimer
     if (btns_supprimer) {
         // Recuperation du bouton du produit courant
         const btn_supprimer = btns_supprimer[0];
         // Définition de l'evenement du click sur le bouton
         btn_supprimer.addEventListener('click', () => deleteItem(index, contenu, produit))
     }
 }

 /* 
    Fonction qui supprime un contenu du panier 
    Recalcule de total quantite et de total prix
    Sauvegarde de la liste dans le localStorage
    param : index = position de du produit dans la liste panier
            produit = element produit ajouté dans le panier
            contenu = element HTML du contenu du panier
 */
 function deleteItem(index, contenu, produit) {
     // Verification de l'existance de l'element contenu
     if (contenu) {
         // Recalcule et Affichage du total des quantités (verification de l'existance de l'element totalQuantity)
         if (totalQuantity) {
             totalQuantity.innerHTML = Number(totalQuantity.innerHTML) - Number(produit.quantite);
         }
         // Recalcule et Affichage du total des prix total (verification de l'existance de l'element totalPrice)
         if (totalPrice) {
             totalPrice.innerHTML = Number(totalPrice.innerHTML) - (Number(produit.quantite) * Number(produit.price));
         }
         // Suppression de l'element dans l'element cartItem
         cartItem.removeChild(contenu);
         // Suppression de l'element dans la liste panier
         panier.splice(index, 1);
         // Sauvegarde de la liste panier modifié dans le localStorage
         localStorage.setItem("panier", JSON.stringify(panier));
     }
 }

 /* 
    Fonction qui definit l'evenement sur le changement de la quantitée
    param : index = position de du produit dans la liste panier
            produit = element produit ajouté dans le panier
            contenu = element HTML du contenu du panier
 */
 function addEventChange(index, contenu, produit) {
     // Recuperation de la liste des champs de quantité
     const inputs_quantite = contenu.getElementsByClassName('itemQuantity');
     // Verification de l'existance de l'element inputs_quantite
     if (inputs_quantite) {
         // Recuperation du champ de quantité du produit courant
         const input_quantite = inputs_quantite[0];
         // Définition de l'evenement du changement de la valeur du input de quantite
         input_quantite.addEventListener('change', (event) => changeItem(event.target.value, index, produit))
     }
 }

 /* 
    Fonction qui modifie un contenu du panier 
    Recalcule de total quantite et de total prix
    Sauvegarde de la liste dans le localStorage
    param : value = la nouvelle value du produit
            index = position du produit dans la liste panier
            produit = element produit ajouté dans le panier
 */
 function changeItem(value, index, produit) {
     // Recalcule et Affichage du total des quantités (verification de l'existance de l'element totalQuantity)
     if (totalQuantity) {
         totalQuantity.innerHTML = Number(totalQuantity.innerHTML) - Number(produit.quantite) + Number(value);
     }
     // Recalcule et Affichage du total des prix total (verification de l'existance de l'element totalPrice)
     if (totalPrice) {
         totalPrice.innerHTML = Number(totalPrice.innerHTML) - (Number(produit.quantite) * Number(produit.price)) + (Number(value) * Number(produit.price));
     }
     // Modification de la valeur de la quantité dans le produit
     produit.quantite = Number(value);
     // Modification de l'element dans la liste panier
     panier[index] = produit;
     // Sauvegarde de la liste panier modifié dans le localStorage
     localStorage.setItem("panier", JSON.stringify(panier));
 }


 let inputName = false
 let inputLastName = false
 let inputAdress = false
 let inputCity = false
 let inputMail = false


 //Instauration formulaire avec regex
 function getForm() {
     // Ajout des Regex
     let form = document.querySelector(".cart__order__form");

     //Création des expressions régulières
     let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
     let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
     let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

     // Ecoute de la modification du prénom
     form.firstName.addEventListener('change', function() {
         validFirstName(this);
     });

     // Ecoute de la modification du prénom
     form.lastName.addEventListener('change', function() {
         validLastName(this);
     });

     // Ecoute de la modification du prénom
     form.address.addEventListener('change', function() {
         validAddress(this);
     });

     // Ecoute de la modification du prénom
     form.city.addEventListener('change', function() {
         validCity(this);
     });

     // Ecoute de la modification du prénom
     form.email.addEventListener('change', function() {
         validEmail(this);
     });

     //validation du prénom
     const validFirstName = function(event) {
         let firstNameErrorMsg = event.nextElementSibling;
         inputName = charRegExp.test(event.value)
         if (inputName) {
             firstNameErrorMsg.innerHTML = '';
         } else {
             firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
         }
     };

     //validation du nom
     const validLastName = function(event) {
         let lastNameErrorMsg = event.nextElementSibling;
         inputLastName = charRegExp.test(event.value)
         if (inputLastName) {
             lastNameErrorMsg.innerHTML = '';
         } else {
             lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
         }
     };

     //validation de l'adresse
     const validAddress = function(event) {
         let addressErrorMsg = event.nextElementSibling;
         inputAdress = addressRegExp.test(event.value)
         if (inputAdress) {
             addressErrorMsg.innerHTML = '';
         } else {
             addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
         }
     };

     //validation de la ville
     const validCity = function(event) {
         let cityErrorMsg = event.nextElementSibling;
         inputCity = charRegExp.test(event.value)
         if (inputCity) {
             cityErrorMsg.innerHTML = '';
         } else {
             cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
         }
     };

     //validation de l'email
     const validEmail = function(event) {
         let emailErrorMsg = event.nextElementSibling;
         inputMail = emailRegExp.test(event.value)
         if (inputMail) {
             emailErrorMsg.innerHTML = '';
         } else {
             emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.';
         }
     };
 }
 getForm();

 //Envoi des informations client au localstorage
 function postForm() {
     const btn_commander = document.getElementById("order");

     //Ecouter le panier
     btn_commander.addEventListener("click", (event) => {

         //Récupération des coordonnées du formulaire client
         event.preventDefault();
         if (panier ? panier.length < 1 : true) {
             alert("votre panier est vide")

             return
         }
         if (!inputName ||
             !inputLastName ||
             !inputCity ||
             !inputAdress ||
             !inputMail
         ) {
             alert("Vous devez renseigner tous les champs !");

         } else {

             //Construction d'un array depuis le local storage
             let idProducts = [];
             for (let i = 0; i < panier.length; i++) {
                 idProducts.push(panier[i].produit);
             }
             console.log(idProducts);

             const order = {
                 contact: {
                     firstName: firstName.value,
                     lastName: lastName.value,
                     address: address.value,
                     city: city.value,
                     email: email.value,
                 },
                 products: idProducts,
             }

             console.log(order);
             const options = {
                 method: 'POST',
                 body: JSON.stringify(order),
                 headers: {
                     'Accept': 'application/json',
                     "Content-type": "application/json"
                 },
             };

             fetch("http://localhost:3000/api/products/order", options)
                 .then((response) => { return response.json() })
                 .then((data) => {
                     console.log(data);
                     //    localStorage.clear();
                     localStorage.setItem("orderId", data.orderId);

                     location.href = "confirmation.html?id=" + data.orderId;

                 })
                 .catch((err) => {
                     alert("Problème avec fetch : " + err.message);
                 });
         }
     })
 }
 postForm();