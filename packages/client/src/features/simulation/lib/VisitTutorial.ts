const VISIT_TUTORIAL_KEY = 'visitedTutorial';

export const visitTutorial = {
  _visited: undefined as string | undefined | null,
  get() {
    if (this._visited === undefined) {
      this._visited = localStorage.getItem(VISIT_TUTORIAL_KEY);
    }

    if (!this._visited) {
      return true;
    }

    const today = Date.now();
    const visited = new Date(this._visited).getTime();

    const dayDifference = (today - visited) / (1000 * 60 * 60 * 24);

    return dayDifference >= 7;
  },
  set() {
    const TUTORIAL_VISITED = new Date().toISOString();
    this._visited = TUTORIAL_VISITED;
    localStorage.setItem(VISIT_TUTORIAL_KEY, TUTORIAL_VISITED);
  },
  reset() {
    this._visited = null;
    localStorage.removeItem(VISIT_TUTORIAL_KEY);
  },
};
