window.addEventListener('load', () => {
    // referencia del DOM
    const formCrear = document.getElementById('form-crear')
    const listaTareas = document.getElementById('lista-tareas')
    const inputCrear = document.getElementById('crear')
    const inputBuscar = document.getElementById('buscar')

    // inicializadores
    let articulos = [];
    let proximoIdDisponible = 0

    // llamado de carga
    cargarArticulosDesdeLocalStorage();

    function agregarItemTabla(valor) {
        const nuevoArticulo = {
            id: proximoIdDisponible,
            nombre: valor
        }
        articulos.push(nuevoArticulo)
        guardarArticulosEnLocalStorage()
        proximoIdDisponible++
    }
    function eliminarItemTabla(id) {
        articulos = articulos.filter(item => item.id !== id)
        guardarArticulosEnLocalStorage()
    }
    function guardarArticulosEnLocalStorage() {
        localStorage.setItem('ListaToDo', JSON.stringify(articulos))
    }
    function cargarArticulosDesdeLocalStorage() {
        // recuperamos los valores del localstorage
        const storedArticulos = localStorage.getItem('ListaToDo')
        listaTareas.innerHTML = ""
        if (storedArticulos) {
            articulos = JSON.parse(storedArticulos)
            articulos.forEach(articulo => {
                let nombre = articulo.nombre;
                listaTareas.innerHTML += nombre
            })
            if (articulos.length > 0) {
                proximoIdDisponible = Math.max(...articulos.map(item => item.id)) + 1
            } else {
                proximoIdDisponible = 1
            }
        }
    }
    // procedimiento para alta
    formCrear.addEventListener('submit', (e) => {
        e.preventDefault()
        capturarValor()
    })
    const capturarValor = () => {
        const tareaNombre = inputCrear.value.trim();
        (tareaNombre.length) ? mostrarTareaHtml(tareaNombre) : alert('Debe de ingresar un dato')
        inputCrear.value = ""
        inputCrear.focus()
    }
    const mostrarTareaHtml = (tarea) => {
        const liHtml =
            `<li id="${proximoIdDisponible}">
            <strong>${tarea}</strong>
            <i class="fa-solid fa-circle-minus borrar"></i>
        </li>`
        console.log(`Esta es la tarea ${tarea}`)
        agregarItemTabla(liHtml)
        listaTareas.innerHTML += liHtml
    }
    // procedimiento de busqueda
    inputBuscar.addEventListener('keyup', (e) => {
        const caracter = inputBuscar.value.trim()
        busqueda(caracter)
    })
    const busqueda = (cadena) => {
        let arreglo = Array.from(listaTareas.children)
        let contador = 0
        arreglo
            .filter(texto => !texto.textContent.toLocaleLowerCase().includes(cadena))
            .forEach(cadenaFiltrada => {
                cadenaFiltrada.classList.add('textoFiltrado')
            })
        arreglo
            .filter(texto => texto.textContent.toLocaleLowerCase().includes(cadena))
            .forEach(cadenaFiltrada => {
                cadenaFiltrada.classList.remove('textoFiltrado')
            })

    }

    // procedimiento para borrar
    listaTareas.addEventListener('click', (e) => {
        if (e.target.classList.contains('borrar')) {
            var elemento = e.target.parentElement
            var id = parseInt(e.target.parentElement.id)
            elemento.remove()
            eliminarItemTabla(id)
        }
        // inputBuscar.value = ""
        cargarArticulosDesdeLocalStorage()
        busqueda(inputBuscar.value.trim())
    })
})