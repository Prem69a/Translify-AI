// =====================================
// ELEMENTS
// =====================================

const inputBox = document.getElementById(
    "inputText"
);

const outputBox = document.getElementById(
    "outputText"
);

const sourceSelect = document.getElementById(
    "sourceLang"
);

const targetSelect = document.getElementById(
    "targetLang"
);

const translateButton = document.querySelector(
    ".translate"
);

const copyButton = document.querySelector(
    ".copy"
);

const clearButton = document.querySelector(
    ".clear"
);

const swapButton = document.querySelector(
    ".swap"
);

const charCount = document.getElementById(
    "charCount"
);

const toast = document.getElementById(
    "toast"
);

const historyBox = document.getElementById(
    "historyBox"
);


// =====================================
// LANGUAGE CODES
// =====================================

const languages = {

    "Auto Detect":"auto",

    "English":"en",

    "Hindi":"hi",

    "Marathi":"mr",

    "French":"fr",

    "German":"de",

    "Spanish":"es"

};


// =====================================
// TOAST
// =====================================

function showToast(message){

    toast.innerHTML = message;

    toast.classList.add(
        "show"
    );

    setTimeout(

        function(){

            toast.classList.remove(
                "show"
            );

        },

        2000

    );

}


// =====================================
// CHARACTER COUNTER
// =====================================

inputBox.addEventListener(

    "input",

    function(){

        charCount.innerHTML =
        inputBox.value.length;

    }

);


// =====================================
// HISTORY
// =====================================

async function loadHistory(){

    const response = await fetch(

        "/history"

    );

    const data = await response.json();

    historyBox.innerHTML = "";

    data.forEach(

        function(item){

            historyBox.innerHTML += `

            <div class="history-item">

                <div class="history-input">

                    ${item.input}

                </div>

                <div class="history-output">

                    ${item.output}

                </div>

            </div>

            `;

        }

    );

}


// =====================================
// TRANSLATE
// =====================================

translateButton.addEventListener(

    "click",

    async function(){

        let text =
        inputBox.value.trim();

        if(text===""){

            showToast(

                "⚠ Enter some text"

            );

            return;

        }

        translateButton.innerHTML =
        "⏳ Translating...";

        translateButton.disabled =
        true;

        const response =
        await fetch(

            "/translate",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:JSON.stringify(

                    {

                        text:text,

                        source:languages[
                            sourceSelect.value
                        ],

                        target:languages[
                            targetSelect.value
                        ]

                    }

                )

            }

        );

        const data =
        await response.json();

        outputBox.value =
        data.translated;

        showToast(

            "🌍 Translation Complete"

        );

        loadHistory();

        translateButton.innerHTML =
        "✅ Done";

        setTimeout(

            function(){

                translateButton.innerHTML =
                "🚀 Translate";

                translateButton.disabled =
                false;

            },

            1200

        );

    }

);


// =====================================
// COPY
// =====================================

copyButton.addEventListener(

    "click",

    function(){

        if(outputBox.value==""){

            showToast(

                "⚠ Nothing to Copy"

            );

            return;

        }

        navigator.clipboard.writeText(

            outputBox.value

        );

        showToast(

            "📋 Copied"

        );

    }

);


// =====================================
// CLEAR
// =====================================

clearButton.addEventListener(

    "click",

    function(){

        inputBox.value = "";

        outputBox.value = "";

        charCount.innerHTML = 0;

        showToast(

            "🗑 Cleared"

        );

    }

);


// =====================================
// SMART SWAP
// =====================================

swapButton.addEventListener(

    "click",

    function(){

        let source =
        sourceSelect.value;

        let target =
        targetSelect.value;

        if(source!="Auto Detect"){

            sourceSelect.value =
            target;

            targetSelect.value =
            source;

        }

        let input =
        inputBox.value;

        let output =
        outputBox.value;

        inputBox.value =
        output;

        outputBox.value =
        input;

        charCount.innerHTML =
        inputBox.value.length;

        showToast(

            "🔄 Swapped"

        );

    }

);


