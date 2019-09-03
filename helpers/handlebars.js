var Handlebars = require('handlebars');
var paginate = require('handlebars-paginate');

Handlebars.registerHelper('paginate', paginate);

module.exports = {
    seleccionarSkills : (seleccionadas = [], opciones) => {
        const skills = ['AutoCAD', 'Vulcan', 'Datamine', 'MatLab', 
                        'Excel Avanzado', 'Excel Intermedio', 'Base de Datos', 'BIM', 
                        'SAP', 'EViews', 'CivilCAD', 'MicroStation', 
                        'Revit', 'Microsoft Office Poryect', 'Primavera', 'Proyect Kick Start', 
                        'Smarta', 'Kanal++', 'Python', 'QE Pro', 
                        'HDM', 'AutoPlotter', 'Plaxis', 'SQL', 
                        'Geo', 'SAP 2000', 'HDM'];

        let html = '';
        skills.forEach(skills => {
            html += `
                <li ${seleccionadas.includes(skills) ? ' class="activo" ' : ''}>${skills}</li>
            `;
        });//-------->Funcion que marca las skills iniciales como default
        return opciones.fn().html = html;
    }, 
    tipoContrato : (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(` value="${seleccionado}" `), '$& selected="selected" '
        )
    },//-------->Funcion que marca el contrato inicial como default
    mostrarAlertas : (errores = {}, alertas) => {
        const categoria = Object.keys(errores);
        //console.log(categoria);

        let html = '';
        if(categoria.length){
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta">
                    ${error}
                </div>`;
            })
        }
        return alertas.fn().html = html;
    }
}
