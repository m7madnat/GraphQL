function renderXpChart(xps) {
  xps.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let totalXP = 0;
  const xpData = xps.map((d) => {
    totalXP += d.amount;
    return {
      timestamp: new Date(d.createdAt),
      totalXP: totalXP / 1000,
    };
  });

  const labels = xpData.map((d) =>
    new Intl.DateTimeFormat("en-GB").format(d.timestamp)
  );
  const dataPoints = xpData.map((d) => d.totalXP);

  const ctx = document.getElementById("xpChart").getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "XP",
          data: dataPoints,
          backgroundColor: "rgba(255, 208, 0, 0.5)",
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 1,
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 10,
          pointHoverRadius: 6,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "XP Progress Projects & Piscines",
          position: "top",
          font: {
            size: 18,
          },
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return `XP: ${context.raw.toFixed(0)}`;
            },
          },
        },
      },
    },
  });
}
