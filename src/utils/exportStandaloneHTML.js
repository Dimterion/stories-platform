export function generateStandaloneStoryHTML(story) {
  const {
    title,
    author,
    description,
    start,
    nodes,
    showProgress,
    allowBackNavigation,
  } = story;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title || "Interactive Story"}</title>
        <style>
          body {
            background-color: #111;
            color: #f0f0f0;
            font-family: system-ui, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: 100vh;
          }
          main {
            max-width: 600px;
            width: 80%;
            padding: 20px;
            text-align: center;
          }
          h1 { font-size: 1.5rem; margin-top: 1rem; }
          p { line-height: 1.6; }
          .description {
            font-style: italic;
          }
          .options button {
            display: block;
            width: 100%;
            margin: 0.4rem 0;
            padding: 0.7rem;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
          }
          .options button:hover {
            background: #1d4ed8;
          }
          .progress-bar {
            width: 100%;
            height: 8px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 12px;
            display: none;
          }
          .progress-bar-inner {
            height: 100%;
            background: #22c55e;
            width: 0%;
            transition: width 0.3s ease;
          }
          .back-button, .restart-button {
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            margin-top: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            display: none;
          }
          .back-button:hover, .restart-button:hover {
            background: #4b5563;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>${title || "Untitled Story"}</h1>
          <p class="description">${description || ""}</p>
          <div id="scene"></div>
          <div class="options"></div>
          <button class="back-button" id="backBtn">⬅ Back</button>
          <button class="restart-button" id="restartBtn">🔁 Restart Story</button>
          <div class="progress-bar" id="progressBar">
            <div class="progress-bar-inner" id="progressBarInner"></div>
          </div>
        </main>

      <script>
        const story = ${JSON.stringify({ title, author, description, start, nodes, showProgress, allowBackNavigation }, null, 2)};
        const sceneEl = document.getElementById('scene');
        const optionsEl = document.querySelector('.options');
        const backBtn = document.getElementById('backBtn');
        const restartBtn = document.getElementById('restartBtn');
        const progressBar = document.getElementById('progressBar');
        const progressBarInner = document.getElementById('progressBarInner');

        let currentId = story.start;
        const visited = [];

        function renderScene() {
          const node = story.nodes[currentId];
          if (!node) return;

          sceneEl.innerHTML = '<p>' + (node.text || '') + '</p>';
          optionsEl.innerHTML = '';

          // Check if this is an ending node (no options)
          if (!node.options || node.options.length === 0) {
            optionsEl.innerHTML = '<p><em>The End.</em></p>';
            restartBtn.style.display = 'inline-block';
          } else {
            restartBtn.style.display = 'none';
            node.options.forEach((opt) => {
              const btn = document.createElement('button');
              btn.textContent = opt.text || 'Continue';
              btn.onclick = () => {
                if (opt.next && story.nodes[opt.next]) {
                  visited.push(currentId);
                  currentId = opt.next;
                  renderScene();
                }
              };
              optionsEl.appendChild(btn);
            });
          }

          // Back button visibility
          if (story.allowBackNavigation && visited.length > 0) {
            backBtn.style.display = 'inline-block';
          } else {
            backBtn.style.display = 'none';
          }

          // Progress bar visibility + update
          if (story.showProgress) {
            progressBar.style.display = 'block';
            const total = Object.keys(story.nodes).length;
            const currentIndex = visited.length + 1;
            const progress = Math.min((currentIndex / total) * 100, 100);
            progressBarInner.style.width = progress + '%';
          } else {
            progressBar.style.display = 'none';
          }
        }

        // Back navigation
        backBtn.addEventListener('click', () => {
          if (visited.length > 0) {
            currentId = visited.pop();
            renderScene();
          }
        });

        // Restart story
        restartBtn.addEventListener('click', () => {
          currentId = story.start;
          visited.length = 0;
          renderScene();
        });

        renderScene();
      </script>
      </body>
    </html>
  `;
}
