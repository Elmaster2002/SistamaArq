let productos = [];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formProducto');
  const tabla = document.getElementById('tablaProductos');

  // Si hay un código QR escaneado, lo pone en el campo correspondiente
  if (localStorage.getItem('codigoQR')) {
    form.codigo.value = localStorage.getItem('codigoQR');
    localStorage.removeItem('codigoQR');
  }

  // Agregar producto al array y actualizar la tabla
  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    const nuevoProducto = {
      id: Date.now(), // ID único temporal
      nombre: data.nombre,
      codigo: data.codigo,
      precio: parseFloat(data.precio),
      cantidad: parseInt(data.cantidad),
    };

    productos.push(nuevoProducto);
    form.reset();
    cargarProductos();
  });

  // Mostrar productos en la tabla
  function cargarProductos() {
    tabla.innerHTML = `
      <tr>
        <th>Nombre</th>
        <th>Código</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Acciones</th>
      </tr>
    `;

    productos.forEach(p => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td><input value="${p.nombre}" onchange="editar(${p.id}, 'nombre', this.value)"></td>
        <td><input value="${p.codigo}" onchange="editar(${p.id}, 'codigo', this.value)"></td>
        <td><input value="${p.precio}" onchange="editar(${p.id}, 'precio', this.value)"></td>
        <td><input value="${p.cantidad}" onchange="editar(${p.id}, 'cantidad', this.value)"></td>
        <td><button onclick="eliminar(${p.id})">Eliminar</button></td>
      `;
      tabla.appendChild(fila);
    });
  }

  // Mostrar al inicio si hay algo (por ahora vacío)
  cargarProductos();
});

// Editar producto (local)
window.editar = (id, campo, valor) => {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  producto[campo] = campo === 'precio' || campo === 'cantidad' ? parseFloat(valor) : valor;
};

// Eliminar producto (local)
window.eliminar = id => {
  productos = productos.filter(p => p.id !== id);
  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = '';
  productos.length ? cargarProductos() : tabla.innerHTML = `
    <tr>
      <th>Nombre</th>
      <th>Código</th>
      <th>Precio</th>
      <th>Cantidad</th>
      <th>Acciones</th>
    </tr>
  `;
};
