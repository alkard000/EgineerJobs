import { set } from "mongoose";

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    if(skills) {
        skills.addEventListener('click', agregarSkills);
        //Una vez en la Edicion ---------------->> LLamar la funcion
        skillsSeleccionados();
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