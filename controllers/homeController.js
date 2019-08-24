exports.mostarTrabajos = (req, res) => {
    res.render('home', {
        nombrePagina : 'EngineerJobs',
        tagline : 'Un sitio donde puedes encontrar y publicar trabajos para Ingenieros',
        barra : true,
        boton : true
    })
}