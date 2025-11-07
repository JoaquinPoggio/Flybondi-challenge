let dataset = [];

// Cargar el archivo JSON con los vuelos
fetch("dataset.json")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    dataset = data;
    mostrarOrígenes();
  })
  .catch(function (error) {
    console.error("No se pudo cargar dataset.json", error);
    // Si no existe el JSON, usa algunos datos de prueba
    dataset = [
      {
        date: "2025-08-15",
        origin: "COR",
        destination: "MDZ",
        price: 474.05,
        availability: 9,
      },
      {
        date: "2025-08-14",
        origin: "COR",
        destination: "BRC",
        price: 197.68,
        availability: 2,
      },
      {
        date: "2025-08-15",
        origin: "EPA",
        destination: "BRC",
        price: 300.3,
        availability: 1,
      },
    ];
    mostrarOrígenes();
  });

// Mostrar los origenes unicos
function mostrarOrígenes() {
  const selectOrigen = document.getElementById("origin");
  selectOrigen.innerHTML = "<option value=''>Seleccioná origen</option>";

  // sacar los origenes
  const origenes = [];
  for (let i = 0; i < dataset.length; i++) {
    if (!origenes.includes(dataset[i].origin)) {
      origenes.push(dataset[i].origin);
    }
  }

  // agregar cada origen
  for (let i = 0; i < origenes.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = origenes[i];
    opcion.textContent = origenes[i];
    selectOrigen.appendChild(opcion);
  }
}

// busca vuelos dentro del presupuesto
function buscarVuelos() {
  const origen = document.getElementById("origin").value;
  const presupuesto = parseFloat(document.getElementById("budget").value) || 0;
  const resultados = document.getElementById("results");
  resultados.innerHTML = "";

  if (!origen) {
    resultados.textContent = "Por favor seleccioná un origen";
    return;
  }

  // filtra los vuelos por origen y presupuesto
  const vuelos = dataset.filter(function (v) {
    return v.origin === origen && v.price * 2 <= presupuesto;
  });

  if (vuelos.length === 0) {
    resultados.textContent =
      "No se encontraron vuelos dentro de tu presupuesto";
    return;
  }

  // mostrar los vuelos encontrados
  for (let i = 0; i < vuelos.length; i++) {
    const vuelo = vuelos[i];
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML =
      "<h4>" +
      vuelo.origin +
      " → " +
      vuelo.destination +
      "</h4>" +
      "<p>Precio ida y vuelta: $" +
      (vuelo.price * 2).toFixed(2) +
      "</p>" +
      "<p>Disponibilidad: " +
      vuelo.availability +
      "</p>" +
      "<p>Fecha: " +
      new Date(vuelo.date).toLocaleDateString() +
      "</p>";
    resultados.appendChild(div);
  }
}

document.getElementById("searchBtn").addEventListener("click", buscarVuelos);
document.getElementById("budget").addEventListener("input", buscarVuelos);
document.getElementById("origin").addEventListener("change", buscarVuelos);

document.getElementById("origin").addEventListener("change", search);
document.getElementById("budget").addEventListener("input", search);
document.getElementById("searchBtn").addEventListener("click", search);


