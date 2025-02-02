async function getSkills(jwt) {
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
          query: `query {
            transaction(
              where: {
                type: { _ilike: "%skill%" }
              }
            ) {
              type
              amount
              objectId
              object {
                name
              }
              createdAt
              path
            }
          }`,
        }),
      }
    );

    const data = await resp.json();
    const skills = createSkillsMap(data.data.transaction);
    console.log("Top Skills:", skills);
    // return skills;
    renderChart2(skills);
  } catch (error) {
    console.log("Error fetching skills:", error);
  }
}

function createSkillsMap(data) {
  const skillMap = data.reduce((acc, { type, amount }) => {
    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {});

  let sortedSkills = Object.entries(skillMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const total = sortedSkills.reduce((sum, [, value]) => sum + value, 0);
  let percentages = sortedSkills.map(([key, value]) => [
    key,
    (value / total) * 100,
  ]);

  let diff =
    100 -
    percentages.reduce((sum, [, percent]) => sum + Math.round(percent), 0);
  percentages[0][1] += diff;

  const topSkills = percentages.map(([key, percent]) => ({
    label: key.replace(/skill_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: Math.round(percent),
  }));

  return topSkills;
}

function renderChart2(data) {
  const ctx = document.getElementById("skillsChart").getContext("2d");

  const labels = data.map((item) => item.label);
  const values = data.map((item) => item.value);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Skills",
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
          text: "Top 5 Most Used Skills",
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
