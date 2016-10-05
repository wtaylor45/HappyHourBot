var HTTPS = require('https');

var botID = process.env.BOT_ID;

var barList = ['arenas', 'santa fe', 'grain', 'iron hill', 'stone balloon', 'deer park', 'home grown', 'green turtle'];

var command;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\!happy hour \w*/i;

  if(request.text && botRegex.test(request.text)) {
    command = request.text;
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();  }
}

function postMessage() {
  var botResponse, options, body, botReq;
  var bar;

  bar = command.substring(12, command.lastIndexOf(" ", 12)-1);

  switch(bar.toLowerCase()){
    case "arenas":
      botResponse = "3-6pm";
      break;
    case "iron hill":
      botResponse = "5-7pm";
      break;
    case "stone balloon":
      botResponse = "3:30-6:30pm\n2-5pm weekends";
      break;
    case "santa fe":
      botResponse = "4-7pm";
      break;
    case "deer park":
      botResponse = "4-7pm";
      break;
    case "home grown":
      botResponse = "5-7pm";
      break;
    case "grain":
      botResponse = "3-6pm";
      break;
    case "green turtle":
      botResponse = "9pm-1am";
      break;
    case "help":
      botResponse = "Usage: !happy hour <bar name>\n\nAvailable Bars:\n"
      var i = 0;
      for(i = 0;i<barList.length;i++){
        botResponse += barList[i] + "\n";
      }
      break;
    default:
      botResponse = "No happy hour times found for "+ bar +"!\nFor help use '!happy hour help'";
      break;

  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
