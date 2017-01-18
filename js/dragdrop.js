// http://www.w3schools.com/html/html5_draganddrop.asp

function sort() {
  tinysort('#champs > img', {attr: 'id'});
  removeEventListeners();
  addEventListeners();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var movingChamp = ev.dataTransfer.getData("text");
  if (ev.target.tagName == 'IMG') {
    var targetParent = ev.target.parentNode;
    var originalParent = document.getElementById(movingChamp).parentNode;

    if (originalParent.id != 'champs') {
      originalParent.appendChild(document.getElementById(ev.target.id));
    } else {
      moveToChamps(targetParent);
    }

    targetParent.appendChild(document.getElementById(movingChamp));
    sort();
  } else {
    ev.target.appendChild(document.getElementById(movingChamp));
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

function removeEventListeners() {
  for (var i = 1; i <= 2; i++) {
    for (var j = 1; j <= 5; j++) {
      var str = i + '-' + j;
      if (j <= 3) {
        document.getElementById('ban' + str).removeEventListener('dblclick', remove);
      }

      document.getElementById('pick' + str).addEventListener('dblclick', remove);
    }
  }
}

function addEventListeners() {
  for (var i = 1; i <= 2; i++) {
    for (var j = 1; j <= 5; j++) {
      var str = i + '-' + j;
      if (j <= 3) {
        document.getElementById('ban' + str).addEventListener('dblclick', remove);
      }

      document.getElementById('pick' + str).addEventListener('dblclick', remove);
    }
  }
}

function remove(event) {
  if (event.srcElement.tagName == 'IMG') {
    moveToChamps(event.srcElement.parentNode);
  }
}

// Make SURE that this is a div element and not an img element
function moveToChamps(divElement) {
  document.getElementById('champs').appendChild(divElement.lastChild);
  sort();
}

$(document).ready(function () {
  sort();
});