# Getting Started

The stack I'm using for this project is NextJS, which is just a framework built on top of React that adds QoL features like page routing. React itself is a really cool library for HTML/JS/CSS that has a lot of its own depth.

### Optional - Pre-development Learning

If you want to learn the different languages/libraries of this project before jumping in, I'd do it in the following order:

html/css -> JavaScript -> React -> TypeScript

If you really wanna do a deep dive before starting and you're willing to spend money, I really enjoyed the [React](https://react-tutorial.app/app.html) course by [Jad Jourbran](https://jadjoubran.io/) adn he has a [TypeScript](https://learntypescript.online/app.html) one too.

## Setting up the Dev Environment

To do any development, you need to install the project dependencies. First download the [Node.js](https://nodejs.org/en/download) package manager.

Then, install the dependencies using:

```bash
npm install
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser or VSCodeto see the result.

## Working on the UI side of things

The UI entry point is `app/page.tsx`. You can kinda just start building off of that if you wanna do UI stuff.

The enitre battle replay/sim/game-engine in contained in every instance of HTML canvas element that can be ported around the App using the `/app/features/battle/Battle.tsx` react element.

## Learning the Battle Replay/Sim system

So you wanna learn the battle/sim engine, huh? Fair warning that at the time writing this README, my code is all over the dang place and I still have at least 2-3 re-factors planned so swim at your own risk.

However, if you REALLY want to work on the battle simulation/game engine stuff (and you're more than welcome to), the main loop is managed by `app/features/battle/engine.ts` right now and the best way to find anything in the nested classes is likely by tracing through that file unfortunately.

If you have a specific thing you wanna work on, just shoot me a message and I can likely save you an hour or so of stumbling around.

### Replay dev Controls

When the wizard battle is running, you can use the following keyboard controls to check in on development stuff.

- **Click:** Clicking the canvas element (gray square before the battle starts) where the battle happens will pause/unpause the battle.
- **Spacebar:** Pauses the battle.
- **Arrow Keys:** While playing, the left/right arrow keys will decrease/increase the playback speed by 25% restpectively. While paused, they will instead advance or rewind the replay by one frame. (rewinding doesn't work very well...)