// =====================================
// INITIAL LOAD
// =====================================

loadHistory();
// =====================================
// THEME
// =====================================

const themeButton = document.getElementById(

    "themeButton"

);


if(

    localStorage.getItem(

        "theme"

    ) == "light"

){

    document.body.classList.add(

        "light"

    );

    themeButton.innerHTML="☀️";

}


themeButton.addEventListener(

    "click",

    function(){

        document.body.classList.toggle(

            "light"

        );

        if(

            document.body.classList.contains(

                "light"

            )

        ){

            localStorage.setItem(

                "theme",

                "light"

            );

            themeButton.innerHTML="☀️";

        }

        else{

            localStorage.setItem(

                "theme",

                "dark"

            );

            themeButton.innerHTML="🌙";

        }

    }

);
// =====================================
// CLEAR HISTORY
// =====================================

const clearHistoryButton =

document.getElementById(

    "clearHistory"

);


clearHistoryButton.addEventListener(

    "click",

    async function(){

        await fetch(

            "/clear_history",

            {

                method:"POST"

            }

        );

        historyBox.innerHTML="";

        showToast(

            "🗑 History Cleared"

        );

    }

);
// =====================================
// SPEAK
// =====================================

const speakButton = document.querySelector(

    ".speak"

);


speakButton.addEventListener(

    "click",

    function(){

        if(

            outputBox.value==""

        ){

            showToast(

                "⚠ Nothing to Speak"

            );

            return;

        }

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(

            outputBox.value

        );

        const langMap={

            "English":"en-US",

            "Hindi":"hi-IN",

            "Marathi":"mr-IN",

            "French":"fr-FR",

            "German":"de-DE",

            "Spanish":"es-ES"

        };

        speech.lang=

        langMap[

            targetSelect.value

        ] ||

        "en-US";

        speech.rate=1;

        speech.pitch=1;

        window.speechSynthesis.speak(

            speech

        );

        showToast(

            "🔊 Speaking..."

        );

    }

);
// =====================================
// VOICE INPUT
// =====================================

const voiceButton =

document.getElementById(

    "voiceButton"

);

if(

    'webkitSpeechRecognition'

    in

    window

){

    const recognition =

    new webkitSpeechRecognition();

    const voiceLangMap={

    "Auto Detect":"en-US",

    "English":"en-US",

    "Hindi":"hi-IN",

    "Marathi":"mr-IN",

    "French":"fr-FR",

    "German":"de-DE",

    "Spanish":"es-ES"

};

recognition.lang =

voiceLangMap[

    sourceSelect.value

] ||

"en-US";

    recognition.continuous =

    false;

    recognition.interimResults =

    false;

    voiceButton.addEventListener(

        "click",

        function(){
            recognition.lang =

        voiceLangMap[

            sourceSelect.value

        ] ||

        "en-US";
            recognition.start();

            voiceButton.classList.add(

                "listening"

            );

            showToast(

                "🎤 Listening..."

            );

        }

    );

    recognition.onresult =

    function(

        event

    ){

        inputBox.value =

        event.results[0][0].transcript;

    };

    recognition.onend =

    function(){

        voiceButton.classList.remove(

            "listening"

        );

    };

}else{

    voiceButton.style.display=

    "none";

}
// =====================================
// COLLAPSIBLE HISTORY
// =====================================

const toggleHistory =

document.getElementById(

    "toggleHistory"

);

const mainLayout =

document.querySelector(

    ".main-layout"

);

let collapsed = false;

toggleHistory.addEventListener(

    "click",

    function(){

        collapsed = !collapsed;

        mainLayout.classList.toggle(

            "collapsed"

        );

        if(

            collapsed

        ){

            toggleHistory.innerHTML="▶";

        }

        else{

            toggleHistory.innerHTML="◀";

        }

    }

);