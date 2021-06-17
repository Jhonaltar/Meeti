import { OpenStreetMapProvider } from 'leaflet-geosearch'; 
import asistencia from './asistencia';
import eliminarComentario from './eliminarComentario';
//obtener valores de la base de datos

const lat= document.querySelector('#lat').value || -2.131331438340233;
const lng= document.querySelector('#lng').value || -79.60297255820848;
const direccion = document.querySelector('#direccion').value || 'Avenida Rafael Valdez';
const map = L.map('map').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map)
let marker;
const geocodeService = L.esri.Geocoding.geocodeService();
//colocar el ping en edicion

if (lat && lng) {
      //agregar el pin
      marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(map)
    .bindPopup(direccion)
    .openPopup()

    //asignar contenerdor
    markers.addLayer(marker);

     //detectar movimiento del marker
     marker.on('moveend', function (e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        map.panTo(new L.LatLng(posicion.lat, posicion.lng));

         // reverse geocoding, cuando el usuario reubica el pin
         geocodeService.reverse().latlng(posicion, 15 ).run(function(error, result) {
             console.log(result);

             llenarInputs(result);
        
            // asigna los valores al popup del marker
            marker.bindPopup(result.address.LongLabel);

        });
    })
}


$(document).on("ready", function () {
        // INITIALIZATION OF LEAFLET
        // =======================================================
        setTimeout(() => {
            map.invalidateSize();
        }, 1000);
        $("#map").each(function () {
    
            L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
            ).addTo(map);
    
            //buscar direccion
            const buscador = document.querySelector('#formbuscador');
            buscador.addEventListener('input', buscarDireccion)
    
        });
});    

function buscarDireccion(e) {
    if (e.target.value.length > 6) {
        // si existe un pin anterior limpiarlo
        markers.clearLayers();

        // utilizar el provider y geocoder
       
        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value }).then(( resultado ) => {

            geocodeService.reverse().latlng(resultado[0].bounds[0], 15 ).run(function(error, result) {
                llenarInputs(result);

                 //mostrar el mapa
                map.setView(resultado[0].bounds[0],15);
                    //agregar el pin
                marker = new L.marker(resultado[0].bounds[0], {
                    draggable: true,
                    autoPan: true
                })
                .addTo(map)
                .bindPopup(resultado[0].label)
                .openPopup()

                //asignar contenerdor
                markers.addLayer(marker)

                //detectar movimiento del marker
                marker.on('moveend', function (e) {
                    marker = e.target;
                    const posicion = marker.getLatLng();
                    map.panTo(new L.LatLng(posicion.lat, posicion.lng));

                     // reverse geocoding, cuando el usuario reubica el pin
                     geocodeService.reverse().latlng(posicion, 15 ).run(function(error, result) {
                         console.log(result);

                         llenarInputs(result);
                    
                        // asigna los valores al popup del marker
                        marker.bindPopup(result.address.LongLabel);

                    });
                })
            })
        })
    }
}

function llenarInputs(resultado) {
    document.querySelector('#direccion').value = resultado.address.Address || '';
    document.querySelector('#ciudad').value = resultado.address.City || '';
    document.querySelector('#estado').value = resultado.address.Region || '';
    document.querySelector('#pais').value = resultado.address.CountryCode || '';
    document.querySelector('#lat').value = resultado.latlng.lat || '';
    document.querySelector('#lng').value = resultado.latlng.lng || '';
}


/* document.getElementById('btnModal').onclick = function () {
        $('#btnModal').prop("enable", true);
        $("#demo").html(
            `<div class="spinner-grow text-primary" role="status">
            <span class="sr-only">Loading...</span>
            </div>`
          )
       setTimeout(() => $("#demo").remove(), 3000);
       $("#demo").html(
        `<p>pppp</p>`
      )
} */

/* function cargar() {
    document.getElementById('btnModal').onclick = function () {
        console.log('sss');
        $('#btnModal').prop("disabled", true);
        $("#id").html(
            `<div class="spinner-grow text-primary" role="status">
            <span class="sr-only">Loading...</span>
            </div>`
          )
       setTimeout(() => $("#id").remove(), 3000);
       $("#map").html(
        `<div id="map" class="min-h-450rem rounded" style="height: 400px; "></div>`
      )
}
    
} */

/* $(document).ready(function() {    
    $('#btnModal').on('click', function(){
        //Añadimos la imagen de carga en el contenedor
        $('#contener').html('<div class="spinner-grow" role="status"></div><h1>Cargando mapa...</h1>');
        
        setTimeout(() => {
            $('#contener').fadeIn(1000).html(`<div id="map" class="min-h-450rem rounded" style="height: 400px; "></div>`);

        }, 3000);
        
        return false;
    });              
});  */   