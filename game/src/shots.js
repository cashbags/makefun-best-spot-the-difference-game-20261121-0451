// The screenshot scenes behind ?shot=start|play|end. Each one plays the real
// rules forward from a fresh world, so the frame is what real play looks like
// and the same seed always gives the same frame.
import { SCREEN_LEVEL, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

// Click the first `count` differences of the level, through the real check().
function findSome(world, count) {
  for (let i = 0; i < count; i += 1) {
    const d = world.state.diffs[i];
    world.check(d[0], d[1]);
  }
}

export function stageShot(name, world) {
  world.reset();
  if (name !== 'play' && name !== 'end') return { screen: SCREEN_TITLE, best: 0 };
  if (name === 'play') {
    findSome(world, 2);
    world.state.timeLeft = 47;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  findSome(world, world.state.diffs.length);
  return { screen: SCREEN_LEVEL, best: world.state.score };
}
