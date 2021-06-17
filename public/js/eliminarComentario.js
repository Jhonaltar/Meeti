import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded',()=>{
    const formsEliminar = document.querySelectorAll('.eliminar-comentario');

    /* revisar que existan los formulario */
    if (formsEliminar.length > 0) {
        formsEliminar.forEach(form =>{
            form.addEventListener('submit', eliminarComentario);
        })
    }
});

function eliminarComentario(e) {
    e.preventDefault();

    Swal.fire({
        title: 'Eliminar comentario?',
        text: "Un comentario eliminado no se puede recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si eliminar!',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

        //tomar el id del comentario
        const comentarioId = this.children[0].value;
        //crear el objeto
        const datos = {
            comentarioId
        }
        axios.post(this.action,datos)
        .then(respuesta =>{
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: respuesta.data,
                showConfirmButton: false,
                timer: 1500
              });
              this.parentElement.parentElement.remove();
        }).catch(error =>{
            if (error.response.status === 403 || error.response.status === 404) {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: error.response.data,
                    showConfirmButton: false,
                    timer: 1500
                  });
            }
            })
        }
      })

    
}