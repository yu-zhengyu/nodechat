jQuery(function($){
   var socket = io.connect();
   var $messageForm = $('#send-message');
   var $messageBox = $('#message');
   var $chat = $('#chat');
   var $nicknameForm = $('#setNick');
   var $nicknameError = $('#nickNameError');
   var $nicknameBox = $('#nickname');
   
   $messageForm.submit(function(e){
      e.preventDefault();
      socket.emit('send message', $messageBox.val());
      $messageBox.val(''); 
   });
   
   $nicknameForm.submit(function(e) {
      e.preventDefault();
      socket.emit('new user', $nicknameBox.val(), function(data) { 
          if(data) {
              $('#nickName').hide();
              $('#contentWrap').show();
          } else {
              $nicknameError.html("This name is already exist.");
          }
      });
      $nicknameBox.val('');

   });
  

  socket.on('load message', function(docs) {
    for(var i = 0; i < docs.length; i++) {
      displaymes(docs[i]);
    }
  });

   socket.on('new message', function(data){
      displaymes(data);
   });

   function displaymes(data) {
    $chat.append("<div style=\"background-color:#87CEFA\">"  + Date().toLocaleString().slice(0, -14) + "<br/>" + data.nick + ": " + data.msg + "</div><br/>");
    var div = document.getElementById('chat');
    div.scrollTop = div.scrollHeight; 

   }
});