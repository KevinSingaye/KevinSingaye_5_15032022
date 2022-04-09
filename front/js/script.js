const url = "http://localhost:3000/api/products"


//-- appel de la méthode Fetch pour récupérer l'ensemble des articles
fetch(url).then(function(reponse) {
    return reponse.json()
}).then(function(data) {
    console.log(data)
    displayItem(data)
})

//-- affichage des produits sur page d'accueuil 
function displayItem(data) {
    let items = document.getElementById("items")
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        items.innerHTML += ` <a href="./product.html?id=${item._id}">
            <article>
              <img src="${item.imageUrl}" alt="${item.altTxt}">
              <h3 class="productName">${item.name}</h3>
              <p class="productDescription">${item.description}</p>
            </article>   
          </a>`
    }
}