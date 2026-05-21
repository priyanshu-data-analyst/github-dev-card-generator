async function generateCard() {

    try {

        const username =
        document.getElementById("username").value.trim();

        if(!username){

            alert("Enter GitHub username");
            return;

        }

        const card =
        document.getElementById("card");

        card.innerHTML = `
            <h2 style="text-align:center;">
                Loading...
            </h2>
        `;

        // USER PROFILE
        const response =
        await fetch(`http://127.0.0.1:8000/github/${username}`);

        const data = await response.json();

        // REPOSITORIES
        const repoResponse =
        await fetch(`https://api.github.com/users/${username}/repos`);

        const repoData = await repoResponse.json();

        // ERROR CHECK
        if(data.error){

            card.innerHTML = `
                <h2 style="text-align:center;">
                    User Not Found
                </h2>
            `;

            return;
        }

        // LANGUAGE CALCULATION
        let languageCount = {};

        repoData.forEach(repo => {

            if(repo.language){

                if(languageCount[repo.language]){

                    languageCount[repo.language]++;

                }else{

                    languageCount[repo.language] = 1;

                }

            }

        });

        const totalLanguages =
        Object.values(languageCount)
        .reduce((a,b) => a+b,0);

        let languageHTML = "";

        Object.entries(languageCount)
        .sort((a,b) => b[1]-a[1])
        .slice(0,5)
        .forEach(([lang,count]) => {

            const percent =
            Math.round((count / totalLanguages) * 100);

            languageHTML += `

            <div class="language">

                <div class="language-top">

                    <span>${lang}</span>

                    <span>${percent}%</span>

                </div>

                <div class="progress">

                    <div style="width:${percent}%"></div>

                </div>

            </div>

            `;

        });

        // TOP REPOS
        let repoHTML = "";

        repoData
        .sort((a,b) =>
            b.stargazers_count - a.stargazers_count
        )
        .slice(0,5)
        .forEach(repo => {

            repoHTML += `

            <div class="repo-card">

                <a href="${repo.html_url}" target="_blank">

                    <i class="fa-solid fa-code-branch"></i>

                    ${repo.name}

                </a>

                <p>
                    ${repo.description || "No description"}
                </p>

                <p style="margin-top:10px;color:#58a6ff;">

                    <i class="fa-solid fa-star"></i>
                    ${repo.stargazers_count}

                    &nbsp;&nbsp;

                    <i class="fa-solid fa-code"></i>
                    ${repo.language || "Unknown"}

                </p>

            </div>

            `;

        });

        // FINAL CARD
        card.innerHTML = `

        <div class="card" id="downloadCard">

            <div class="profile-top">

                <img src="${data.avatar}" />

                <div class="profile-info">

                    <h2>
                        ${data.name || "No Name"}
                    </h2>

                    <p class="username">
                        @${data.username}
                    </p>

                    <p class="bio">
                        ${data.bio || "No bio available"}
                    </p>

                </div>

            </div>

            <div class="stats">

                <a 
                href="${data.profile_url}?tab=repositories"
                target="_blank"
                style="text-decoration:none;color:white;flex:1;"
                >

                    <div class="stat-box">

                        <h3>${data.public_repos}</h3>

                        <p>Repositories</p>

                    </div>

                </a>

                <a 
                href="${data.profile_url}?tab=followers"
                target="_blank"
                style="text-decoration:none;color:white;flex:1;"
                >

                    <div class="stat-box">

                        <h3>${data.followers}</h3>

                        <p>Followers</p>

                    </div>

                </a>

            </div>

            <div class="languages">

                <h3>
                    <i class="fa-solid fa-chart-simple"></i>
                    Languages Used
                </h3>

                ${languageHTML}

            </div>

            <div class="repo-section">

                <h3>
                    <i class="fa-solid fa-code"></i>
                    Top Projects
                </h3>

                ${repoHTML}

            </div>

            <div class="action-buttons">

                <a href="${data.profile_url}" target="_blank">

                    <i class="fa-brands fa-github"></i>
                    Profile

                </a>

                <button onclick="downloadCard()">

                    <i class="fa-solid fa-download"></i>
                    Download

                </button>

                <button onclick="shareProfile('${data.profile_url}')">

                    <i class="fa-solid fa-share-nodes"></i>
                    Share

                </button>

            </div>

        </div>

        `;

    } catch(error){

        console.log(error);

        document.getElementById("card").innerHTML = `
            <h2 style="text-align:center;">
                Backend Error
            </h2>
        `;

    }

}

// DOWNLOAD
function downloadCard(){

    const originalCard =
    document.getElementById("downloadCard");

    html2canvas(originalCard,{
        backgroundColor:"#111827",
        scale:4,
        useCORS:true
    }).then(canvas => {

        const link =
        document.createElement("a");

        link.download =
        "github-dev-card.png";

        link.href =
        canvas.toDataURL("image/png");

        link.click();

    });

}

// SHARE
function shareProfile(url){

    navigator.clipboard.writeText(url);

    alert("Profile link copied!");

}