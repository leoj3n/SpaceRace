// Create a client + MongoDB collection

Options   = new Meteor.Collection( "options" );   // general options
Mysteries = new Meteor.Collection( "mysteries" ); // the mystery possibilities
Stories   = new Meteor.Collection( "stories" );   // users submit these, also contains: mysteryID, upvotes

//
// CLIENT
//

if( Meteor.isClient ) {
  //
  // STARTUP
  //

  Meteor.startup( function() {
    console.log( "Blast off! (client)" );
  });

  // 
  // TEMPLATE STUFF
  // 

  // @return Array (of options)
  Template.SpaceRace.options = function () {
    return Options.find( {} );
  };

  // @return Array (of stories, sorted by upvotes)
  Template.SpaceRace.stories = function () {
    return Stories.find( {}, { sort: { upvotes: -1 } } );
  };

  // get ObjectID of selected story for user (using session.get)
  // @return Integer (ObjectID???)
  Template.SpaceRace.selected_story = function () {
    var story = Stories.findOne( Session.get( "selected_story" ) );
    return story && story._id;
  };

  // Is selected_story (in session) == story._id?
  // @return String (or empty string)
  Template.story.selected = function () {
    return Session.equals( "selected_story", this._id ) ? "selected" : '';
  };

  // 
  // EVENT STUFF
  // 

  // SpaceRace events
  Template.SpaceRace.events({

    'click input.inc': function () {
      Stories.update( Session.get( "selected_story" ), { $inc: { upvotes: 1 } } );
    },

    'submit form.story': function () {
      var val = $("#storyInput").val();

      Stories.insert( { text: val, mystery: 0, upvotes: 0 } );

      return false; // prevent form submission
    }

  });

  // stories events
  Template.story.events({

    // set selected option (in session) on click of option name
    'click': function () {
      Session.set( "selected_story", this._id );
    }

  });
}

//
// SERVER
//

if( Meteor.isServer ) {
  Meteor.startup( function() {

    // initialize options if none exist
    if( Mysteries.find().count() === 0 ) {
      var mysteries = ["Swap Places",
                       "Lose an Asteroid",
                       "Lose Money",
                       "Skip Turn",
                       "Steal Asteroid"]; // because...

      /*var controls = ["Mining resources run out!",
                      "You found gold!"]; // therefore you...*/

      for (var i = 0; i < mysteries.length; i++)
        Mysteries.insert( { name: mysteries[i] } );
    }

  });
}

// random snippit of code...: Math.floor(Random.fraction()*10)*5
