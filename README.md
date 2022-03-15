# Kanap #

This is the front end and back end server for Project 5 of the Web Developer path.

### Back end Prerequisites ###

You will need to have Node and `npm` installed locally on your machine.

### Back end Installation ###

Clone this repo. From the "back" folder of the project, run `npm install`. You 
can then run the server with `node server`. 
The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.


const url = "http://localhost:3000/api/products"

fetch (url).then(function(response) {
return response.json();})
.then(function(data) {
console.log(data)
displayItem(data) })

----
 
function(displayItem) {
let items = document.getElementById("items")
for (i=0; i<data.length; i++)
items.innerHTML = <a href= `./product.html?id=${items._id}">
            <article>
              <img src=".../${items.imageUrl}" alt="${items.altTxt}">
              <h3 class="items.name">Kanap name1</h3>
              <p class="${items.description}">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
            </article>
          </a> `




