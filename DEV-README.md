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

The enitre battle replay/sim/game in contained in every instance of HTML canvas element that can be ported around the App using the `/app/features/battle/Battle.tsx` react element.

## Learning the Battle Replay/Simulation system

So you wanna learn the battle/sim, huh? Fair warning that at the time writing this README, my code is all over the dang place and I still have at least 1-2 major re-factors planned so swim at your own risk.

However, if you REALLY want to work on the battle simulation stuff (and you're more than welcome to), the main loop is managed by `app/features/battle/scene.ts` right now and the best way to find anything in the nested classes is likely by tracing through that file unfortunately.

If you have a specific thing you wanna work on, just shoot me a message and I can likely save you an hour or so of stumbling around.

### Descriptions of some of the Important classes

Off the top of my head...

- **Scene.ts:** Knows about everything in a given replay/sim and handles the main loop of the game
- **Entity.ts:** Abstract class. Handles positioning and child-parent positioning inheritance. Pretty much everything that gets added to a scene _extends_ Entity to inherit shared positioning functionality. Children will base their position on the parent's position unless manually changed.
- **GameObject.ts:** GameObjects are basically entities that can have collisions. Most things in the sim are gameobjects that have a CollisionBody and one child - a Sprite
- **Sprite.ts:** Basic rendered image at a position.
- **CollisionBody.ts:** Detects collisions and optionally manages physics as if it were the owning GameObject's body.
- **"System"Manager.ts:** CollisionManager, TargetManager, etc. Each one of these manages one of the major systems that needs to be frequently updated.

### Replay dev Controls

When the wizard battle is running, you can use the following keyboard controls to check in on development stuff. The only thing that actually does what you expectit to is pausing. Speeding up/advancing by one frame cause weird results with the physics engine BUT can be used to look at console.logs in real time.

- **Click:** Clicking the canvas element (gray square before the battle starts) where the battle happens will pause/unpause the battle.
- **Spacebar:** Pauses the battle.
- **Arrow Keys:** While playing, the left/right arrow keys will decrease/increase the playback speed by 25% restpectively. While paused, they will instead advance or rewind the replay by one frame. (rewinding doesn't work very well...)
