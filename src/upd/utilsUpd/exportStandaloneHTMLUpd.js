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

  const storageKey = `storyProgress_${title?.replace(/\s+/g, "_") || "untitled"}`;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Interactive story with multiple choices and outcomes."
        />
        <title>${title || "Interactive Story"}</title>
        <style>
          body {
            background-color: #003049;
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
          .author {
            font-style: italic;
            font-weight: 600;
          }
          .description {
            font-style: italic;
          }
          .options button {
            display: block;
            width: 100%;
            margin: 0.5rem 0;
            padding: 0.5rem;
            background: #669bbc;
            color: #fdf0d5;
            border: 3px solid #0a122a;
            cursor: pointer;
            font-size: 1rem;
            transition-duration: 200ms;
          }
          .options button:hover {
            background: #003049;
          }
          .progress-bar {
            width: 100%;
            height: 0.75rem;
            background: #fdf0d5;
            overflow: hidden;
            margin-top: 0.75rem;
            display: none;
          }
          .progress-bar-inner {
            height: 100%;
            background: #669bbc;
            width: 0%;
            transition: width 200ms ease-in-out;
          }
          .back-button, .restart-button {
            background: #669bbc ;
            color: #fdf0d5;
            border: 3px solid #0a122a ;
            padding: 0.25rem;
            margin-top: 0.25rem;
            cursor: pointer;
            font-size: 1rem;
            display: none;
          }
          .back-button:hover, .restart-button:hover {
            background: #4b5563;
          }
          .resume-dialog {
            background: rgba(0,0,0,0.85);
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .resume-dialog-content {
            background: #222;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            max-width: 320px;
          }
          .resume-dialog button {
            background: #2563eb;
            border: none;
            color: white;
            border-radius: 6px;
            padding: 0.5rem 1rem;
            margin: 0.5rem;
            cursor: pointer;
          }
          .resume-dialog button:hover {
            background: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>${title || "Untitled Story"}</h1>
          <p class="author">By ${author || "an aspiring individual"}</p>
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
        const story = ${JSON.stringify(
          {
            title,
            author,
            description,
            start,
            nodes,
            showProgress,
            allowBackNavigation,
          },
          null,
          2,
        )};
        const storageKey = ${JSON.stringify(storageKey)};

        const sceneEl = document.getElementById('scene');
        const optionsEl = document.querySelector('.options');
        const backBtn = document.getElementById('backBtn');
        const restartBtn = document.getElementById('restartBtn');
        const progressBar = document.getElementById('progressBar');
        const progressBarInner = document.getElementById('progressBarInner');

        let currentId = story.start;
        const visited = [];

        function saveProgress() {
          const data = { currentId, visited };
          localStorage.setItem(storageKey, JSON.stringify(data));
        }

        function clearProgress() {
          localStorage.removeItem(storageKey);
        }

        function renderScene() {
          const node = story.nodes[currentId];
          if (!node) return;

          sceneEl.innerHTML = '<p>' + (node.text || '') + '</p>';
          optionsEl.innerHTML = '';

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
                  saveProgress();
                }
              };
              optionsEl.appendChild(btn);
            });
          }

          if (story.allowBackNavigation && visited.length > 0) {
            backBtn.style.display = 'inline-block';
          } else {
            backBtn.style.display = 'none';
          }

          if (story.showProgress) {
            progressBar.style.display = 'block';
            const total = Object.keys(story.nodes).length;
            const currentIndex = visited.length + 1;
            const progress = Math.min((currentIndex / total) * 100, 100);
            progressBarInner.style.width = progress + '%';
          } else {
            progressBar.style.display = 'none';
          }

          saveProgress();
        }

        backBtn.addEventListener('click', () => {
          if (visited.length > 0) {
            currentId = visited.pop();
            renderScene();
            saveProgress();
          }
        });

        restartBtn.addEventListener('click', () => {
          currentId = story.start;
          visited.length = 0;
          renderScene();
          clearProgress();
        });

        // Check if progress exists
        let savedData = null;
        try {
          savedData = JSON.parse(localStorage.getItem(storageKey));
        } catch (e) {}

        if (savedData && savedData.currentId && story.nodes[savedData.currentId]) {
          const dialog = document.createElement('div');
          dialog.className = 'resume-dialog';
          dialog.innerHTML = \`
            <div class="resume-dialog-content">
              <p>Would you like to continue where you left off?</p>
              <button id="resumeBtn">Continue</button>
              <button id="restartBtnDialog">Start Over</button>
            </div>
          \`;
          document.body.appendChild(dialog);

          dialog.querySelector('#resumeBtn').onclick = () => {
            currentId = savedData.currentId;
            visited.push(...(savedData.visited || []));
            dialog.remove();
            renderScene();
          };
          dialog.querySelector('#restartBtnDialog').onclick = () => {
            clearProgress();
            dialog.remove();
            renderScene();
          };
        } else {
          renderScene();
        }
      </script>
      </body>
    </html>
  `;
}
