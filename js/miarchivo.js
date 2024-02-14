let saldo = 10000;
let carrito = [];

window.onload = function() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            console.log(data); 
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
};

function agregarAlCarrito(producto, precio) {
    carrito.push({ producto, precio });
    mostrarMensaje(`"${producto}" ha sido añadido al carrito.`);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    swal({
        title: "Listo!",
        text: `El producto "${producto}" ha sido añadido al carrito`,
        type: "success",
        button: "Aceptar"
    });

    actualizarCarrito();
}

function comprarDesdeCarrito() {
    const resultadoDiv = document.getElementById('resultado');

    if (carrito.length === 0) {
        mostrarMensaje(resultadoDiv, "El carrito está vacío. Añade productos antes de comprar.");
        return; 
    }

    let totalCarrito = carrito.reduce((total, item) => total + item.precio, 0);

    if (saldo >= totalCarrito) {
        saldo -= totalCarrito;
        carrito = [];
        localStorage.removeItem('carrito');
        swal({
            title: "Listo!",
            text: "Los productos de tu carrito han sido comprados!",
            type: "success",
            confirmButtonText: "Aceptar"
        });
        actualizarSaldo();
        actualizarCarrito();
    } else {
        swal({
            title: "Ups!",
            text: `No tienes saldo suficiente para comprar todos los productos del carrito. Tu saldo actual: $${saldo} pesos.`,
            type: "error",
            confirmButtonText: "Aceptar"
        });
    }
}

function mostrarMensaje(contenedor, mensaje) {
    console.log(mensaje);
    contenedor.innerHTML = mensaje;
}



function actualizarCarrito() {
    const productosCarritoDiv = document.getElementById('productosCarrito');

    productosCarritoDiv.innerHTML = '';

    fetch('./productos.json')
        .then(response => response.json())
        .then(data => {
            const cantidadProductos = data[0].cantidad;
            const productosOfrecidos = data[0].productos.split(', ');

            const mensajeOfrecerProductos = document.createElement('p');
            mensajeOfrecerProductos.textContent = `¿Has terminado? Podemos ofrecerte ${cantidadProductos} productos que actualmente tenemos en stock:`;
            productosCarritoDiv.appendChild(mensajeOfrecerProductos);

            const listaProductosOfrecidos = document.createElement('ul');
            productosOfrecidos.forEach(producto => {
                const listItemOfrecido = document.createElement('li');
                listItemOfrecido.textContent = producto;
                listaProductosOfrecidos.appendChild(listItemOfrecido);
            });
            productosCarritoDiv.appendChild(listaProductosOfrecidos);
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });

    if (carrito.length === 0) {
        productosCarritoDiv.innerHTML += '<p>El carrito está vacío</p>';
    } else {
        const listaProductos = document.createElement('ul');

        carrito.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.producto} - $${item.precio}`;
            listaProductos.appendChild(listItem);
        });
        productosCarritoDiv.appendChild(listaProductos);
    }
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarCarrito();
}



function actualizarSaldo() {
    const saldoNumero = document.getElementById('saldoNumero');
    saldoNumero.textContent = saldo;
}
