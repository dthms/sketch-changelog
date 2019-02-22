const { Group, Rectangle, Shape, Text } = require('sketch');
const moment = require('moment');
const { getLayer } = require('./common');

const {
  INTRO_ID,
  INTRO_NAME,
  INTRO_HEIGHT,
  INTRO_BG,
  INTRO_UPDATED_NAME,
  ARTBOARD_SPACING,
  ARTBOARD_WIDTH,
} = require('./constants');

/**
 * Update or create the last updated text
 * @param {object} artboard The artboard of the changelog
 */
const addLastUpdated = (artboard) => {
  try {
    const group = getLayer(artboard, INTRO_NAME);
    const introDesc = getLayer(group, 'Intro Text');
    const lastUpdated = getLayer(group, INTRO_UPDATED_NAME);

    if (lastUpdated) {
      lastUpdated.remove();
    }
    const updateGroup = new Group({
      name: INTRO_UPDATED_NAME,
      parent: group,
      locked: true,
      frame: new Rectangle(
        introDesc.frame.x,
        introDesc.frame.y + introDesc.frame.height + 40,
      ),
    });

    new Text({
      id: INTRO_UPDATED_NAME,
      text: `Last updated ${moment().format('MMM D YYYY')}`,
      parent: updateGroup,
      frame: new Rectangle(0, 0),
      style: {
        kerning: -0.2,
        borders: [],
        fontFamily: 'system',
        fontSize: 16,
        textColor: '#82878A',
        fontWeight: 5,
      }
    });
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Create the intro section
 * @param {object} artboard The artboard of the changelog
 */
const createIntro = (artboard) => {
  try {
    if (getLayer(artboard, INTRO_NAME)) {
      throw new Error("Intro already exists");
    }

    const group = new Group({
      name: INTRO_NAME,
      id: INTRO_ID,
      parent: artboard,
      locked: true,
      frame: new Rectangle(0, 0, ARTBOARD_WIDTH, INTRO_HEIGHT),
    });

    new Shape({
      name: 'Background',
      parent: group,
      locked: true,
      frame: new Rectangle(0, 0, artboard.frame.width, INTRO_HEIGHT),
      style: {
        fills: [{ color: INTRO_BG }],
        borders: [],
      }
    });


    const textGroup = new Group({
      name: 'Intro Text',
      parent: group,
      locked: true,
      frame: new Rectangle(
        group.frame.x + ARTBOARD_SPACING,
        group.frame.y + ARTBOARD_SPACING,
        ARTBOARD_WIDTH
      ),
    });

    const title = new Text({
      id: 'Title',
      text: 'Changelog',
      parent: textGroup,
      frame: new Rectangle(0, 0),
      style: {
        kerning: null,
        borders: [],
        fontFamily: 'system',
        fontSize: 28,
        lineHeight: 28,
        textColor: '#13171A',
        fontWeight: 8,
      }
    });

    new Text({
      id: 'Desc',
      text: 'Each time you make a change add it to the Changelog using the shortcut CMD + Shift + P. Each time you add a new log it will append it onto the end of the list below.',
      parent: textGroup,
      fixedWidth: true,
      frame: new Rectangle(
        title.frame.x,
        title.frame.y + title.frame.height + 16,
        ARTBOARD_WIDTH - (ARTBOARD_SPACING * 2),
      ),
      style: {
        kerning: null,
        borders: [],
        fontFamily: 'system',
        fontSize: 19,
        lineHeight: 30,
        textColor: '#53585D',
        fontWeight: 5,
      }
    });

  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createIntro,
  addLastUpdated,
};
