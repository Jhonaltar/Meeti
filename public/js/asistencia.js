import axios from 'axios';

document.addEventListener('DOMContentLoaded', ()=>{
    const asistencia = document.querySelector('#confirmar-asistencia');
    if (asistencia) {
        asistencia.addEventListener('submit', confirmarAsistencia)
    }
});

function confirmarAsistencia(e) {
    e.preventDefault();

    const btn = document.querySelector('#confirmar-asistencia input[type="submit"]');
    let accion = document.querySelector('#accion').value;

    const datos= {
        accion
    }

    axios.post(this.action, datos)
    .then(respuesta =>{
        console.log(respuesta);
        if (accion === 'confirmar') {
            document.querySelector('#accion').value ='cancelar';
            btn.value = 'Cancelar Asistencia',
            btn.classList.remove('btn-outline-primary'),
            btn.classList.add('btn-outline-danger');
            $.toast({
                type: 'success',
                title: 'Aviso importante!',
                content: respuesta.data,
                delay: 5000
              });
        }else{
            document.querySelector('#accion').value ='confirmar';
            btn.value = ' + Asistir al evento',
            btn.classList.remove('btn-outline-danger'),
            btn.classList.add('btn-outline-primary')
            $.toast({
                type: 'error',
                title: 'Aviso importante!',
                content: respuesta.data,
                delay: 5000
              });
        }
    })
}