document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.querySelector('.play-icon');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    
    let isPlaying = false;
    let isDragging = false;

    // Array de emojis limitados (apenas corações, balões, confetes, estrelas)
    const limitedEmojis = [
        '💖', '💕', '💗', '💓', '💝', '💘', '💞', '💟',
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤',
        '🎈', '🎊', '✨', '⭐', '🌟', '💫'
    ];

    // Função para formatar tempo
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Atualiza a duração total quando a música carrega
    backgroundMusic.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(backgroundMusic.duration);
    });

    // Atualiza o progresso da música
    backgroundMusic.addEventListener('timeupdate', function() {
        if (!isDragging) {
            const progress = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeEl.textContent = formatTime(backgroundMusic.currentTime);
        }
    });

    // Controle play/pause
    playPauseBtn.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            playIcon.textContent = '▶️';
            isPlaying = false;
        } else {
            backgroundMusic.play().then(() => {
                playIcon.textContent = '⏸️';
                isPlaying = true;
            }).catch(function(error) {
                console.log('Erro ao reproduzir a música:', error);
                alert('Erro ao reproduzir a música. Verifique se o arquivo está disponível.');
            });
        }
    });

    // Controle da barra de progresso
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * backgroundMusic.duration;
        
        backgroundMusic.currentTime = newTime;
        progressFill.style.width = (percentage * 100) + '%';
    });

    // Arrastar na barra de progresso
    progressBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        updateProgress(e);
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            updateProgress(e);
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    function updateProgress(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = clickX / rect.width;
        const newTime = percentage * backgroundMusic.duration;
        
        backgroundMusic.currentTime = newTime;
        progressFill.style.width = (percentage * 100) + '%';
        currentTimeEl.textContent = formatTime(newTime);
    }

    // Tenta reproduzir automaticamente após um pequeno delay
    setTimeout(() => {
        backgroundMusic.play().then(() => {
            playIcon.textContent = '⏸️';
            isPlaying = true;
        }).catch(function(error) {
            console.log('Autoplay bloqueado pelo navegador:', error);
            // Mantém o ícone de play para o usuário clicar
        });
    }, 1000);

    // Função para criar emoji flutuante (limitado)
    function createFloatingEmoji() {
        const emoji = document.createElement('div');
        emoji.innerHTML = limitedEmojis[Math.floor(Math.random() * limitedEmojis.length)];
        emoji.className = 'floating-emoji';
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.top = '100vh';
        emoji.style.fontSize = Math.random() * 10 + 20 + 'px';
        
        // Adiciona uma pequena variação na animação
        emoji.style.animationDuration = (Math.random() * 4 + 10) + 's';
        emoji.style.animationDelay = Math.random() * 3 + 's';
        
        document.body.appendChild(emoji);
        
        setTimeout(() => {
            emoji.remove();
        }, 15000);
    }

    // Cria emojis com frequência reduzida
    setInterval(createFloatingEmoji, 2000); // A cada 2 segundos

    // Cria rajadas menores de emojis ocasionalmente
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(createFloatingEmoji, i * 300);
        }
    }, 20000); // A cada 20 segundos uma rajada

    // Adiciona movimento suave e realista às polaroids
    const polaroids = document.querySelectorAll('.polaroid-inner');
    
    polaroids.forEach((polaroid, index) => {
        // Adiciona um movimento sutil e natural
        setInterval(() => {
            const randomRotation = (Math.random() - 0.5) * 1; // -0.5 a 0.5 grau
            const currentRotation = parseFloat(getComputedStyle(polaroid.parentElement).getPropertyValue('--rotation')) || 0;
            
            if (!polaroid.matches(':hover')) {
                polaroid.style.transform = `rotate(${currentRotation + randomRotation}deg)`;
            }
        }, 5000 + index * 1000);
        
        // Adiciona efeito de "respiração" sutil
        polaroid.style.animation += `, breathe ${8 + index}s ease-in-out infinite`;
    });

    // Adiciona CSS para animação de respiração
    const style = document.createElement('style');
    style.textContent = `
        @keyframes breathe {
            0%, 100% { transform: scale(1) rotate(var(--rotation, 0deg)); }
            50% { transform: scale(1.02) rotate(var(--rotation, 0deg)); }
        }
    `;
    document.head.appendChild(style);

    // Adiciona interação com clique nas polaroids
    polaroids.forEach(polaroid => {
        polaroid.addEventListener('click', function() {
            this.style.transform = 'rotate(0deg) scale(1.1) translateY(-15px)';
            
            // Cria uma pequena explosão de emojis quando clica na polaroid
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    const emoji = document.createElement('div');
                    emoji.innerHTML = limitedEmojis[Math.floor(Math.random() * limitedEmojis.length)];
                    emoji.className = 'floating-emoji';
                    
                    const rect = this.getBoundingClientRect();
                    emoji.style.left = (rect.left + rect.width / 2) + 'px';
                    emoji.style.top = (rect.top + rect.height / 2) + 'px';
                    emoji.style.fontSize = '25px';
                    emoji.style.animationDuration = '4s';
                    document.body.appendChild(emoji);
                    
                    setTimeout(() => emoji.remove(), 4000);
                }, i * 150);
            }
            
            setTimeout(() => {
                if (!this.matches(':hover')) {
                    const rotation = getComputedStyle(this.parentElement).getPropertyValue('--rotation') || '0deg';
                    this.style.transform = `rotate(${rotation}) scale(1)`;
                }
            }, 2000);
        });
    });

    // Adiciona emojis especiais em momentos específicos
    setTimeout(() => {
        // Explosão inicial menor de emojis após 4 segundos
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloatingEmoji, i * 200);
        }
    }, 4000);

    // Adiciona efeito de parallax suave aos emojis de fundo
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        document.querySelectorAll('.floating-emoji').forEach(emoji => {
            emoji.style.transform += ` translateY(${parallax}px)`;
        });
    });
});

