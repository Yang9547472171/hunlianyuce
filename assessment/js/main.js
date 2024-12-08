import questions from './questions.js';

document.addEventListener('DOMContentLoaded', function() {
    let currentQuestion = 1;
    const totalQuestions = questions.length;
    let answers = new Array(totalQuestions).fill(null);
    
    // 获取DOM元素
    const progressBar = document.querySelector('.progress-bar__fill');
    const progressText = document.querySelector('.progress-text');
    const questionContainer = document.querySelector('.question-container');
    const prevButton = document.getElementById('prevQuestion');
    const nextButton = document.getElementById('nextQuestion');
    
    // 更新进度
    function updateProgress() {
        const progress = (currentQuestion - 1) / totalQuestions * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `第 ${currentQuestion} 题 / ${totalQuestions}`;
    }
    
    // 加载问题
    function loadQuestion(questionId) {
        const question = questions[questionId - 1];
        const html = `
            <div class="question current" data-question="${question.id}">
                <h2>${question.text}</h2>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <button class="btn btn--option ${answers[questionId - 1] === index ? 'selected' : ''}" 
                                data-index="${index}">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
        questionContainer.innerHTML = html;
        
        // 添加选项点击事件
        document.querySelectorAll('.btn--option').forEach(button => {
            button.addEventListener('click', handleOptionClick);
        });
        
        // 更新按钮状态
        prevButton.disabled = currentQuestion === 1;
        nextButton.disabled = answers[currentQuestion - 1] === null;
    }
    
    // 处理选项点击
    function handleOptionClick() {
        const optionIndex = parseInt(this.dataset.index);
        answers[currentQuestion - 1] = optionIndex;
        
        // 更新选中状态
        this.parentElement.querySelectorAll('.btn--option').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.classList.add('selected');
        
        // 延迟一下以显示选中效果
        setTimeout(() => {
            if (currentQuestion < totalQuestions) {
                currentQuestion++;
                updateProgress();
                loadQuestion(currentQuestion);
            } else {
                calculateResult();
            }
        }, 300);
    }
    
    // 上一题按钮点击事件
    prevButton.addEventListener('click', function() {
        if (currentQuestion > 1) {
            currentQuestion--;
            updateProgress();
            loadQuestion(currentQuestion);
        }
    });
    
    // 计算结果
    function calculateResult() {
        // 简单的结果计算示例
        const personalityScore = calculateTypeScore('personality');
        const valuesScore = calculateTypeScore('values');
        const lifestyleScore = calculateTypeScore('lifestyle');
        
        const totalScore = (personalityScore + valuesScore + lifestyleScore) / 3;
        
        // 跳转到结果页面
        window.location.href = `result.html?score=${totalScore}&p=${personalityScore}&v=${valuesScore}&l=${lifestyleScore}`;
    }
    
    // 计算每种类型的得分
    function calculateTypeScore(type) {
        let score = 0;
        let count = 0;
        
        questions.forEach((q, index) => {
            if (q.type === type && answers[index] !== null) {
                score += (4 - answers[index]) * q.weight;
                count += q.weight;
            }
        });
        
        return count > 0 ? Math.round((score / count) * 25) : 0;
    }
    
    // 初始加载第��题
    loadQuestion(1);
    updateProgress();
}); 