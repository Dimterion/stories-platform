type MinimalStory = {
  title?: string;
  author?: string;
  description?: string;
  start: string;
  nodes: Record<string, unknown>;
  showProgress?: boolean;
  allowBackNavigation?: boolean;
};

export function generateStandaloneStoryHTML(story: MinimalStory): string {
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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Science+Gothic:wght@300;500;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --deepBlue: #003049;
            --softWhite: #fdf0d5;
            --darkBlue: #0a122a;
            --lightBlue: #669bbc;
            --lightGreen: #2a9d8f;
            --darkGreen: #008000;
            --baseRed: #c1121f;
            --lightRed: #f87171;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--deepBlue);
            color: var(--softWhite);
            font-family: "Science Gothic", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          main {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            width: 100%;
          }

          .shell {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            max-width: 1024px;
          }

          .panel {
            width: 100%;
            border: 3px solid var(--darkBlue);
            background-color: var(--softWhite);
            color: var(--deepBlue);
          }

          .panel-header {
            width: 100%;
            background-color: var(--deepBlue);
            color: var(--softWhite);
            border-bottom: 3px solid var(--darkBlue);
            padding: 0.25rem 0.5rem;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 700;
          }

          .panel-meta {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.25rem 1rem 0.5rem;
            border-top: 3px solid var(--darkBlue);
          }

          .panel-meta p {
            margin: 0.15rem 0;
          }

          .panel-meta .author {
            font-style: italic;
            font-weight: 600;
          }

          .panel-meta .description {
            max-width: 60ch;
            text-align: center;
          }

          .progress-wrapper {
            width: 100%;
            border: 3px solid var(--darkBlue);
          }

          .progress-outer {
            width: 100%;
            height: 0.75rem;
            background-color: var(--softWhite);
          }

          .progress-inner {
            height: 100%;
            width: 0%;
            background-color: var(--lightBlue);
            transition: width 200ms ease-in-out;
          }

          .scene-panel {
            min-height: 18rem;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }

          .scene-content {
            max-width: 60ch;
          }

          .scene-content p {
            margin: 0 0 0.75rem 0;
            line-height: 1.6;
          }

          .options-panel {
            padding: 0.5rem;
          }

          .options-panel .options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            width: 100%;
            padding: 0.4rem 0.6rem;
            border: 3px solid var(--darkBlue);
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 200ms ease, color 200ms ease, opacity 200ms ease;
          }

          .btn-primary {
            background-color: var(--lightBlue);
            color: var(--softWhite);
          }

          .btn-primary:hover {
            background-color: var(--deepBlue);
          }

          .btn-back {
            background-color: var(--lightGreen);
            color: var(--softWhite);
            margin-top: 0.5rem;
          }

          .btn-back:hover {
            background-color: var(--darkGreen);
          }

          .btn-danger {
            background-color: var(--baseRed);
            color: var(--softWhite);
          }

          .btn-danger:hover {
            background-color: var(--lightRed);
          }

          .btn-disabled {
            opacity: 0.7;
            cursor: default;
          }

          .end-header {
            width: 100%;
            background-color: var(--deepBlue);
            color: var(--softWhite);
            border: 3px solid var(--darkBlue);
            padding: 0.25rem 0.5rem;
            text-align: center;
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
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
            background: #222222;
            padding: 1.5rem;
            margin: 0.5rem;
            text-align: center;
            max-width: 320px;
            border: 3px solid var(--softWhite);
          }

          .resume-dialog p {
            margin: 0 0 0.75rem 0;
          }

          .resume-dialog button {
            background: var(--lightBlue);
            color: var(--softWhite);
            border: 3px solid var(--darkBlue);
            padding: 0.4rem 0.8rem;
            margin: 0.25rem;
            cursor: pointer;
            font-size: 0.95rem;
          }

          .resume-dialog button:hover {
            background: var(--deepBlue);
          }

          @media (max-width: 640px) {
            main {
              padding: 0.75rem;
            }
            .panel-header {
              font-size: 1.25rem;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <div class="shell">
            <!-- Title / author / description -->
            <div class="panel">
              <div class="panel-header">
                ${title || "Untitled Story"}
              </div>
              <div class="panel-meta">
                <p class="author">By ${author || "an aspiring individual"}</p>
                <p class="description">${description || ""}</p>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="progress-wrapper" id="progressWrapper" style="display:none;">
              <div class="progress-outer">
                <div class="progress-inner" id="progressBarInner"></div>
              </div>
            </div>

            <!-- Text -->
            <div class="panel scene-panel">
              <div class="scene-content" id="scene"></div>
            </div>

            <!-- Options + back -->
            <div class="panel options-panel">
              <div class="options" id="options"></div>
              <button class="btn btn-back" id="backBtn">
                &#8592; Back<span id="backLabel"></span>
              </button>
            </div>

            <!-- Restart -->
            <button class="btn btn-danger" id="restartBtn">
              &#8634; Clear Save & Reset Progress
            </button>
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
          const optionsEl = document.getElementById('options');
          const backBtn = document.getElementById('backBtn');
          const backLabelEl = document.getElementById('backLabel');
          const restartBtn = document.getElementById('restartBtn');
          const progressWrapper = document.getElementById('progressWrapper');
          const progressBarInner = document.getElementById('progressBarInner');

          let currentId = story.start;
          const visited = [];

          function saveProgress() {
            const data = { currentId, visited };
            try {
              localStorage.setItem(storageKey, JSON.stringify(data));
            } catch (e) {}
          }

          function clearProgress() {
            try {
              localStorage.removeItem(storageKey);
            } catch (e) {}
          }

          function renderScene() {
            const node = story.nodes[currentId];
            if (!node) return;

            sceneEl.innerHTML = "";
            const p = document.createElement("p");
            p.textContent = node.text || "";
            sceneEl.appendChild(p);
            optionsEl.innerHTML = '';

            if (!node.options || node.options.length === 0) {
              const endHeader = document.createElement('div');
              endHeader.className = 'end-header';
              endHeader.textContent = 'The End';
              optionsEl.appendChild(endHeader);
            } else {
              node.options.forEach((opt) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-primary';
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

            // Back button visibility / label
            if (story.allowBackNavigation) {
              backBtn.style.display = 'inline-flex';
              if (visited.length <= 0) {
                backBtn.disabled = true;
                backBtn.classList.add('btn-disabled');
                backLabelEl.textContent = ' (Start)';
              } else {
                backBtn.disabled = false;
                backBtn.classList.remove('btn-disabled');
                backLabelEl.textContent = '';
              }
            } else {
              backBtn.style.display = 'none';
            }

            // Progress bar
            if (story.showProgress) {
              progressWrapper.style.display = 'block';
              const total = Object.keys(story.nodes).length;
              const currentIndex = visited.length + 1;
              const progress = Math.min((currentIndex / total) * 100, 100);
              progressBarInner.style.width = progress + '%';
            } else {
              progressWrapper.style.display = 'none';
            }

            saveProgress();
          }

          backBtn.addEventListener('click', () => {
            if (!story.allowBackNavigation) return;
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
