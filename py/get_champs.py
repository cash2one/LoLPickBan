import shutil
from typing import List

import requests

from riot_api import key

riot_image_url = 'https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/'
riot_static_url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/'


def get_version() -> str:
    url = riot_static_url + 'versions?api_key={key}'.format(key=key)
    return requests.get(url).json()[0]


def get_champion_keys() -> List[str]:
    champion_keys = []
    url = riot_static_url + 'champion?champData=image&api_key={key}'.format(key=key)
    data = requests.get(url).json()['data'].values()

    for champ in data:
        if champ['name'] == 'Fiddlesticks':
            champion_keys.append('Fiddlesticks.png')  # bug on Riot's end
        else:
            champion_keys.append(champ['image']['full'])

    return champion_keys


def download_champion_images():
    champion_keys = get_champion_keys()
    version = get_version()

    url = riot_image_url.format(version=version)

    for champ in champion_keys:
        new_url = url + champ
        img = requests.get(new_url, stream=True)
        with open('../img/{champ}'.format(champ=champ), 'wb') as out_file:
            shutil.copyfileobj(img.raw, out_file)
        del img  # remove from memory


def generate_html():
    icon_size = 64
    champion_keys = sorted(get_champion_keys())
    with open('../champs.html', 'w') as out:
        for champ in champion_keys:
            src = 'img/' + champ
            c_id = champ.split('.png')[0]

            s = '<img class="Grid-cell" src="{src}" width="{i}" height="{i}" draggable="true" ondragstart="drag(event)" id="{id}">'. \
                format(src=src, i=icon_size, id=c_id)
            out.write(s)


download_champion_images()
generate_html()
