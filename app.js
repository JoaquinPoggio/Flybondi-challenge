let dataset = [];

//cargar el archivo dataset.json
fetch("dataset.json")
  .then((res) => res.json())
  .then((data) => {
    dataset = data;
    console.log("Datos cargados:", dataset);
  })
  .catch((err) => {
    console.warn("No se pudo cargar dataset.json. Se usan datos de ejemplo.");
    //por si no carga el json
    dataset = [
      {
        date: "2025-08-15T00:02:00.000Z",
        origin: "COR",
        destination: "MDZ",
        price: 474.05,
        availability: 9,
      },
      {
        date: "2025-08-14T23:33:00.000Z",
        origin: "COR",
        destination: "BRC",
        price: 197.68,
        availability: 2,
      },
      {
        date: "2025-08-15T13:51:00.000Z",
        origin: "EPA",
        destination: "BRC",
        price: 300.3,
        availability: 1,
      },
    ];
  });

// Muestra los vuelos según lo que el usuario elija
function search() {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const budget = parseFloat(document.getElementById("budget").value) || 0;
  const sortBy = document.getElementById("sort").value;
  const groupBy = document.getElementById("groupBy").value;
  const results = document.getElementById("results");

  results.innerHTML = "";

  // Filtrar vuelos origen, destino y presupuesto
  let flights = dataset.filter((f) => {
    const matchesOrigin = !origin || f.origin === origin;
    const matchesDestination = !destination || f.destination === destination;
    const withinBudget = f.price * 2 <= budget;
    return matchesOrigin && matchesDestination && withinBudget;
  });

  if (flights.length === 0) {
    results.textContent =
      "No se encontraron vuelos dentro de tu presupuesto 😢";
    return;
  }

  // Ordenar
  flights.sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "availability") return b.availability - a.availability;
  });

  if (groupBy === "none") {
    flights.forEach((f) => results.appendChild(createFlightCard(f)));
  } else {
    const groups = {};

    flights.forEach((f) => {
      const key =
        groupBy === "date" ? new Date(f.date).toLocaleDateString() : f[groupBy];
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });

    // Mostrar cada grupo
    for (const key in groups) {
      const title = document.createElement("h3");
      title.textContent = key;
      results.appendChild(title);

      groups[key].forEach((f) => results.appendChild(createFlightCard(f)));
    }
  }
}

//tarjeta visual para cada vuelo
function createFlightCard(flight) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h4>${flight.origin} → ${flight.destination}</h4>
    <p>Precio ida y vuelta: <strong>$${(flight.price * 2).toFixed(
      2
    )}</strong></p>
    <p>Disponibilidad: ${flight.availability}</p>
    <p>Fecha: ${new Date(flight.date).toLocaleDateString()}</p>
  `;
  return card;
}

document.getElementById("searchBtn").addEventListener("click", search);
document.getElementById("sort").addEventListener("change", search);
document.getElementById("groupBy").addEventListener("change", search);



