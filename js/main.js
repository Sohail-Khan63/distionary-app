let userInputWrd = document.querySelector("#serach-box");
let serachBtn = document.querySelector(".search-btn");
let wrodTitle = document.querySelector(".wrd-defination-title");
let phonetic = document.querySelector(".phonetic");
let audioIcon = document.querySelector("#audio-Play");
let audioPlayer = document.getElementById("audio-player");
let audioSource = document.getElementById("audio-source");
let heartIcon = document.querySelector("#heart-icon");
const getDistionary = async () => {
  let word = userInputWrd.value.trim();
  if (!word) {
    alert("Please Typing Word...");
  } else {
    const URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    let response = await fetch(URL);
    let data = await response.json();
    console.log(data);
    let wordPhonetic = data[0].phonetic;
    let wordName = data[0].word;
    wrodTitle.textContent = wordName;
    phonetic.textContent = wordPhonetic;
    const getDefinitions = (data) => {
      let definition = [];
      data[0].meanings.forEach((meaning) => {
        const pos = meaning.partOfSpeech;
        meaning.definitions.forEach((def) => {
          if (def) {
            definition.push({
              partOfSpeech: pos,
              definition: def.definition,
            });
          }
        });
      });
      return definition;
    };
    let definations = getDefinitions(data);
    let definitionDiv = document.querySelector("#definition");
    definitionDiv.innerHTML = " ";
    definations.forEach((def, index) => {
      let p = document.createElement("p");
      p.textContent = `${index + 1}. (${def.partOfSpeech}) ${def.definition}`;
      definitionDiv.appendChild(p);
    });
    const getExamples = (data) => {
      let examples = [];

      data[0].meanings.forEach((meaning) => {
        meaning.definitions.forEach((def) => {
          if (def.example) {
            examples.push(def.example);
          }
        });
      });

      return examples;
    };
    let examples = getExamples(data);
    let exampleDiv = document.querySelector("#example");
    exampleDiv.innerHTML = " ";
    examples.forEach((ex, index) => {
      let p = document.createElement("p");
      p.textContent = `${index + 1}. ${ex}`;
      exampleDiv.appendChild(p);
    });

    const getSynonymsAndAntonyms = (data) => {
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

      return {
        synonyms: [...new Set(synonyms)],
        antonyms: [...new Set(antonyms)],
      };
    };

    // Usage after fetching API data:
    let synantDiv = document.querySelector("#synant");
    let { synonyms, antonyms } = getSynonymsAndAntonyms(data);

    // Clear previous content
    synantDiv.innerHTML = "";

    // Create and append Synonyms section
    let synHeading = document.createElement("h3");
    synHeading.textContent = "Synonyms:";
    synantDiv.appendChild(synHeading);

    if (synonyms.length === 0) {
      synantDiv.innerHTML += "<p>No synonyms found.</p>";
    } else {
      let synList = document.createElement("p");
      synList.textContent = synonyms.join(", ");
      synantDiv.appendChild(synList);
    }

    // Create and append Antonyms section
    let antHeading = document.createElement("h3");
    antHeading.textContent = "Antonyms:";
    synantDiv.appendChild(antHeading);

    if (antonyms.length === 0) {
      synantDiv.innerHTML += "<p>No antonyms found.</p>";
    } else {
      let antList = document.createElement("p");
      antList.textContent = antonyms.join(", ");
      synantDiv.appendChild(antList);
    }
    audioIcon.addEventListener("click", () => {
      audioIcon.addEventListener("click", () => {
        let audioUrl = data[0].phonetics.find((p) => p.audio)?.audio;
        if (audioUrl) {
          audioSource.src = audioUrl;
          audioPlayer.load();
          audioPlayer.oncanplaythrough = () => {
            audioPlayer.play().catch((err) => {
              console.error("Playback failed:", err);
            });
          };
        } else {
          alert("No audio pronunciation available.");
        }
      });
    });
  }

  heartIcon.addEventListener("click", () => {
    heartIcon.classList.toggle("fa-regular");
    heartIcon.classList.toggle("fa-solid");

    if (heartIcon.classList.contains("fa-solid")) {
      heartIcon.style.color = "red";
    } else {
      heartIcon.style.color = "";
    }
    addFavouriteWord();
  });
  const addFavouriteWord = ()=>{
    console.log("Hello")
  }
};
serachBtn.addEventListener("click", getDistionary);
