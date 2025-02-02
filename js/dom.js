document.addEventListener("DOMContentLoaded", async () => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    fetchUserData(jwt).then(({ user, xpInKB, proDone,audits }) => {
      const newAudit = Math.ceil(user.auditRatio * 100) / 100;
      postData(user.id, user.login, newAudit, xpInKB, proDone,audits);
      // console.log("User Data:", user.id, user.login, newAudit, xpInKB,proDone);
    });
    await getSkills(jwt);
    await getCheckAttempts(jwt);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "index.html";
    });
  }
});

document.getElementById("attemptsBtn").addEventListener("click", function () {
  document.getElementById("attemptsChart").style.display = "block";
  document.getElementById("skillsChart").style.display = "none";
});

document.getElementById("skillsBtn").addEventListener("click", function () {
  document.getElementById("attemptsChart").style.display = "none";
  document.getElementById("skillsChart").style.display = "block";
});

function postData(id, login, ratio, xp, proDone,audits) {
  if (userID && userName && audRatio && xpd && proDone && audits) {
    userID.textContent = `ID: ${id}`;
    userName.textContent = `Username: ${login}`;
    audRatio.textContent = `Audit Ratio: ${ratio}`;
    xpd.textContent = `XP: ${xp}`;
    proD.textContent = `Submitted Projects: ${proDone}`;
    updateAudits(audits);
  }
}
