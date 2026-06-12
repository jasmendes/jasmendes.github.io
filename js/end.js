
const finalScore = document.getElementById('finalScore');
const summaryText = document.getElementById('summaryText');
const categorySummary = document.getElementById('categorySummary');
const categoryScores = document.getElementById('categoryScores');

const mostRecentScore = sessionStorage.getItem('lastScore') || localStorage.getItem('mostRecentScore');
const subject = sessionStorage.getItem('lastScoreSubject');
const difficulty = sessionStorage.getItem('lastScoreDifficulty');
const username = sessionStorage.getItem('username');

finalScore.innerText = mostRecentScore ? `Score final: ${mostRecentScore}` : 'Score não encontrado.';
summaryText.innerText = username
  ? `Olá ${username}, aqui está o ranking para a categoria jogada.`
  : 'Aqui está o ranking da categoria jogada.';

async function loadCategoryScores() {
  if (!window.supabaseClient) {
    categoryScores.innerHTML = '<p>Supabase não inicializado.</p>';
    return;
  }

  if (!subject || !difficulty) {
    categorySummary.innerText = 'Categoria ou dificuldade não definidos.';
    categoryScores.innerHTML = '<p>Não há categoria guardada para mostrar resultados.</p>';
    return;
  }

  categorySummary.innerHTML = `
    <p><strong>Disciplina:</strong> ${subject}</p>
    <p><strong>Dificuldade:</strong> ${difficulty}</p>
  `;

  try {
    const { data, error } = await window.supabaseClient
      .from('scores')
      .select('username, score, subject, difficulty, created_at')
      .eq('subject', subject)
      .eq('difficulty', difficulty)
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao carregar scores da categoria:', error);
      categoryScores.innerHTML = '<p>Erro ao carregar os resultados.</p>';
      return;
    }

    if (!data || data.length === 0) {
      categoryScores.innerHTML = '<p>Não existem resultados para esta categoria ainda.</p>';
      return;
    }

    categoryScores.innerHTML = `
      <h3>Top scores para ${subject} (${difficulty})</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Utilizador</th>
            <th>Pontuação</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.username}</td>
                <td>${item.score}</td>
                <td>${new Date(item.created_at).toLocaleDateString('pt-PT')}</td>
              </tr>
            `)
            .join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error(err);
    categoryScores.innerHTML = '<p>Erro inesperado ao carregar os resultados.</p>';
  }
}

// Do not auto-load scores — wait for user action. Provide a button to show them.
const showBtn = document.getElementById('showScoresBtn');
if (showBtn) {
  showBtn.addEventListener('click', async () => {
    // ensure categoryScores container is visible
    categoryScores.style.display = '';
    await loadCategoryScores();
  });
}

// Try to save the score once when arriving to this page if we have subject/difficulty
async function tryAutoSave() {
  try {
    if (!mostRecentScore) return;
    if (!subject || !difficulty) return;
    if (sessionStorage.getItem('lastScoreSaved') === '1') return;
    if (!window.saveScore) {
      console.warn('saveScore helper not available');
      return;
    }

    const res = await window.saveScore(mostRecentScore, subject, difficulty, sessionStorage.getItem('lastScoreTotal'));
    if (res) {
      sessionStorage.setItem('lastScoreSaved', '1');
      console.log('Score auto-saved on end page.');
    }
  } catch (err) {
    console.error('Auto-save error:', err);
  }
}

tryAutoSave();