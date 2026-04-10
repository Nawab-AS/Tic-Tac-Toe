# Tic-Tac-Toe

A simple web tic-tac-toe game with an intergrated AI (MiniMax Algorithm).

**No AI was used in the making of this project.**

# Features
 - Tic-tac-toe AI
    - Uses the Minimax algorithm [(learn more here)](https://www.geeksforgeeks.org/dsa/minimax-algorithm-in-game-theory-set-1-introduction)
    - Automatically optimizes search depth via Aplha-Beta Pruning
 - Customizable board size
 - Ability to start as X or O
 - Reactive 'action' button

# Tech Stack
Vue CDN and HTML + JS + CSS

# Usage
Run with any static hosting package. Ensure to disable cache when running.

1) Python
Python comes built-in with a simple HTTP server. Run it with:
```bash
python -m http.server
```

2) Node js
Create an HTTP server with the `http-server` npm package. Install with:
```bash
npm install --global http-server
```
After installed, run with:
```bash
http-server -c-1
```

3) VS Code `Live Server` extension
Simply install from the extension marketplace and then click `Go Live` on the bottom toolbar
