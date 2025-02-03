function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatGroupMembers(group) {
  if (!group || !group.members) return "";
  return group.members
    .map((m) =>
      m.userLogin === group.captainLogin
        ? `<span class="captain">${m.userLogin}</span>`
        : m.userLogin
    )
    .join(", ");
}

function updateAudits(audits) {
  const auditList = document.getElementById("auditList");
  auditList.innerHTML = "";

  audits.forEach((audit) => {
    const status = audit.grade >= 1 ? "Passed" : "False";
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <strong>Date:</strong> ${formatDate(audit.auditedAt)} |
        <strong>Group:</strong> ${formatGroupMembers(audit.group)} |
        <strong>Status:</strong> ${status}
      `;
    auditList.appendChild(listItem);
  });
}
