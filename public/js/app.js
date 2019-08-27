import axios from 'axios';
import Swal from 'sweetalert2';
import { set } from "mongoose";

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    //------------LIMPIAR alertas---------------//
    let alertas = document.querySelector('.alertas');

    if(alertas) {
        limpiarAlertas();
    }
    //----------------------------------------//
    if(skills) {
        skills.addEventListener('click', agregarSkills);
        //Una vez en la Edicion ---------------->> LLamar la funcion
        skillsSeleccionados();
    }
    //Alerta eliminacion VACANTE
    const vacantesListado = document.querySelector('.panel-administracion');
    if(vacantesListado ) {
        vacantesListado.addEventListener('click', accionesListado);
    }
})
const skills = new Set();
const agregarSkills = e => {
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            //Quitar set y clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo'); 
        }else{
            //Agregar se y clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');        
        }
    }
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo')); //--------->> Convertir el NODEarray a un Array
    //Seleccionar el TEXTO
    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    });
    //Inyectar en el HIDDEN
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray;   
}
//Eliminar las Alertas cada 2 segundos
const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if(alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if(alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);
}
//Eliminar Vacantes
const accionesListado =  e => {
    e.preventDefault();

    if(e.target.dataset.eliminar){
        //Eliminar por Medio de AXIOS
        Swal.fire({
            title: 'Estas Seguro?',
            text: "Si eliminas una vacante no se volvera a recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText : 'No, Cancelar'
          }).then((result) => {
            if (result.value) {
                //Enviar peticion a AXIOS
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                //Usar AXIOS
                axios.delete(url, { params : { url } })
                    .then(function(respuesta){
                        if(respuesta === 200) {
                            Swal.fire(
                                'Eliminado',
                                 respuesta.data,
                                'success'
                            );
                            e.target.parentElement.parentElement.parentElement.
                                removeChild(e.target.parentElement.parentElement);
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            type : 'error',
                            title : 'Hubo un error inesperado',
                            text : 'Acceso no permitido'
                        })
                    })

            }
          })
    } else if(e.target.tagName === 'A'){
        window.location.href = e.target.href;
    }
}