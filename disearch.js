var b1 = document.getElementById('b1')

b1.onclick = function(){
    document.body.classList.toggle('dark-theme')
}


const apiKey = ''; // Replace this with your actual API key

const searchButton = document.getElementById('searchButton');
const languageButton = document.getElementById('languageButton');
const diseaseInput = document.getElementById('diseaseInput');
const resultContainer = document.getElementById('resultContainer');
let language = 'en'; // Default language is English

searchButton.addEventListener('click', () => {
    const disease = diseaseInput.value.trim();
    if (disease !== '') {
        getResult(disease); // Call getResult directly
    }
});

languageButton.addEventListener('click', () => {
    toggleLanguage();
});

async function getResultWithDelay(disease) { // Use getResultWithDelay instead of getResult
    const delay = 0.0001; // 2 second delay
    await new Promise(resolve => setTimeout(resolve, delay)); // Introduce delay

    getResult(disease); // Call getResult after the delay
}

async function getResult(disease) {
    console.log('Fetching data for disease:', disease);

    const url = `https://api.openai.com/v1/completions`;

    const requestBody = {
        model: 'gpt-3.5-turbo-instruct',
        prompt: `information about ${disease} (disease) ,max 150 words`,
        max_tokens: 1000,
        temperature: 0.2,
        n: 1,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error data:', errorData);
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        const description = data.choices[0].text.trim();

        console.log('Description:', description);

        displayResult(description);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
    }
}


function displayResult(description) {
    resultContainer.innerHTML = `
        <p>${description}</p>
    `;
}

function toggleLanguage() {
    if (language === 'en') {
        language = 'ar';
        document.documentElement.lang = 'ar';
        document.body.classList.add('arabic');
    } else {
        language = 'en';
        document.documentElement.lang = 'en';
        document.body.classList.remove('arabic');
    }
    
    // Update button text
    languageButton.innerHTML = language === 'en' ? '<i class="fas fa-language"></i>' : '<i class="fas fa-language"></i>'; // You need to change the icons based on your preference

    // Update other text elements
    document.getElementById('searchButton').textContent = translations['Search'][language];
    document.getElementById('upin').textContent = translations['Disease Information'][language];
    //document.getElementById('diseaseInput').ariaPlaceholder = translations['Enter a disease...'][language];
    document.getElementById('resultContainer').querySelectorAll('p').forEach((p, index) => {
        p.textContent = translations[p.getAttribute('data-key')][language];
    });
}

const translations = {
    'Disease Information': {
        en: 'Disease Information',
        ar: 'معلومات المرض'
    },
    'Enter a disease...': {
        en: 'Enter a disease...',
        ar: 'اكتب اسم المرض'
    },
    'Search': {
        en: 'Search',
        ar: 'بحث'
    },
    '<i class="fas fa-language"></i>' : {
        en: 'Switch Language',
        ar: 'تغيير اللغة'
    },
    'Description': {
        en: 'Description',
        ar: 'الوصف'
    },
    'Prevention': {
        en: 'Prevention',
        ar: 'الوقاية'
    },
    'Effects': {
        en: 'Effects',
        ar: 'الآثار'
    }
};

// Initial text setting
languageButton.textContent = translations['Switch Language'][language];
document.getElementById('searchButton').textContent = translations['Search'][language];
document.getElementById('resultContainer').querySelectorAll('p').forEach((p, index) => {
    p.textContent = translations[p.getAttribute('data-key')][language];
});




// Function to read the webpage aloud
function readPageAloud() {
    var content = document.body.innerText;
    var sentences = content.split(/[.!?]/);
    var index = 0;
    
    // Read each sentence with a delay
    var interval = setInterval(function() {
        if (index < sentences.length) {
            // Speak the sentence
            speak(sentences[index]);
            index++;
        } else {
            // All sentences have been read, clear the interval
            clearInterval(interval);
        }
    }, 1000); // Adjust delay here (in milliseconds)
}

// Function to speak text using SpeechSynthesis API
function speak(text) {
    var utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

// Event listener for the button click
document.getElementById("readButton").addEventListener("click", readPageAloud);

