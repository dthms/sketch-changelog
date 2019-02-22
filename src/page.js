const {
  Page,
  Artboard,
  Rectangle,
  getSelectedDocument,
} = require('sketch');

const {
  ARTBOARD_WIDTH,
  ARTBOARD_STARTING_HEIGHT,
  ARTBOARD_X,
  ARTBOARD_Y,
  PAGE_NAME,
  PAGE_ID,
  ARTBOARD_NAME,
  ARTBOARD_ID,
} = require('./constants');

const { getLayer } = require('./common');

/**
 * Get the page
 * @returns {boolean|object} Returns false if doesn't exist else returns the page
 */
const getPage = () => {
  try {
    const document = getSelectedDocument();
    const pages = document.pages;
    const pageIds = pages.map(page => page.name);
    const pageIndex = pageIds.indexOf(PAGE_NAME);

    if (pageIndex === -1) {
      return false;
    }

    const page = pages[pageIndex];
    const artboard = getLayer(page, ARTBOARD_NAME);

    return {
      page,
      artboard,
    };
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Creates a new page in sketch
 */
const createPage = () => {
  try {
    const document = getSelectedDocument();
    const pageExists = getPage();
    if (pageExists) {
      throw new Error("Page already exists");
    }

    const page = new Page({
      parent: document,
      name: PAGE_NAME,
      id: PAGE_ID,
    });

    const artboard = new Artboard({
      id: ARTBOARD_ID,
      name: ARTBOARD_NAME,
      parent: page,
      frame: new Rectangle(
        ARTBOARD_X,
        ARTBOARD_Y,
        ARTBOARD_WIDTH,
        ARTBOARD_STARTING_HEIGHT
      ),
    });

    return {
      page,
      artboard,
    };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getPage,
  createPage,
}