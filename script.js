// Common functions
function getQuestions() {
    return JSON.parse(localStorage.getItem('questions')) || [];
}

function saveQuestions(questions) {
    localStorage.setItem('questions', JSON.stringify(questions));
}

// Index page
if (window.location.pathname.includes('index.html')) {
    document.getElementById('student-mode').addEventListener('click', () => {
        window.location.href = 'student.html';
    });
    document.getElementById('teacher-mode').addEventListener('click', () => {
        window.location.href = 'teacher.html';
    });
}

// Student page
if (window.location.pathname.includes('student.html')) {
    const quizContainer = document.getElementById('quiz-container');
    const submitBtn = document.getElementById('submit-quiz');
    const scoreDisplay = document.getElementById('score-display');
    const backBtn = document.getElementById('back-btn');

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    const questions = getQuestions();
    let totalScore = 0;

    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${q.question}</h3>
            ${q.options.map((opt, i) => `<label><input type="radio" name="q${index}" value="${i+1}"> ${opt}</label><br>`).join('')}
        `;
        quizContainer.appendChild(div);
    });

    submitBtn.addEventListener('click', () => {
        totalScore = 0;
        questions.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected && parseInt(selected.value) === q.correct) {
                totalScore += q.points;
            }
        });
        scoreDisplay.textContent = `Your Score: ${totalScore}`;
        scoreDisplay.style.display = 'block';
    });
}

// Teacher page
if (window.location.pathname.includes('teacher.html')) {
    const form = document.getElementById('add-question-form');
    const questionsList = document.getElementById('questions-list');
    const backBtn = document.getElementById('back-btn');

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    function renderQuestions() {
        questionsList.innerHTML = '';
        const questions = getQuestions();
        questions.forEach((q, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>${q.question}</strong></p>
                <p>Options: ${q.options.join(', ')}</p>
                <p>Correct: ${q.correct}, Points: ${q.points}</p>
                <button onclick="deleteQuestion(${index})">Delete</button>
            `;
            questionsList.appendChild(div);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = document.getElementById('question-text').value;
        const options = [
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value,
            document.getElementById('option4').value
        ];
        const correct = parseInt(document.getElementById('correct-answer').value);
        const points = parseInt(document.getElementById('points').value);
        const questions = getQuestions();
        questions.push({question, options, correct, points});
        saveQuestions(questions);
        form.reset();
        renderQuestions();
    });

    window.deleteQuestion = (index) => {
        const questions = getQuestions();
        questions.splice(index, 1);
        saveQuestions(questions);
        renderQuestions();
    };

    renderQuestions();
}
