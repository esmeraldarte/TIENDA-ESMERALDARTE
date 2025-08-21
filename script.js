const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFNMh-dYZq0tHZHBGwyxZG8_gEj8rn4S6n2zrZGwZR_DomeelB14P_sxtV_i09vKu_CkLA05Hn1lJ-/pub?gid=0&single=true&output=csv";
let productos = [];
let carrito = [];

// Cargar productos desde Google Sheets
fetch(url)
  .then(res => res.text())
  .then(data => {
    const filas = data.split("\n").map(f => f.split(","));
    const headers = filas[0];
    productos = filas.slice(1).map(fila => {
      let obj = {};
      headers.forEach((h, i) => obj[h.trim()] = fila[i]);
      return obj;
    });
    mostrarProductos(productos);
  });

function mostrarProductos(lista) {
  const cont = document.getElementById("productos");
  cont.innerHTML = "";
  lista.forEach(p => {
    cont.innerHTML += `
      <div class="producto">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.codigo}</p>
        <p>Precio: $${p.precio}</p>
        <button onclick='agregarCarrito(${JSON.stringify(p)})'>Agregar al carrito</button>
      </div>`;
  });
}

function filtrarCategoria(cat) {
  mostrarProductos(productos.filter(p => p.categoria === cat));
}

function agregarCarrito(prod) {
  carrito.push(prod);
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  let subtotal = 0;
  carrito.forEach((p, i) => {
    subtotal += parseFloat(p.precio);
    lista.innerHTML += `<li>${p.nombre} - $${p.precio} <button onclick="eliminar(${i})">❌</button></li>`;
  });
  document.getElementById("subtotal").innerText = "Subtotal: $" + subtotal;
  document.getElementById("envio").innerText = "Envío: $0";
  document.getElementById("total").innerText = "Total: $" + subtotal;
}

function eliminar(i) {
  carrito.splice(i, 1);
  renderCarrito();
}

document.getElementById("carritoBtn").addEventListener("click", () => {
  document.getElementById("carrito").classList.toggle("oculto");
});