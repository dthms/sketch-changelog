const moment = require('moment');
const { Group, Rectangle, Text, UI, Shape, Style } = require('sketch');
const { INTRO_NAME, ARTBOARD_SPACING, COMMIT_SPACING, MONTH_GROUP_SPACING, ARTBOARD_WIDTH } = require('./constants');
const { getLayer } = require('./common');

const createCommit = (artboard) => {
  // generate a unique (monthly) name
  const intro = getLayer(artboard, INTRO_NAME);
  const name = moment().format('MM-YYYY');

  UI.getInputFromUser("What did you do?", {
    type: UI.INPUT_TYPE.selection,
    possibleValues: ['Update', 'Add', 'Remove']
  }, (err, type) => {
    if (type && !err) {
      UI.getInputFromUser(`What did you ${type.toLowerCase()}?`, {}, (err, value) => {
        if (value && !err) {
          // check if the name already exists (same month)
          let monthGroup = getLayer(artboard, name);
          let monthTitle = null;
          let newMonth = false;

          if (monthGroup) {
            monthTitle = getLayer(monthGroup, 'Title');
          }

          // if not create a group with the unique name created
          if (!monthGroup) {
            newMonth = true;
            monthGroup = new Group({
              name,
              frame: new Rectangle(ARTBOARD_SPACING, intro.frame.height + ARTBOARD_SPACING),
              parent: artboard,
            });

            monthTitle = new Group({
              name: 'Title',
              frame: new Rectangle(0, 0),
              parent: monthGroup,
            });

            new Text({
              text: moment().format('MMMM YYYY'),
              parent: monthTitle,
              frame: new Rectangle(0, 0),
              style: {
                kerning: -0.3,
                borders: [],
                fontFamily: 'system',
                fontSize: 16,
                textColor: '#333333',
                fontWeight: 8,
              }
            });
          }
          
          // build commit
          const commitName = moment().format('MM-DD-YYYY HH:mm:ss');
          const commitGroup = new Group({
            name: commitName,
            parent: monthGroup,
            frame: new Rectangle(0, monthTitle.frame.y + monthTitle.frame.height + 28),
          });

          ///// build comment stuff here
          const commitText = new Text({
            text: value,
            parent: commitGroup,
            fixedWidth: true,
            frame: new Rectangle(0, 0, ARTBOARD_WIDTH - (ARTBOARD_SPACING * 2)),
            style: {
              kerning: null,
              borders: [],
              fontFamily: 'system',
              fontSize: 16,
              lineHeight: 24,
              textColor: '#333333',
              fontWeight: 5,
            }
          });

          const tagGroup = new Group({
            name: 'tag',
            parent: commitGroup,
            frame: new Rectangle(
              0,
              commitText.frame.y +commitText.frame.height + 12,
            ),
          });

          const tagInfo = {
            update: {
              color: '#F89F46',
              bg: '#FEF3E8',
              copy: 'Updated',
            },
            add: {
              color: '#49AF06',
              bg: '#E9F5E1',
              copy: 'Added',
            },
            remove: {
              color: '#AF0606',
              bg: '#F7E6E6',
              copy: 'Removed',
            }
          };

          const tagText = new Text({
            text: tagInfo[type.toLowerCase()].copy,
            parent: tagGroup,
            frame: new Rectangle(6, 4),
            style: {
              kerning: 0.2,
              borders: [],
              fontFamily: 'system',
              fontSize: 10,
              textTransform: 'uppercase',
              textColor: tagInfo[type.toLowerCase()].color,
              fontWeight: 8,
            }
          })

          const bg = new Shape({
            text: type.toUpperCase(),
            parent: tagGroup,
            frame: new Rectangle(-6, -4, tagText.frame.width + 12, tagText.frame.height + 8),
            style: {
              borders: [],
              borderOptions: {
                lineJoin: Style.LineJoin.Round,
              },
              fills: [{ color: tagInfo[type.toLowerCase()].bg }],
            }
          });

          console.log(bg);
          //bg.setCornerRadiusFromComponents('6/6/6/6')

          tagText.moveToFront();

          new Text({
            text: moment().format('h:mmA MMM D YYYY'),
            parent: commitGroup,
            frame: new Rectangle(
              tagGroup.frame.width + tagGroup.frame.x + 12,
              commitText.frame.y + commitText.frame.height + 16,
            ),
            style: {
              kerning: 0.2,
              borders: [],
              fontFamily: 'system',
              fontSize: 10,
              textTransform: 'uppercase',
              textColor: '#7A7A7A',
              fontWeight: 8,
            }
          });

          ///// end build commit stuff
          monthGroup.adjustToFit();

          // move rest of the commits down
          const otherCommits = monthGroup.layers
            .filter(layer => layer.name !== commitName && layer.name !== 'Title');

          otherCommits.forEach((commit) => {
            commit.frame = new Rectangle(0, commit.frame.y + commitGroup.frame.height + COMMIT_SPACING);
          });

          // move the rest of the day group objects down by object height
          const otherMonths = artboard.layers
            .filter(layer => layer.name !== name && layer.name !== INTRO_NAME);
          const addedHeight = newMonth ? monthGroup.frame.height : commitGroup.frame.height;
          otherMonths.forEach((month) => {
            month.frame = new Rectangle(month.frame.x, month.frame.y + addedHeight + MONTH_GROUP_SPACING);
          });

          // extend the artboards height if needed
          artboard.frame = new Rectangle(
            0,
            0,
            ARTBOARD_WIDTH,
            artboard.frame.height + addedHeight + ARTBOARD_SPACING
          );
        } else {
          throw new Error("You need to add a message");
        }
      });
    }
  });
};

module.exports = {
  createCommit,
};