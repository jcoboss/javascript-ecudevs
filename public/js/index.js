let peliculas = [];

let tipos = ["movie", 'documental'];

function obtenerDatosYRenderizar(){
    console.log(1);    
  fetch('/peliculas').then(function(response){
      console.log(2);
    if(response.ok){
      response.json().then(function(datos){
          console.log(3);
        peliculas = datos;
        renderizarPeliculas();
      }).catch(function(error){
          console.log(error);
      });
      console.log(4);
    }
  });
  console.log(5);
}

obtenerDatosYRenderizar();

function renderizarPeliculas(){
    let aDibujar = [];
    peliculas.forEach(function(itemPelicula, index){
        aDibujar.push(`
                <div class="col-lg-4">
                    <div class="card">
                        <img src="${itemPelicula.Poster}" class="card-img-top" alt="..."/>
                        <div class="card-body">
                        <h5 class="card-title">${itemPelicula.Title}</h5>
                        <p class="card-text">${itemPelicula.Type} - ${itemPelicula.Year}</p>
                        <button type="button" class="btn btn-primary" onclick="cargarInfoYMostrarFormulario(${index})">Editar</button>
                        <button type="button" class="btn btn-danger" onclick="eliminar(${itemPelicula.imdbID})">Eliminar</button>
                        </div>
                    </div>
                </div>`); 
    });    
    document.getElementById('peliculas').innerHTML = aDibujar.join("");
}


let showTipos = [];
tipos.forEach((e)=>{ showTipos.push(`
    <option value="${e}">${e}</option>
`)});
showTipos.unshift(`<option disabled selected value> -- selecciona una opción -- </option>`);

document.getElementById('Type').innerHTML = showTipos.join("");

async function guardar(event){
    event.preventDefault();

    let pelicula = {
        Title: document.getElementById('Title').value,
        Year: document.getElementById('Year').value,
        Type: document.getElementById('Type').value,
        Poster: document.getElementById('Poster').value
    }

    let imdbID = document.getElementById('imdbID').value;

    if(imdbID === "") {
       try {
            let response = await fetch('/pelicula', {
            method: 'POST',
            body: JSON.stringify(pelicula),
            headers: {
                "Content-Type":"application/json"
            }
            });
            if(response.ok){
                let data = await response.json();
                alert(data.mensaje);            
            }
       } catch(error){
           alert(error.message);    
       }
    } else {
        try {
            let response = await fetch('/pelicula', {
            method: 'PUT',
            body: JSON.stringify({...pelicula, imdbID }),
            headers: {
                "Content-Type":"application/json"
            }
            });
            if(response.ok){
                let data = await response.json();
                alert(data.mensaje);            
            }
       } catch(error){
           alert(error.message);    
       }
    }    
    
    obtenerDatosYRenderizar();
    // renderizarPeliculas();
    $('#formulario').modal('hide');

    // BORRAR CAMPOS    
    event.target.reset();
    // document.getElementById('Title').value = "";
    // document.getElementById('Year').value = "";
    // document.getElementById('Type').value = "";
    // document.getElementById('Poster').value = "";    
}

function cargarInfoYMostrarFormulario(index){
    let elementoSeleccionado = peliculas[index];
    document.getElementById('imdbID').value = elementoSeleccionado.imdbID;
    document.getElementById('Title').value = elementoSeleccionado.Title;
    document.getElementById('Year').value = elementoSeleccionado.Year;
    document.getElementById('Type').value = elementoSeleccionado.Type;
    document.getElementById('Poster').value = elementoSeleccionado.Poster;
    $('#formulario').modal('show');
}

async function eliminar(imdbID) {
  try {
          let response = await fetch('/pelicula/' + imdbID, {
          method: 'DELETE'
          });
          if(response.ok){
              let data = await response.json();
              alert(data.mensaje);            
          }
     } catch(error){
         alert(error.message);       
     }   
     
     obtenerDatosYRenderizar();
}