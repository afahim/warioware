Rapid Frame
===========

About
-----

**Rapid Frame** is an educational game framework associated with 
TechBridgeWorld. The target audience of this game was origianaly the students at
The AWSAJ Academy in Doja Qatar. It can be related to games 
like WarioWare in that it is composed of many micro-games that last around 10 
seconds or less. The educational aspect is semlessly inserted inbetween games 
as if each question is just anothher micro-game. 

Installation
-------------

Download the framework and host it on any Apache server. Once on a server, simply open the index.html file in the browser of your choice (we recommend Chrome!). Once you have copied the project into the public directory of your server, simply point the browser to "localhost", and you should be able to start using the Rapid Frame framework.

If you don't have an Apache server, we recommend using the following integrated environments.

**Mac OSX** - We recommend using MAMP.

http://www.mamp.info/en/

**Windows** - We recommend using WAMP.

http://www.wampserver.com/en/


Developing a new game
---------------------

Creating a game for the RapidFrame collection is really easy. Just follow these steps!

1. Clone the template folder in the "games" directory and rename it with the name of your game.
2. Open the "game.js" file inside your newly created folder.
2. Uncomment the javascript code and replace "template" with whatever you want to call your game.
3. Insert your code in startGame() and endGame() funcitons respectively to implement your game logic.
4. Open "gamesList.html" file and add a script tag using the instructions given on in the gamesList.html file.

The framework provides you with a canvas element and we encourage you to create your games on the canvas element. This element can be accesssed using the following line of javascript.
```
var canvas = document.getElementById("canvas");
```
However we don't restrict you to sticking to canvas based games only, and you are welcome to create any HTML elements inside the canvas element, and add any CSS to these elements by definining a CSS file inside your game folder. However be sure to delete all these HTML elements that you create inside the endGame() funciton of your game.

You are welcome to use audio files and images inside your game. Just be sure to put all these files inside your game folder.

**Referencing files** - If you want to refer any file inside your game.js file, make sure you provide the full path from the root directory. For example, if the file you are trying to reference inside your game folder is called "image.png", the game you are making is called "mygame" and the file is located at games/mygame/image.png, then the path would be "./games/mygame/image.png".

