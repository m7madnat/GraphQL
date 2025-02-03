const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", loginPage);
}

const userID = document.getElementById("userID");
const userName = document.getElementById("username");
const audRatio = document.getElementById("audRatio");
const xpd = document.getElementById("xPd");
const proD = document.getElementById("proDone");

async function loginPage(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const cred = btoa(`${username}:${password}`);

  try {
    const response = await fetch(
      "https://adam-jerusalem.nd.edu/api/auth/signin",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${cred}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const jwt = await response.json();
      localStorage.setItem("jwt", jwt);
      console.log("JWT Token:", jwt);

      await fetchUserData(jwt);
      window.location.href = `home.html`;
    } else {
      const errors = await response.json();
      console.error("auth faild", errors);
    }
  } catch (error) {
    console.error("bad req", error);
  }
}

async function fetchUserData(jwt) {
  try {
    const userResponse = await fetch(
      "https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              user {
                id
                login
                auditRatio
                 transactions(where: {type:{ _eq: "xp"}}){
                          amount
                          path
                          createdAt
                        }
                 xps {
                path
                amount
                  }
                  audits(where:{auditedAt:{_is_null: false}}) {
                            id, auditedAt, grade, group { captainLogin, members { userLogin }}
                 }
                }     
               progress_aggregate(
                distinct_on: [objectId]
                where: {isDone: {_eq: true}, object: {type: {_eq: "project"}}}
              ) {
                aggregate {
                  count
                }
              }        
            }
          `,
        }),
      }
    );

    if (userResponse.ok) {
      const userdata = await userResponse.json();
      const user = userdata.data.user[0];
      const xpView = userdata.data.user[0].xps;
      const proDone = userdata.data.progress_aggregate.aggregate.count;
      const audits = userdata.data.user[0].audits;
      const xpProgress = userdata.data.user[0].transactions;
      renderXpChart(xpProgress);
      
      const modu = /module(?!\/piscine)/i;
      const totalXp = xpView
        .filter((xp) => modu.test(xp.path))
        .reduce((sum, xp) => sum + xp.amount, 0);
      const xpInKB = ((totalXp + 70000) / 1000).toFixed(0);

      console.log("User:", user);
      // console.log("Audits:", audits);

      return { user, xpInKB, proDone, audits };
    } else {
      const errors = await userResponse.json();
      console.error("fail to fetch user data:", errors);
    }
  } catch (error) {
    console.error("bad req ", error);
  }
}
