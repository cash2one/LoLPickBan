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

  if (checkFullTeams()) {
    analyzeTeams();
  }
}

function reset() {
  var imgs = document.getElementsByTagName('img');
  var nodes = Array.prototype.slice.call(imgs, 0);
  nodes.forEach(function (i) {
    if (i.parentNode.id.startsWith('mirror')) {
      $(i.parentNode).empty();
    } else if (i.parentNode.id != 'champs') {
      document.getElementById('champs').appendChild(i);
    }
  });
  $('#analyze').css('visibility', 'hidden');
  sort();
}

function removeEventListeners() {
  for (var i = 1; i <= 2; i++) {
    for (var j = 1; j <= 5; j++) {
      var str = i + '-' + j;
      document.getElementById('ban' + str).removeEventListener('dblclick', remove);
      document.getElementById('pick' + str).addEventListener('dblclick', remove);
    }
  }
}

function addEventListeners() {
  for (var i = 1; i <= 2; i++) {
    for (var j = 1; j <= 5; j++) {
      var str = i + '-' + j;
      document.getElementById('ban' + str).addEventListener('dblclick', remove);
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
  if (divElement.hasChildNodes()) {
    document.getElementById('champs').appendChild(divElement.lastChild);
    sort();
  }
}

function checkFullTeams() {
  for (var i = 1; i <= 2; i++) {
    for (var j = 1; j <= 5; j++) {
      var str = i + '-' + j;
      if (!document.getElementById('pick' + str).hasChildNodes()) {
        return false;
      }
    }
  }
  return true;
}

function analyzeTeams() {
  $('#analyze').css('visibility', 'visible');

  for (var i = 1; i <= 2; i++) {
    var divs = document.getElementById('stats' + i + '-6').children[0].children;
    for (var j = 0; j < divs.length; j++) {
      divs[j].innerHTML = "0";
    }
  }

  for (var i = 1; i <= 2; i++) {
    var totalDamage = 0, physicalDamage = 0, magicDamage = 0, trueDamage = 0;
    for (var j = 1; j <= 5; j++) {
      var str = i + '-' + j;
      var pick = document.getElementById('pick' + str);
      var mirror = document.getElementById('mirror' + str);
      var statsDiv = document.getElementById('stats' + str);

      mirror.innerHTML = pick.innerHTML;
      statsDiv.innerHTML = pick.childNodes[0].id;

      var dmgData = makeChampionStats(pick.childNodes[0].id, mirror);
      // totalDamage += dmgData[0];
      // physicalDamage += dmgData[1];
      // magicDamage += dmgData[2];
      // trueDamage += dmgData[3];
    }


    // var desc = '<div class="dmgBreakdown">';
    // desc += '<div class="totalDamage">' + totalDamage + ' dmg</div>';
    // desc += '<div class="physicalDamage">' + physicalDamage + '%</div>';
    // desc += '<div class="magicDamage">' + magicDamage + '%</div>';
    // desc += '<div class="trueDamage">' + trueDamage + '%</div>';
    // desc += '</div>';
    //
    // document.getElementById('stats' + i + '-6').innerHTML = desc;
  }
}

function makeDamageProportions(champion, data, div) {
  // console.log('Initial call for ' + champion + ' on div');
  // console.log(div);

  var positionLookup = {
    1: 'Top',
    2: 'Jungle',
    3: 'Middle',
    4: 'ADC',
    5: 'Support'
  };

  var position = positionLookup[div.id.substr(div.id.length - 1)];
  var dmg = data[0]['dmgComposition'];
  var totalDamage = data[0]['totalDamageDealtToChampions']['val'];

  for (var i = 0; i < data.length; i++) {
    if (data[i]['role'] == position) {
      dmg = data[i]['dmgComposition'];
      totalDamage = data[i]['totalDamageDealtToChampions']['val'];
    }
  }

  var divId = div.id.substr(div.id.length - 3);
  var statsDiv = document.getElementById('stats' + divId);

  var desc = '<div class="dmgBreakdown">';
  desc += '<div class="totalDamage">' + totalDamage + ' dmg</div>';
  desc += '<div class="physicalDamage">' + dmg['physicalDmg'] + '%</div>';
  desc += '<div class="magicDamage">' + dmg['magicDmg'] + '%</div>';
  desc += '<div class="trueDamage">' + dmg['trueDmg'] + '%</div>';
  desc += '</div>';

  statsDiv.innerHTML = desc;

  var totalPhys = dmg['physicalDmg'] / 100.0 * Number(totalDamage);
  var totalMagic = dmg['magicDmg'] / 100.0 * Number(totalDamage);
  var totalTrue = dmg['trueDmg'] / 100.0 * Number(totalDamage);

  var teamDiv = document.getElementById('total-dmg-' + div.id.charAt(div.id.length - 3));

  for (var i = 0; i < teamDiv.childNodes.length; i++) {
    var updateDiv = teamDiv.childNodes[i];
    var value = 0;

    switch (updateDiv.className) {
      case 'totalDamage':
        value = Number(totalDamage);
        break;
      case 'physicalDamage':
        value = totalPhys;
        break;
      case 'magicDamage':
        value = totalMagic;
        break;
      case 'trueDamage':
        value = totalTrue;
        break;
    }

    updateDiv.innerHTML = Math.round(Number(updateDiv.innerHTML) + value);
  }

  //return [Number(totalDamage), totalPhys, totalMagic, totalTrue];
}

function makeChampionStats(champion, div) {
  // okay, yes, I know exposing this is bad, but there is no easy solution to this
  // I'm sorry champion.gg and TSM for this
  var apiKey = 'c256ea4f3444640dfac6a85c4168cf5e';

  $.ajax({
    type: 'GET',
    url: 'https://api.champion.gg/champion/' + champion + '/general?api_key=' + apiKey,
    success: function (data) {
      makeDamageProportions(champion, data, div);
    },
    error: function (data) {
      console.log('returned error');
    }
  });
}

$(document).ready(function () {
  reset();
});