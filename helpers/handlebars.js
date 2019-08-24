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
                <li>${skills}</li>
            `;
        });
        return opciones.fn().html = html;
    }
}