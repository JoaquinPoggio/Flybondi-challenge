let dataset = [];

fetch("dataset.json")
  .then((res) => res.json())
  .then((js) => {
    dataset = js;
    populateOrigins();
    search();
  })
  .catch((err) => {
    console.error(
      "No se pudo cargar dataset.json. Usando datos de prueba.",
      err
    );
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
    populateOrigins();
    search();
  });

function populateOrigins() {
  const originSelect = document.getElementById("origin");
  originSelect.innerHTML = '<option value="">Seleccioná origen</option>';
  const uniqueOrigins = [...new Set(dataset.map((f) => f.origin))];
  uniqueOrigins.forEach((origin) => {
    const opt = document.createElement("option");
    opt.value = origin;
    opt.textContent = origin;
    originSelect.appendChild(opt);
  });

  if (uniqueOrigins.length > 0) originSelect.value = uniqueOrigins[0];
}

function createFlightCard(flight, isBest = false) {
  const card = document.createElement("div");
  card.className = "card";
  if (isBest) card.classList.add("best");
  card.innerHTML = `
    <h4>${flight.origin} → ${flight.destination}</h4>
    <p>Precio ida y vuelta: $${(flight.price * 2).toFixed(2)}</p>
    <p>Disponibilidad: ${flight.availability}</p>
    <p>Fecha: ${new Date(flight.date).toLocaleDateString()}</p>
  `;
  return card;
}

function search() {
  const origin = document.getElementById("origin").value;
  const budget = parseFloat(document.getElementById("budget").value) || 0;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!origin) {
    resultsDiv.textContent = "Por favor seleccioná origen";
    return;
  }

  let flights = dataset.filter(
    (f) => f.origin === origin && f.price * 2 <= budget
  );
  if (flights.length === 0) {
    resultsDiv.textContent =
      "No se encontraron vuelos dentro de tu presupuesto 😢";
    return;
  }

  const bestFlight = flights.reduce((prev, curr) => {
    if (curr.price < prev.price && curr.availability > 0) return curr;
    return prev;
  }, flights[0]);

  const sortBy = document.getElementById("sort")?.value || "price";
  const groupBy = document.getElementById("groupBy")?.value || "none";

  flights.sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "availability") return b.availability - a.availability;
    return 0;
  });

  if (groupBy === "none") {
    flights.forEach((f) =>
      resultsDiv.appendChild(createFlightCard(f, f === bestFlight))
    );
  } else {
    const groups = {};
    flights.forEach((f) => {
      let key;
      if (groupBy === "date") {
        key = new Date(f.date).toISOString().split("T")[0];
      } else {
        key = f[groupBy];
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });

    let keys = Object.keys(groups);
    if (groupBy === "date") {
      keys.sort((a, b) => new Date(a) - new Date(b));
    } else {
      keys.sort();
    }

    keys.forEach((key) => {
      const groupTitle = document.createElement("h3");
      groupTitle.textContent =
        groupBy === "date" ? new Date(key).toLocaleDateString() : key;
      resultsDiv.appendChild(groupTitle);
      groups[key].forEach((f) =>
        resultsDiv.appendChild(createFlightCard(f, f === bestFlight))
      );
    });
  }
}

document.getElementById("origin").addEventListener("change", search);
document.getElementById("budget").addEventListener("input", search);
document.getElementById("searchBtn").addEventListener("click", search);
