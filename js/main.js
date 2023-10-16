// Inicializamos el local storage
let productosSeleccionados =
	JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
let total = 0;
// Iniciamos el fetch a la api
fetch("https://zmszgmmzcdolvhbxrskm.supabase.co/rest/v1/untref?select=*", {
	headers: {
		apikey:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptc3pnbW16Y2RvbHZoYnhyc2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4OTI5NzAsImV4cCI6MjAwNTQ2ODk3MH0.KcTnLJ_4ODZJ-ccqwXPf-d5fO0D1vPIBgGlWrVng6vM",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptc3pnbW16Y2RvbHZoYnhyc2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4OTI5NzAsImV4cCI6MjAwNTQ2ODk3MH0.KcTnLJ_4ODZJ-ccqwXPf-d5fO0D1vPIBgGlWrVng6vM",
	},
})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		const listaProductos = data.map((producto) => {
			// Imprimimos la vista de la card con los botones
			return `


      <div class="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
		  <div class="card product-item text-center border h-250 p-4" style="width: 20rem;" data-id="${producto.id}" data-name="${producto.title}" data-price="${producto.price}">
			<img class="img-fluid mb-4" src="${producto.thumbnail}" alt="${producto.title}">
			<div class="card-body">
			  <h5 class="h6 d-inline-block mb-2">${producto.title}</h5>
			  <h3 class="text-primary mb-3">Precio: $${producto.price}</h3>
			 
			  <!-- Button trigger modal -->
<button type="button" class="btn btn-outline-primary add-to-cart m-2" data-bs-toggle="modal" data-bs-target="#exampleModal ">
  Agregar al Carrito
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Felicidades</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
       Agregaste un producto al carrito, a la derecha de tu pantalla verás los productos
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Seguir Comprando</button>
      
      </div>
    </div>
  </div>
</div>

			  
			  <!-- Button trigger modal -->
			  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal_${producto.id}">
				Ver detalles
			  </button>
			  <!-- Modal -->
			  <div class="modal fade" id="exampleModal_${producto.id}" tabindex="-1" aria-labelledby="exampleModalLabel_${producto.id}" aria-hidden="true">
				<div class="modal-dialog">
				  <div class="modal-content">
					<div class="modal-header">
					  <h1 class="modal-title fs-5" id="exampleModalLabel_${producto.id}">${producto.title}</h1>
					  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
					  ${producto.description}
					  <img src="${producto.thumbnail}" alt="${producto.title}" width="200">
					<br>

					  Precio: $${producto.price}
					</div>
					<div class="modal-footer">
					  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Cerrar</button>
					</div>				  </div>
									</div>
								  </div>
								</div>
							  </div>
							</div>
						  `;
		});
		//Imprimimos la vista de la card y las unimos
		document.getElementById(
			"productos"
		).innerHTML = `<div class="row">${listaProductos.join("")}</div>`;

		//selecciona todos los elementos con la clase "add-to-cart" y agrega un listener de evento de clic a cada uno
		const botonesAgregar = document.getElementsByClassName("add-to-cart");
		for (let i = 0; i < botonesAgregar.length; i++) {
			botonesAgregar[i].addEventListener("click", agregarProducto);
		}
		// declaramos las variables y asignamos los elementos con sus ids
		const listaCarrito = document.getElementById("carrito");
		const totalCarrito = document.getElementById("total-carrito");
		const opcionesPago = document.getElementById("opciones-pago");
		const precioCuotaElement = document.getElementById("precio-cuota");
		const totalConDescuentoElement = document.getElementById(
			"total-con-descuento"
		);

		//declaramos un array vacio para los productos
		let productosSeleccionados = [];

		//FUNCION AGREAGAR PRODUCTOS
		function agregarProducto(event) {
			event.preventDefault();
			const producto = event.target.closest(".card");
			const id = producto.getAttribute("data-id");
			const nombre = producto.getAttribute("data-name");
			const precio = parseFloat(producto.getAttribute("data-price"));

			const productoExistente = productosSeleccionados.find((p) => p.id === id);
			if (productoExistente) {
				productoExistente.cantidad += 1;
				productoExistente.subtotal =
					productoExistente.cantidad * productoExistente.precio;
			} else {
				productosSeleccionados.push({
					id,
					nombre,
					precio,
					cantidad: 1,
					subtotal: precio,
				});
			}

			actualizarCarrito();
			guardarProductosSeleccionados();
		}

		//funcion eliminar y actualizar el carrito
		function eliminarProducto(id) {
			productosSeleccionados = productosSeleccionados.filter(
				(producto) => producto.id !== id
			);
			actualizarCarrito();
			guardarProductosSeleccionados();
		}
		//funciones de descuento depende el metodo de pago
		function calcularTotalConDescuento(pagoSeleccionado) {
			let total = 0;
			productosSeleccionados.forEach((producto) => {
				total += producto.subtotal;
			});

			let totalConDescuento = total;
			if (
				pagoSeleccionado === "efectivo" ||
				pagoSeleccionado === "transferencia"
			) {
				totalConDescuento *= 0.9; // 10% de descuento
			} else if (pagoSeleccionado === "tarjeta") {
				totalConDescuento *= 1.2; // 120% del total original
				const precioCuota = totalConDescuento / 12;
				precioCuotaElement.textContent = `12 cuotas de $${precioCuota.toFixed(
					2
				)}`;
			} else {
				precioCuotaElement.textContent = "";
			}

			totalConDescuentoElement.textContent = `$${totalConDescuento.toFixed(2)}`;
		}
		//funcion del carrito
		function actualizarCarrito() {
			listaCarrito.innerHTML = "";
			let total = 0;

			productosSeleccionados.forEach((producto) => {
				const itemCarrito = document.createElement("li");
				itemCarrito.innerHTML = `
		<span>${producto.nombre}<br>  
		Precio Unitario: $${producto.precio} <br>
		x ${producto.cantidad}u  = $${producto.subtotal}</span>
		<button class="btn btn-danger btn-sm remove-from-cart">Eliminar</button>
	  `;

				const botonEliminar = itemCarrito.querySelector(".remove-from-cart");
				botonEliminar.addEventListener("click", () => {
					eliminarProducto(producto.id);
				});

				listaCarrito.appendChild(itemCarrito);

				total += producto.subtotal;
			});

			totalCarrito.textContent = `$${total.toFixed(2)}`;
			opcionesPago.innerHTML = `
	  <option value="efectivo">Efectivo 10% de descuento</option>
	  <option value="transferencia">Transferencia 10% de descuento</option>
	  <option value="tarjeta">Tarjeta de crédito 120% de interés</option>
	`;

			calcularTotalConDescuento(opcionesPago.value);
		}

		opcionesPago.addEventListener("change", () => {
			calcularTotalConDescuento(opcionesPago.value);
		});

		function guardarProductosSeleccionados() {
			localStorage.setItem(
				"productosSeleccionados",
				JSON.stringify(productosSeleccionados)
			);
		}

		//funcion que carga los datos guardados en el localstorage y actualiza el carrito

		function cargarProductosDesdeAlmacenamientoLocal() {
			const productosSeleccionadosString = localStorage.getItem(
				"productosSeleccionados"
			);
			if (productosSeleccionadosString) {
				productosSeleccionados = JSON.parse(productosSeleccionadosString);
				actualizarCarrito();
			}
		}

		cargarProductosDesdeAlmacenamientoLocal();
	});



 const finalizarBtn = document.getElementById('finalizar-btn');
 finalizarBtn.addEventListener('click', function() {
   // Simulación del proceso de pago
   simularPago()
	 .then(function() {
	   // Mostrar el mensaje de confirmación de compra
	   const mensaje = '¡Felicidades... Compra finalizada!, pronto te llegará un mail con los datos de la compra.';
	   const mensajeElement = document.getElementById('mensaje');
	   mensajeElement.textContent = mensaje;
	 })
	 .catch(function(error) {
	   // Mostrar el mensaje de error en caso de fallo en el pago
	   const mensajeElement = document.getElementById('mensaje');
	   mensajeElement.textContent = error;
	 });
 });
 
 function simularPago() {
   return new Promise(function(resolve, reject) {
	 setTimeout(function() {
	   const exito = Math.random() < 0.8; // 80% de probabilidad de éxito
 
	   if (exito) {
		 resolve();
	   } else {
		 reject('Lo sentimos, ha ocurrido un error en el pago. Por favor, inténtalo de nuevo.');
	   }
	 }, 3000); // Simulación de 3 segundos de tiempo de procesamiento
   });
 }

 (function () {
		"use strict";

		// Obtenemos todos los formularios a validar
		let forms = document.querySelectorAll(".needs-validation");

		// Iteramos sobre los formularios y prevenimos el envío si no son válidos
		Array.prototype.slice.call(forms).forEach(function (form) {
			form.addEventListener(
				"submit",
				function (event) {
					event.preventDefault(); // Prevenimos el envío del formulario

					if (!form.checkValidity()) {
						event.stopPropagation();
						form.classList.add("was-validated");
					} else {
						

						// Ejemplo: Mostrar un mensaje de éxito
						let mensajeElement = document.getElementById("mensaje");

						mensajeElement.classList.add("text-success");
					}
				},
				false
			);
		});
 })();