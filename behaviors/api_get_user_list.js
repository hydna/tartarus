var message;
var items;

message = {
  "method": "user-list",
  "params": []
};

items = channel.findall("users");
items.forEach(function(item) {
  var splitted = item.split(":");

  message.params.push({
    "id": splitted[0],
    "type": parseInt(splitted[1]),
    "name": splitted[2]
  });
});


connection.reply(JSON.stringify(message));
