const sketch = require('sketch');
const { getPage, createPage } = require('./page');
const { createIntro, addLastUpdated } = require('./intro');
const { createCommit } = require('./commit');

export default () => {
  try {
    let page = getPage();
    if (!page) {
      page = createPage();
      createIntro(page.artboard);
    }
    addLastUpdated(page.artboard);
    createCommit(page.artboard);
  } catch (err) {
    sketch.UI.message(err);
  }
};
