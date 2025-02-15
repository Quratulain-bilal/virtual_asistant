let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

// Text-to-Speech Function
function speak(text) {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  let text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.volume = 1;
  text_speak.lang = "hi-GB";
  window.speechSynthesis.speak(text_speak);
}

// Wish the User Based on Time
function wishMe() {
  let day = new Date();
  let hours = day.getHours();
  if (hours >= 0 && hours < 12) {
    speak("Good Morning Sir");
  } else if (hours >= 12 && hours < 16) {
    speak("Good Afternoon Sir");
  } else {
    speak("Good Evening Sir");
  }
}

// Speech Recognition
let speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.continuous = false; // Set to false to stop after one command
recognition.interimResults = false;

recognition.onresult = (event) => {
  let currentIndex = event.resultIndex;
  let transcript = event.results[currentIndex][0].transcript;
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};

recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  speak("Sorry, I didn't catch that. Could you please repeat?");
};

// Start Listening When the Button is Clicked
btn.addEventListener("click", () => {
  recognition.start();
  voice.style.display = "block";
  btn.style.display = "none";
});

// Stop Listening
voice.addEventListener("click", () => {
  recognition.stop();
  voice.style.display = "none";
  btn.style.display = "flex";
});

// Fetch Pakistan News Headlines
async function getPakistanNews() {
  const apiKey = "c66e3f8640ae980c4bcdbe168dba21a4"; // Your GNews API key
  const url = `https://gnews.io/api/v4/top-headlines?country=pk&lang=en&max=5&token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.articles && data.articles.length > 0) {
      let headlines = data.articles.map((article) => article.title).join(". ");
      speak("Here are the latest news headlines from Pakistan: " + headlines);
    } else {
      speak("Sorry, I couldn't fetch the news at the moment.");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    speak("Sorry, there was an error fetching the news.");
  }
}

// Command Handling
function takeCommand(message) {
  console.log("Recognized Command:", message); // Debugging: Log the recognized command
  voice.style.display = "none";
  btn.style.display = "flex";

  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello Quratulain, how can I help you?");
  } else if (message.includes("who are you")) {
    speak("I am your virtual assistant my name is  Annie, created by Quratulain Shah.");
  } else if (message.includes("say thanks to my teacher")) {
    speak(
      "Thanks a lot to quratulain s teachers   Sir Zia, Sir Ameen Alam, Sir Ali Jawad."
    );
  } else if (
    message.includes("tell me the name of my teachers") ||
    message.includes("names of my teachers") ||
    message.includes("who are my teachers")
  ) {
    speak(
      "Your teachers are Sir Zia, Sir Ameen Alam, Sir Ali Jawad, and Miss Nida Rizwan."
    );
  } else if (
    message.includes("tell me the name of my friend") ||
    message.includes("who is my friend")
  ) {
    speak("Your friend is Sumaiya Fazal.");
  } else if (
    message.includes("tell me the pakistan news headlines") ||
    message.includes("pakistan news")
  ) {
    speak("Fetching the latest news headlines from Pakistan...");
    getPakistanNews();
  } else if (message.includes("open youtube")) {
    speak("Opening YouTube...");
    window.open("https://youtube.com/", "_blank");
  } else if (message.includes("open google")) {
    speak("Opening Google...");
    window.open("https://google.com/", "_blank");
  } else if (
    message.includes("search for") ||
    message.includes("google search for")
  ) {
    let query = message
      .replace("search for", "")
      .replace("google search for", "")
      .trim();
    if (query) {
      speak(`Searching Google for ${query}...`);
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank"
      );
    } else {
      speak("Please specify what you want to search for.");
    }
  } else if (message.includes("open facebook")) {
    speak("Opening Facebook...");
    window.open("https://facebook.com/", "_blank");
  } else if (message.includes("open instagram")) {
    speak("Opening Instagram...");
    window.open("https://instagram.com/", "_blank");
  } else if (message.includes("open calculator")) {
    speak("Opening Calculator...");
    window.open("Calculator://");
  } else if (message.includes("open whatsapp")) {
    speak("Opening WhatsApp...");
    window.open("https://web.whatsapp.com/", "_blank");
  } else if (message.includes("time")) {
    let time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    speak(`The time is ${time}`);
  } else if (message.includes("date")) {
    let date = new Date().toLocaleString(undefined, {
      day: "numeric",
      month: "short",
    });
    speak(`Today's date is ${date}`);
  } else if (message.includes("play my favorite song")) {
    speak("Playing your favorite song...");
    let songUrl = "https://www.youtube.com/watch?v=58xKTGxmeHI"; // Example song
    window.open(songUrl, "_blank");
  } else if (message.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
    // Handle mathematical operations
    let expression = message.match(/\d+\s*[\+\-\*\/]\s*\d+/)[0];
    let result = eval(expression); // Use eval to calculate the result
    speak(`The result is ${result}`);
  } else {
    speak("Sorry, I didn't understand that. Can you please repeat?");
  }
}

// Initial Wish
window.addEventListener("load", () => {
  wishMe();
});
