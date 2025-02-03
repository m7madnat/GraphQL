async function getCheckAttempts(jwt) {
  try {
    const resp = await fetch(
      "https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: ` query {	
                          progress(
                            where: {object: {type: {_eq: "exercise"}}, path: {_ilike: "%checkpoint%"}}
                          ) {
                            object {
                              name
                            }
                            path
                          }
              }`,
        }),
      }
    );

    const data = await resp.json();
    const dataAtt = createAtempttsMap(data.data);
    console.log(dataAtt);
    renderChart(dataAtt);
  } catch (error) {
    console.log("Error fetching attempts:", error);
  }
}

function createAtempttsMap(data) {
  const names = data.progress.map((item) => item.object.name);

  const nameCounts = names.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const topNames = Object.entries(nameCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return Object.fromEntries(topNames);
}

function renderChart(data) {
  const ctx = document.getElementById("attemptsChart").getContext("2d");

  const labels = Object.keys(data);
  const values = Object.values(data);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Attempts",
          data: values,
          backgroundColor: "rgba(255, 208, 0, 0.5)",
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Top 10 Most Attempted Checkpoints",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
