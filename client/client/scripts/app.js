var clientUrl = 'http://127.0.0.1:3000/classes/messages';
var roomsArray = [];
var friendsList = [];

var userName = window.location.search.substring(window.location.search.indexOf('=') + 1, window.location.search.length);


var App = function() {
  this.server = clientUrl;
  this.currentUser = userName;
  this.currentRoom;
};

var app = new App();

App.prototype.init = function() {
  this.fetch();

  // var $friends = $('#friends');
  // // $friends.empty();

  // if (friendsList.length > 0) {
  //   $friends.append(document.createTextNode('NONE'));
  // } else {
  //   friendsList.forEach(function(friend) {
  //     $friends.append(document.createTextNode(friend));
  //   });
  // }
};



App.prototype.hasEscape = function(message) {
  var pattern = new RegExp(/[~`!@_#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);

  if (pattern.test(message.username) || pattern.test(message.text) || pattern.test(message.roomname)) {
    return true;
  }
  return false;
};

App.prototype.fetch = function(newData) {
  var context = this;

  $.ajax({
    url: context.server,
    // data: 'order=-createdAt',
    contentType: 'text/plain',
    type: 'GET',
    success: function(data) {
      context.clearMessages();

      data.results.forEach(function(message) {

        if (!context.hasEscape(message)) {
          if (newData !== undefined) {
            if (message.roomname === newData) {
              context.renderMessage(message);
            }
          } else {
            context.renderMessage(message);
          }

          if (!roomsArray.includes(message.roomname)) {
            roomsArray.push(message.roomname);
          }
        }
      });
      context.populateRoomsList();
    },
    error: function(data) {
      console.log('failed to fetch data', data);
    }
  });
};


App.prototype.populateRoomsList = function() {

  if ($('#roomSelect').children().length > 0) {
    $('#roomSelect').empty();
  }

  if (this.currentRoom === undefined) {
    this.currentRoom = roomsArray[0];
  }
  // DOM Manipulation
  roomsArray.forEach(function(roomname) {
    var roomAnchor = document.createElement('a');
    roomAnchor.setAttribute('class', roomname);
    roomAnchor.append(document.createTextNode(roomname));
    $('#roomSelect').append(roomAnchor);
  });
};

App.prototype.send = function(message) {
  console.log(message);

  var context = this;
  $.ajax({
    url: clientUrl,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'text/plain',
    success: function (data) {
      console.log('chatterbox: Message sent');
      context.fetch(app.currentRoom);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.clearMessages = function() {
  $('#chats').html('');
};

App.prototype.renderMessage = function(message) {
  var node = document.createElement('div');
  node.setAttribute('class', 'messageClass');

  var username = document.createElement('div');
  username.setAttribute('class', 'username');
  username.setAttribute('id', message.username);
  username.append(document.createTextNode(message.username + ':'));
  node.appendChild(username);

  var text = document.createElement('div');
  text.setAttribute('class', 'text');
  text.append(document.createTextNode(message.text));
  node.appendChild(text);

  var roomname = document.createElement('div');
  roomname.setAttribute('class', 'roomname');
  roomname.append(document.createTextNode(message.roomname));
  node.appendChild(roomname);

  var $chats = $('#chats');
  $chats.append(node);
};


App.prototype.renderRoom = function(roomText) {
  if (!roomsArray.includes(roomText)) {
    roomsArray.push(roomText);
  }
  this.populateRoomsList();
};


App.prototype.createMessage = function(username, text, roomname) {
  var message = {};

  message.username = username;
  message.text = text;
  message.roomname = roomname;

  this.send(message);
};

$(document).ready(function() {

  app.init();

  $('.createMessage').on('click', function(event) {
    var messageText = $('.newMessage').val();
    app.createMessage(app.currentUser, messageText, app.currentRoom);
  });

  $('#createRoom').on('click', function(event) {
    var roomText = $('.newRoom').val();
    app.clearMessages();
    app.currentRoom = roomText;
    $('#room').html(app.currentRoom);
    app.renderRoom(roomText);
  });

  $('#roomSelect').on('click', 'a', function(event) {
    app.currentRoom = this.textContent.trim();
    $('#room').html(app.currentRoom);
    app.fetch(app.currentRoom);
  });

  $('div').on('click', '.username', function(event) {
    if (!friendsList.includes(this.textContent.substring(this.textContent.indexOf(':'), 0))) {
      friendsList.push(this.textContent.substring(this.textContent.indexOf(':'), 0));
    }
    console.log(friendsList);
  });
});



