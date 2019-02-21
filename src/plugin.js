const sketch = require('sketch');
const moment = require('moment');

const pageName = '🛠 Changelog';
const pageWidth = 600;
const pageHeight = 312;
const documentSpacing = 40;
const textSpacing = 32;

// Add new log function
const addChangeLog = (artboard, value) => {
  try {
    const layers = artboard.layers;
    const lastLayer = layers[layers.length - 1];
    const layerY = lastLayer.frame.y;
    const height = lastLayer.frame.height;

    // Timestamp
    const date = new sketch.Text({
      text: `${moment().format('h:mmA MMM D YYYY')}`,
      parent: artboard,
      fixedWidth: true,
      frame: new sketch.Rectangle(
        documentSpacing,
        layerY + height + (layers.length === 1 ? 50 : textSpacing),
        pageWidth - (documentSpacing * 2),
      ),
      style: {
        fontSize: 11,
        textColor: '#7A7A7A',
        borders: [],
        kerning: .1,
        fontWeight: 9,
        fontFamily: 'system',
        textTransform: 'uppercase',
      },
    });

    // Actual user log
    const changeText = new sketch.Text({
      text: `${value}`,
      parent: artboard,
      fixedWidth: true,
      frame: new sketch.Rectangle(
        documentSpacing,
        date.frame.y + date.frame.height + 4,
        pageWidth - (documentSpacing * 2),
      ),
      style: {
        fontSize: 16,
        textColor: '#333',
        borders: [],
        kerning: null,
        fontWeight: 5,
        fontFamily: 'system',
        lineHeight: 24,
      },
    });

    sketch.UI.message('Logged 🤙');

    // Position it correctly
    const lastItem = changeText.frame.y + changeText.frame.height + documentSpacing;
    if (lastItem > pageHeight) {
      const artboardOldSize = artboard.frame.height;
      artboard.frame = new sketch.Rectangle(0, 0, pageWidth, lastItem);
    }
  } catch (err) {
    throw new Error(err);
  }
}

export default function(context) {
  try {
    var document = sketch.getSelectedDocument();
    const rectangle = new sketch.Rectangle(0, 0, pageWidth, pageHeight);

    // Create Array of Pages 
    const pages = document.pages;
    const pagesWithNames = pages.map(page => page.name);
    
    // Create Page & Artboard if it doesn't exist
    if (pagesWithNames.indexOf(pageName) === -1) {
      sketch.UI.getInputFromUser('What did you change?', {}, (err, value) => {
        if (!value) {
          throw new Error("Write a change");
        } else {
          const page = new sketch.Page({
            parent: document,
            name: pageName,
            id: 'changelog'
          });

          const artboard = new sketch.Artboard({
            id: 'changelogArtboard',
            parent: page,
            frame: rectangle,
          });

          const title = new sketch.Text({
            text: 'Changelog',
            parent: artboard,
            frame: new sketch.Rectangle(documentSpacing, 50),
            style: {
              fontSize: 24,
              textColor: '#000',
              borders: [],
              kerning: null,
              fontFamily: 'system',
            },
          });

          const intro = new sketch.Text({
            text: 'Each time you make a change add it to the Changelog using the shortcut CMD + Shift + P. Each time you add a new log it will append it onto the end of the list below.',
            parent: artboard,
            fixedWidth: true,
            frame: new sketch.Rectangle(documentSpacing, title.frame.y + title.frame.height + 16, 520),
            style: {
              fontSize: 18,
              textColor: '#333',
              borders: [],
              kerning: null,
              fontWeight: 5,
              fontFamily: 'system',
              lineHeight: 26,
            },
          });

          new sketch.Shape({
            parent: artboard,
            name: 'linebreak',
            frame: new sketch.Rectangle(
              documentSpacing,
              intro.frame.y + intro.frame.height + 32,
              pageWidth - (documentSpacing * 2), 1
            ),
            style: {
              borders: [],
              fills: [{
                color: '#E3E3E3',
              }],
            },
          });

          addChangeLog(artboard, value);
        }
      });
    } else {
      sketch.UI.getInputFromUser('What did you change?', {}, (err, value) => {
        if (!value) {
          throw new Error("Write a change");
        } else {
          const changelogPage = pages[pagesWithNames.indexOf(pageName)];
          const artboard = changelogPage.layers[0];
          addChangeLog(artboard, value);
        }
      });
    }
  } catch (err) {
    sketch.UI.message(err)
  }
}
