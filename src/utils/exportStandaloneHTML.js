export function generateStandaloneStoryHTML(story) {
  const storyJson = JSON.stringify(story, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${story.title || "Interactive Story"}</title>
  <style>
    body {
      background-color: #111;
      color: #f0f0f0;
      font-family: system-ui, sans-serif;
      max-width: 600px;
      margin: 2em auto;
      padding: 1em;
      line-height: 1.6;
    }
    h1 {
      text-align: center;
      font-size: 1.8em;
    }
    p {
      margin-bottom: 1em;
    }
    button {
      display: block;
      width: 100%;
      background-color: #2563eb;
      border: none;
      color: white;
      padding: 0.75em;
      border-radius: 0.5em;
      font-size: 1em;
      margin-top: 0.5em;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background-color: #1d4ed8;
    }
    .end {
      text-align: center;
      color: #facc15;
      font-weight: bold;
      margin-top: 2em;
    }
  </style>
</head>
<body>
  <h1 id="title"></h1>
  <p id="author"></p>
  <p id="description" style="font-style:italic;color:#aaa;"></p>
  <div id="text"></div>
  <div id="options"></div>

  <script>
    const story = ${storyJson};
    let currentNodeId = story.start || Object.keys(story.nodes)[0];

    function renderNode() {
      const node = story.nodes[currentNodeId];
      document.getElementById('title').textContent = story.title || "Untitled Story";
      document.getElementById('author').textContent = "By " + (story.author || "an aspiring individual");
      document.getElementById('description').textContent = story.description || "";

      const textDiv = document.getElementById('text');
      textDiv.innerHTML = '';
      node.text.split(/\\n{2,}/).forEach(paragraph => {
        const p = document.createElement('p');
        paragraph.split(/\\n/).forEach((line, i, arr) => {
          p.appendChild(document.createTextNode(line));
          if (i < arr.length - 1) p.appendChild(document.createElement('br'));
        });
        textDiv.appendChild(p);
      });

      const optionsDiv = document.getElementById('options');
      optionsDiv.innerHTML = '';
      if (node.options && node.options.length > 0) {
        node.options.forEach(option => {
          const btn = document.createElement('button');
          btn.textContent = option.text;
          btn.onclick = () => {
            currentNodeId = option.next;
            renderNode();
          };
          optionsDiv.appendChild(btn);
        });
      } else {
        const endDiv = document.createElement('div');
        endDiv.className = 'end';
        endDiv.textContent = 'The End';
        const restart = document.createElement('button');
        restart.textContent = 'Restart Story';
        restart.onclick = () => {
          currentNodeId = story.start || Object.keys(story.nodes)[0];
          renderNode();
        };
        optionsDiv.appendChild(endDiv);
        optionsDiv.appendChild(restart);
      }
    }

    renderNode();
  </script>
</body>
</html>`;
}
