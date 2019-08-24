import { set } from "mongoose";

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    if(skills) {
        skills.addEventListener('click', agregarSkills);
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