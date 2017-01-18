// http://www.w3schools.com/html/html5_draganddrop.asp

function sort() {
  tinysort('#champs > img', {attr: 'id'});
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  if (ev.target.tagName == 'IMG') {
    var node = ev.target.parentNode;
    document.getElementById('champs').appendChild(node.lastChild);
    node.appendChild(document.getElementById(data));
    sort();
  } else {
    ev.target.appendChild(document.getElementById(data));
  }
}

function reset() {
  var imgs = document.getElementsByTagName('img');
  var nodes = Array.prototype.slice.call(imgs, 0);
  nodes.forEach(function (i) {
    if (i.parentNode.id != 'champs') {
      document.getElementById('champs').appendChild(i);
    }
  });
  sort();
}

$(document).ready(function () {
  sort();
});