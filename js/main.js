let userInputWrd = document.querySelector("#serach-box"); // keep ID as in your HTML
let serachBtn = document.querySelector(".search-btn");
let wrodTitle = document.querySelector(".wrd-defination-title");
let phonetic = document.querySelector(".phonetic");
let audioIcon = document.querySelector("#audio-Play");
let audioPlayer = document.getElementById("audio-player");
let audioSource = document.getElementById("audio-source");
let heartIcon = document.querySelector("#heart-icon");

async function getDistionary() {
  let word = userInputWrd.value.trim();
  if (!word) {
    alert("Please type a word...");
    return;
  }

  try {
    const URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Word not found");
    }

    let data = await response.json();
    if (!data || !data.length) {
      alert("No definition found for this word.");
      return;
    }

    // Display main word and phonetic
    wrodTitle.textContent = data[0].word || "";
    phonetic.textContent = data[0].phonetic || "";

    // ==========================
    // DEFINITIONS
    // ==========================
    let definitionDiv = document.querySelector("#definition");
    definitionDiv.innerHTML = "";
    data[0].meanings.forEach((meaning) => {
      meaning.definitions.forEach((def, index) => {
        let p = document.createElement("p");
        p.textContent = `${index + 1}. (${meaning.partOfSpeech}) ${def.definition}`;
        definitionDiv.appendChild(p);
      });
    });

    // ==========================
    // EXAMPLES
    // ==========================
    let exampleDiv = document.querySelector("#example");
    exampleDiv.innerHTML = "";
    let exampleCount = 0;
    data[0].meanings.forEach((meaning) => {
      meaning.definitions.forEach((def) => {
        if (def.example) {
          exampleCount++;
          let p = document.createElement("p");
          p.textContent = `${exampleCount}. ${def.example}`;
          exampleDiv.appendChild(p);
        }
      });
    });
    if (exampleCount === 0) {
      exampleDiv.innerHTML = "<p>No examples found.</p>";
    }

    // ==========================
    // SYNONYMS & ANTONYMS
    // ==========================
    let synantDiv = document.querySelector("#synant");
    synantDiv.innerHTML = "";

    let synonyms = [];
    let antonyms = [];
    data[0].meanings.forEach((meaning) => {
      if (meaning.synonyms) synonyms.push(...meaning.synonyms);
      if (meaning.antonyms) antonyms.push(...meaning.antonyms);
      meaning.definitions.forEach((def) => {
        if (def.synonyms) synonyms.push(...def.synonyms);
        if (def.antonyms) antonyms.push(...def.antonyms);
      });
    });

    synonyms = [...new Set(synonyms)];
    antonyms = [...new Set(antonyms)];

    // Synonyms
    let synHeading = document.createElement("h3");
    synHeading.textContent = "Synonyms:";
    synantDiv.appendChild(synHeading);
    if (synonyms.length) {
      synantDiv.appendChild(document.createElement("p")).textContent = synonyms.join(", ");
    } else {
      synantDiv.appendChild(document.createElement("p")).textContent = "No synonyms found.";
    }

    // Antonyms
    let antHeading = document.createElement("h3");
    antHeading.textContent = "Antonyms:";
    synantDiv.appendChild(antHeading);
    if (antonyms.length) {
      synantDiv.appendChild(document.createElement("p")).textContent = antonyms.join(", ");
    } else {
      synantDiv.appendChild(document.createElement("p")).textContent = "No antonyms found.";
    }

    // ==========================
    // AUDIO PRONUNCIATION
    // ==========================
    let audioUrl = data[0].phonetics.find((p) => p.audio)?.audio;
    audioIcon.onclick = () => {
      if (audioUrl) {
        audioSource.src = audioUrl;
        audioPlayer.load();
        audioPlayer.play().catch((err) => {
          console.error("Audio playback failed:", err);
        });
      } else {
        alert("No audio pronunciation available.");
      }
    };

  } catch (error) {
    console.error("Error fetching word:", error);
    alert("Could not fetch the word. Please check spelling or try again.");
  }
}

// ==========================
// HEART / FAVORITE BUTTON
// ==========================
heartIcon.onclick = () => {
  heartIcon.classList.toggle("fa-regular");
  heartIcon.classList.toggle("fa-solid");

  if (heartIcon.classList.contains("fa-solid")) {
    heartIcon.style.color = "red";
  } else {
    heartIcon.style.color = "";
  }

  addFavouriteWord();
};

function addFavouriteWord() {
  console.log("Favorite word feature will be implemented here.");
}

// ==========================
// EVENT LISTENER FOR SEARCH
// ==========================
serachBtn.addEventListener("click", getDistionary);
