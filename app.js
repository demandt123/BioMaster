const route = [
    { id: "1", name: "Linkerkamer", type: "rich", text: "De linkerkamer heeft een dikke gespierde wand. Hij pompt het zuurstofrijke bloed met flinke kracht de aorta in." },
    { id: "2", name: "Aorta", type: "rich", text: "De aorta is de grootste slagader van het lichaam. Vanuit hier vertakt het bloed zich naar alle organen." },
    { id: "3", name: "Slagaders", type: "rich", text: "Slagaders hebben dikke, elastische wanden. Ze transporteren het bloed áf van het hart richting de weefsels." },
    { id: "4", name: "Haarvaten", type: "capillary", text: "In de flinterdunne haarvaten geeft het bloed zuurstof af aan de cellen en neemt het afvalstoffen (CO₂) op." },
    { id: "5", name: "Aders", type: "poor", text: "Aders stromen terug náár het hart. Ze bevatten kleppen om te zorgen dat het bloed niet terugstroomt." },
    { id: "6", name: "Holle ader", type: "poor", text: "De bovenste en onderste holle ader verzamelen al het zuurstofarme bloed en komen uit in de rechterboezem." },
    { id: "7", name: "Rechterboezem", type: "poor", text: "De rechterboezem ontvangt het zuurstofarme bloed en stroomt direct door naar de rechterkamer." },
    { id: "8", name: "Rechterkamer", type: "poor", text: "De rechterkamer pompt het zuurstofarme bloed richting de longslagader." },
    { id: "9", name: "Longslagader", type: "poor", text: "Let op! Dit is de enige SLAGADER in het lichaam die ZUURSTOFARM bloed vervoert, op weg naar de longen." },
    { id: "10", name: "Longen", type: "lung", text: "In de longblaasjes adem je CO₂ uit en neemt het bloed weer verse zuurstof (O₂) op. Het bloed wordt weer vuurrood!" },
    { id: "11", name: "Longader", type: "rich", text: "De longader brengt het vers geoogste, zuurstofrijke bloed weer terug naar de linkerkant van het hart." },
    { id: "12", name: "Linkerboezem", type: "rich", text: "De linkerboezem verzamelt het zuurstofrijke bloed en vult direct de linkerkamer voor de volgende ronde." }
];

let currentStep = 0;
let currentQuizIndex = 0;
let score = 0;
let answered = false;

function switchScreen(screenId) {
    document.getElementById('screen-home').classList.add('hidden');
    document.getElementById('screen-learn').classList.add('hidden');
    document.getElementById('screen-drag').classList.add('hidden');
    document.getElementById('screen-quiz').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
    
    if(screenId === 'screen-learn') {
        currentStep = 0;
        updateStation();
    } else if(screenId === 'screen-drag') {
        initDragGame();
    } else if(screenId === 'screen-quiz') {
        currentQuizIndex = 0;
        score = 0;
        loadQuizQuestion();
    }
}

