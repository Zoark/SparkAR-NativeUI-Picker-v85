// Objects - NativeUI Picker example v85
// by Luke Hurd :: @lukehurd

// WHAT HAS CHANGED FROM PREVIOUS VERSIONS//

// In order to load Textures, Materials, and Objects, we must 
// now use something in Javascript called "Promises". The basic
// concept is Spark AR now wants to make sure these assets are 
// available to the script to manipulate before executing any code.

// When loading assets, find() has been changed to findFirst() and findAll()

// Load the modules
const Scene = require('Scene');
const Materials = require('Materials');
const NativeUI = require('NativeUI');
const Textures = require('Textures');
const Animation = require('Animation');
const Diagnostics = require('Diagnostics');

// First, we create a Promise and load all the assets we need for our scene
// The following example shows how to load Textures, Materials, and an Object.

Promise.all([

    // Loading Textures for the buttons
    Textures.findFirst('1'),
    Textures.findFirst('2'),
    Textures.findFirst('3'),

    // Loading the Materials we are switching on the plane
    Materials.findFirst('red'),
    Materials.findFirst('green'),
    Materials.findFirst('blue'),

    // Loading the plane
    Scene.root.findFirst('plane0'),
    Scene.root.findFirst('plane1'),
    Scene.root.findFirst('plane2'),

// Now, we wait for a "go ahead" from the script to let us know when
// we can start using our assets and creating the NativeUI Picker

]).then(function(results){

    // Assets are loaded, so let's set them all so we can use them later in the script.
    // The assets are all returned in an object called "results" in the order that we 
    // loaded them. Remember, the index starts at 0 so the first asset is always results[0],
    // the next is results[1], etc.

    // First, we set the buttons for the NativeUI Picker
    const button1 = results[0];
    const button2 = results[1];
    const button3 = results[2];

    // Next, we set the materials for the plane
    const red = results[3];
    const green = results[4];
    const blue = results[5];

    // Finally, we set the planes
    const plane0 = results[6];
    const plane1 = results[7];
    const plane2 = results[8];

    // Now, we can finally start building the NativeUI Picker
    const configuration = {

      // This index controls where the NativeUI Picker starts.
      // Let's keep things simple for now and start on the first 
      // button, so we keep it at 0. Remember most things start at 0, not 1.
      selectedIndex: 0,

      // These are the image textures to use as the buttons in the NativeUI Picker
      items: [
        {image_texture: button1},
        {image_texture: button2},
        {image_texture: button3}
      ],

      // These are the materials we are switching between on the plane
      mats: [
        {material: red},
        {material: green},
        {material: blue}
      ]

    };

    // Create the NativeUI Picker
    const picker = NativeUI.picker;

    // Load our configuration
    picker.configure(configuration);

    // Show the NativeUI Picker
    picker.visible = true;

    // This is a monitor that watches for the picker to be used.
    picker.selectedIndex.monitor().subscribe(function(val) {

      // When a button is selected, we select a corresponding plane.
      // Using the index of the selected button (0,1,2,etc), we can
      // use build switches all sorts of ways.
      // In this example, we are going to keep it dead simple with a JS switch.
      
      // Create an empty variable
      let selectedPlane;

      // Pass the index to the switch to determine which plane should rotate
      switch(val.newValue) {
        case 0: {
           selectedPlane = plane0;
           break;
        }
        case 1: {
          selectedPlane = plane1;
           break;
        }
        case 2: {
          selectedPlane = plane2;
           break;
        }
      }

      // Passing the same index, we select the corresponding material.
      // When they pick the first button then the first material loads, etc
      selectedPlane.material = configuration.mats[val.newValue].material
    
      //Create a timeDriver
      var tD = Animation.timeDriver({durationMilliseconds: 1000, loopCount: 1, mirror: false});
      
      // Create an Animation that goes from 0 - 6
      var spin = Animation.animate(tD, Animation.samplers.linear(0, 6));
      
      // Pass the Animation values rotate the plane on the Z axis 
      selectedPlane.transform.rotationZ = spin;
      
      // Start the Animation
      tD.start();

    });

});

//HELP AND NOTES

// If you do not see your NativeUI icons on the screen make sure
// compression is disabled on any textures that you are using for
// the NativeUI. Sometimes they can get switched back.

// Remember, everything starts at a 0 index, not 1. Sometimes this
// can be tricky and you might load an incorrect asset.

// If you have copied this script and are getting an error, make sure
// the NativeUI Picker is enabled in your Project's Capabilities.