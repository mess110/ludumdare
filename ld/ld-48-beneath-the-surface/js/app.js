window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  function(/* function */ callback, /* DOMElement */ element){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var canvas, context, toggle;

var WIDTH = 640;
var HEIGHT = 480;
var BG_SCROLL_SPEED = 1;
var DEFAULT_INFO = '- press space to start -';

var bgY = 0;
var spaceCount = 0;

var info = DEFAULT_INFO;
var level = 'loading';

var bgImg = document.getElementById("background-img");
var flagImg = document.getElementById("flag");
var boardImg = document.getElementById("board");
var instructionsImg = document.getElementById("instructions");
var uiImg= document.getElementById("ui");
var pantsImg = document.getElementById("pants");

var loadingText = ['hit space to load faster', 'it really helps', 'keep going', '..', 'hit space', 'harder', 'better', 'hit space!!!', 'stronger', 'faster', 'almost there', 'keep going', 'hulk smash', 'there ya go', '...', 'wow such time', 'hm....', 'I wonder..', 'did the game crash?', 'i hope not', 'wait.. wait..', 'I said wait', 'common please wait', '...', 'you are not waiting', '...', 'fine!', '5 more spaces', '4', '3', '2', '1', '0', '-1', 'yes I lied', 'get used to it', 'just wait till we stop'];
var level1Text = ['You could have waited 10 sec', 'Got you there..', 'This is a story of Ben', 'Ben Eat.. Wait a second', 'I don\'t hear anything', 'This game has sound', 'I swear', 'Maybe it is off', 'Press Ctrl+W to enable sound', 'Oh..', 'You are still here', 'What a surprise', 'Most people don\'t come back', 'I wanted to eat cake', 'Now I have to do this..', 'Sigh..', 'The cake is not a lie', 'Chocalate chipped', 'Red velvet', 'Cream', 'At the perfect temperature', 'Ok, fine..', 'FINE!!!', 'This is the story of Ben', 'Ben Eath', 'Ben Eath the Surf Ace', 'Ehm..', 'I said..', 'Ben Eath the Surf Ace', 'Hm...', 'I was expecting a wave', 'And..', 'And Ben', 'Ben?', 'BEN!!!', 'most peculiar', 'BEN!!!!', 'hic', 'what?!?', 'hic, hiccup, hiccup..', 'oh dear..', 'ben?', 'hic', 'ben did you party again', 'hardcore? damn it ben', 'not today', 'why today', 'let me look at you..', 'of all days...', 'oh dear', 'what about the game?', 'what about the player?', 'look at yourself', '* hiccup', 'Well now..', 'What now...', 'Maybe..', 'I have to get creative', 'Here..', 'Imagine this is Ben'];
var level2Text = ['Yes..', 'This should work', 'Take Ben Eath\'s pants', 'Put them on a tree', 'Banana tree - wink wink', 'and you are set', 'Ben Eath The Surf Ace Tree']
var level3Text = ['Or is it spelled Three?', 'hm.. Press space to start', 'not this again', 'hit space', 'harder', 'better', 'just kidding', 'So..', 'We begin', 'Oh.. no.. wait..', 'You can\'t see your score'];
var level4Text = ['There you go..', 'Top left', 'You should see it now..', 'You might be wondering', 'How to get points', 'So am I.', 'Now.. Where were we?', 'Ah.. yes!', 'You have 3 lives', 'And start with 5 coins', 'You wisely decide', 'To keep them', 'Good job', 'Top knotch play'];
var level5Text = ['Now..', 'It is your choice', 'Pay 5 coins for super-powers', '- or -', 'Continue without', 'A - With; B -without'];
var level6Text = ['I will take the 5 coins.', 'You have no idea', 'How many players', 'Fall for that trick', 'Cha-ching', 'Now..', 'There is only one thing left', 'The culmination', 'The Grand finale', 'the long awaited ending', 'Here it comes', 'No..', 'No.. No.. No..', 'I can\'t..', 'But I should..', 'You won\'t mind will you?', 'If you got this far', 'You must be an open-minded..', 'um.. person?', 'So without further adue..', 'My dear..', 'Look at the time..', 'I have to go.', 'Gonna eat the cake,', 'Water the tree', 'Tell you - you win -', 'Because that is what you want', 'You want those 2 little words', 'On your screen', 'To bask in glory', 'Well guess what..', 'Not this time!', 'F*ck you' ];

var lastInput = Date.now();

init();
animate();

function init() {
  canvas = document.getElementById('game');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  context = canvas.getContext('2d');
}

function animate() {
  requestAnimFrame( animate );
  clear();
  draw();
}

function loadLevel(s) {
  spaceCount = 0;
  level = s;
}

function levelIs(s) {
  return level == s;
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  if (bgY > -1 * (bgImg.height - HEIGHT)) {
    bgY -= BG_SCROLL_SPEED;
  } else {
    if (levelIs('loading')) {
      info = DEFAULT_INFO;
      bgY = -1 * (bgImg.height - HEIGHT);
      loadLevel('loaded');
    }
  }
  context.drawImage(bgImg, 0, bgY);
  if (levelIs('level2') || levelIs('level3') || levelIs('level4') || levelIs('level5') || levelIs('level6')) {
    context.drawImage(pantsImg, WIDTH - pantsImg.width - 30, HEIGHT - pantsImg.height - 20);
  }

  context.drawImage(instructions, 0, 0);
  if (levelIs('level3') || levelIs('level4') || levelIs('level5') || levelIs('level6')) {
    context.fillStyle = "black";
    context.font = '29px PixelFont';
    context.fillText('-tree', 460, 127);
  }

  if (levelIs('level4') || levelIs('level5') || levelIs('level6')) {
    context.fillStyle = "black";
    context.font = '29px PixelFont';
    context.fillText('score -1', 70, 40);
  }

  context.fillStyle = "black";
  context.textAlign = "center";
  context.font = '26px PixelFont';
  context.fillText(info, 320, 240);

  if (levelIs('timerIntro') || levelIs('wait')) {
    context.fillStyle = "black";
    context.font = '26px PixelFont';
    context.fillText((Date.now() - lastInput), 320, 365);
  }
}

document.body.onkeydown = function(event){
  event = event || window.event;
  var keycode = event.charCode || event.keyCode;

  prevInput = Date.now() - lastInput;
  lastInput = Date.now();

  if (keycode === 32) {
    spaceCount++;
    if (levelIs('loading')) {
      if (loadingText.length >= spaceCount) {
        info = loadingText[spaceCount - 1];
      }
    }
    if (levelIs('loaded')) {
      info = '- press enter to start -';
    }
    if (levelIs('backToSpace')) {
      info = '- backspace -';
      loadLevel('backspace');
    }
    if (levelIs('timerIntro')) {
      info = 'wait 10 sec';
      loadLevel('wait');
    }
    if (levelIs('wait')) {
      if (prevInput > 10000) {
        info = 'gj';
        loadLevel('level1');
      } else {
        info = 'wait 15 sec';
      }
    }
    if (levelIs('level1')) {
      if (level1Text.length - 1 >= spaceCount) {
        info = level1Text[spaceCount];
      } else {
        loadLevel('level2');
      }
    }
    if (levelIs('level2')) {
      if (level2Text.length - 1 >= spaceCount) {
        info = level2Text[spaceCount];
      } else {
        loadLevel('level3');
      }
    }
    if (levelIs('level3')) {
      if (level3Text.length - 1 >= spaceCount) {
        info = level3Text[spaceCount];
      } else {
        loadLevel('level4');
      }
    }

    if (levelIs('level4')) {
      if (level4Text.length - 1 >= spaceCount) {
        info = level4Text[spaceCount];
      } else {
        loadLevel('level5');
      }
    }

    if (levelIs('level5')) {
      if (level5Text.length - 1 >= spaceCount) {
        info = level5Text[spaceCount];
      }
    }

    if (levelIs('level6')) {
      if (level6Text.length - 1 >= spaceCount) {
        if (level6Text.length - 1 == spaceCount) {
          document.getElementsByTagName("audio")[0].play();
        }
        info = level6Text[spaceCount];
      }
    }
  }
  if (keycode === 13) {
    if (levelIs('loaded')) {
      loadLevel('backToSpace');
      info = '- back to space -';
    }
  }
  if (keycode === 8) {
    if (levelIs('backspace')) {
      info = 'see the timer?';
      loadLevel('timerIntro');
    }
  }
  if (keycode === 65) {
    if (levelIs('level5')) {
      info = 'yey';
      loadLevel('level6');
    }
  }

  if (keycode === 66) {
    if (levelIs('level5')) {
      info = 'are you sure?'
      loadLevel('level5');
    }
  }
}
