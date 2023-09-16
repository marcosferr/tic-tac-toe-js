//https://rapidapi.com/martin.svoboda/api/quotes15 Fuente

const url = "https://quotes15.p.rapidapi.com/quotes/random/?language_code=es";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "20ca20206amshee8a3289cb46a7dp182c00jsnaa233a5c74dd",
    "X-RapidAPI-Host": "quotes15.p.rapidapi.com",
  },
};

async function getQuote() {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function addQuote() {
  const fraseElement = document.getElementById("frases");
  const frase = await getQuote();
  console.log(frase);
  fraseElement.innerHTML = frase.content + frase.originator.name;
}
addQuote();