function updateStation() {
    const station = route[currentStep];
    const indicator = document.getElementById('blood-indicator');
    const nameEl = document.getElementById('station-name');
    const typeEl = document.getElementById('blood-type');
    const textEl = document.getElementById('station-text');
    nameEl.innerText = station.name;
    textEl.innerText = station.text;

    if (station.type === "rich") {
        indicator.className = "w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300";
        nameEl.className = "text-xl font-black tracking-wide mt-4 text-red-500";
        typeEl.innerText = "🔴 Zuurstofrijk bloed";
        typeEl.className = "text-xs font-semibold mt-1 px-2 py-0.5 rounded bg-red-900/50 text-red-400";
    } else if (station.type === "poor") {
        indicator.className = "w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300";
        nameEl.className = "text-xl font-black tracking-wide mt-4 text-blue-500";
        typeEl.innerText = "🔵 Zuurstofarm bloed";
        typeEl.className = "text-xs font-semibold mt-1 px-2 py-0.5 rounded bg-blue-950/50 text-blue-400";
    } else if (station.type === "capillary") {
        indicator.className = "w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300";
        nameEl.className = "text-xl font-black tracking-wide mt-4 text-purple-400";
        typeEl.innerText = "🟣 Gaswisseling (Lichaam)";
        typeEl.className = "text-xs font-semibold mt-1 px-2 py-0.5 rounded bg-purple-900/50 text-purple-400";
    } else if (station.type === "lung") {
        indicator.className = "w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300";
        nameEl.className = "text-xl font-black tracking-wide mt-4 text-emerald-400";
        typeEl.innerText = "💨 Zuurstof opname (Longen)";
        typeEl.className = "text-xs font-semibold mt-1 px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400";
    }
}
function nextStation() { currentStep = (currentStep + 1) % route.length; updateStation(); }
function initDragGame() {
    const container = document.getElementById('drag-container');
    const feedback = document.getElementById('game-feedback');
    feedback.classList.add('hidden'); container.innerHTML = '';
    const shuffled = [...route].slice(0, 6).sort(() => Math.random() - 0.5);
    shuffled.forEach(item => {
        const el = document.createElement('div'); el.dataset.id = item.id; el.draggable = true;
        el.className = "p-3 bg-slate-700 hover:bg-slate-600 rounded-xl cursor-grab flex items-center gap-3 border border-slate-600 font-medium select-none";
        el.innerHTML = `<span>☰</span> <span>${item.name}</span>`;
        el.addEventListener('dragstart', () => el.classList.add('dragging'));
        el.addEventListener('dragend', () => el.classList.remove('dragging'));
        container.appendChild(el);
    });
    container.addEventListener('dragover', e => {
        e.preventDefault(); const afterElement = getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) { container.appendChild(dragging); } else { container.insertBefore(dragging, afterElement); }
    });
}
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('[draggable="true"]:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function checkDragOrder() {
    const container = document.getElementById('drag-container'); const items = [...container.children];
    const feedback = document.getElementById('game-feedback'); let correct = true;
    for (let i = 0; i < items.length - 1; i++) { if (parseInt(items[i].dataset.id) > parseInt(items[i+1].dataset.id)) { correct = false; break; } }
    feedback.classList.remove('hidden');
    if (correct) {
        feedback.innerText = "🎉 Perfect! Alles staat in de juiste volgorde.";
        feedback.className = "text-center text-sm font-bold mb-3 text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-800";
    } else {
        feedback.innerText = "❌ Probeer opnieuw. De volgorde klopt nog niet.";
        feedback.className = "text-center text-sm font-bold mb-3 text-red-400 bg-red-950/40 p-2 rounded-xl border border-red-800";
    }
}
function loadQuizQuestion() {
    answered = false; 
    document.getElementById('quiz-feedback').classList.add('hidden'); 
    document.getElementById('btn-next-question').classList.add('hidden');
    
    // Zorg dat we de vragen altijd vers inladen uit questions.js
    const activeQuestions = typeof quizQuestions !== 'undefined' ? quizQuestions : [];
    
    if (activeQuestions.length === 0) {
        document.getElementById('quiz-question').innerText = "⚠️ Fout: Vragen konden niet worden geladen uit questions.js.";
        return;
    }

    const currentQuestion = activeQuestions[currentQuizIndex];
    document.getElementById('quiz-progress').innerText = `Vraag ${currentQuizIndex + 1} van ${activeQuestions.length}`;
    document.getElementById('quiz-score').innerText = `Score: ${score}`; 
    document.getElementById('quiz-question').innerText = currentQuestion.q;
    
    const optionsContainer = document.getElementById('quiz-options'); 
    optionsContainer.innerHTML = '';
    
    currentQuestion.answers.forEach((answer, index) => {
        const btn = document.createElement('button'); 
        btn.className = "w-full py-3 px-4 bg-slate-700 hover:bg-slate-650 rounded-xl font-medium text-left transition cursor-pointer border border-slate-600";
        btn.innerText = answer; 
        btn.onclick = () => selectAnswer(index, btn); 
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex, clickedBtn) {
    if (answered) return; 
    answered = true; 
    const activeQuestions = typeof quizQuestions !== 'undefined' ? quizQuestions : [];
    const currentQuestion = activeQuestions[currentQuizIndex];
    
    const feedback = document.getElementById('quiz-feedback'); 
    feedback.classList.remove('hidden');
    const optionsContainer = document.getElementById('quiz-options'); 
    const buttons = optionsContainer.getElementsByTagName('button');
    
    if (selectedIndex === currentQuestion.correct) {
        score += 10; 
        clickedBtn.className = "w-full py-3 px-4 bg-emerald-600 rounded-xl font-medium text-left border border-emerald-400";
        feedback.innerText = "✅ Ding! Heel goed."; 
        feedback.className = "text-center text-sm font-bold mb-3 text-emerald-400";
    } else {
        clickedBtn.className = "w-full py-3 px-4 bg-red-600 rounded-xl font-medium text-left border border-red-400";
        buttons[currentQuestion.correct].className = "w-full py-3 px-4 bg-emerald-600 rounded-xl font-medium text-left border border-emerald-400";
        feedback.innerText = "❌ Boem! Fout antwoord."; 
        feedback.className = "text-center text-sm font-bold mb-3 text-red-400";
    }
    document.getElementById('quiz-score').innerText = `Score: ${score}`; 
    document.getElementById('btn-next-question').classList.remove('hidden');
}

function nextQuestion() {
    currentQuizIndex++;
    const activeQuestions = typeof quizQuestions !== 'undefined' ? quizQuestions : [];
    if (currentQuizIndex < activeQuestions.length) { 
        loadQuizQuestion(); 
    } else {
        document.getElementById('quiz-question').innerText = "🏁 Toets Afgerond!";
        document.getElementById('quiz-options').innerHTML = `<p class='text-center text-slate-300 my-4'>Je eindscore is: <strong class='text-xl text-purple-400'>${score} punten</strong>!</p>`;
        document.getElementById('quiz-feedback').classList.add('hidden'); 
        document.getElementById('btn-next-question').classList.add('hidden');
    }
}
