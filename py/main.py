import requests
import shutil


def get_version():
	url = f'https://na1.api.riotgames.com/lol/static-data/v3/versions?api_key={api_key}'
	return requests.get(url).json()[0]

def get_champions(version: str):
	url = f'http://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json'
	return requests.get(url).json()

def champ_name_to_image_url(version, champ_name):
	url = f'http://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champ_name}.png'
	return url

def download_image(url, champ_name):
	img = requests.get(url, stream=True)
	with open(f'../img/{champ_name}.png', 'wb+') as fp:
		shutil.copyfileobj(img.raw, fp)

def generate_html(champ_names):
	icon_size = 64
	s = ''
	for chn in champ_names:
		s += f'<img class="Grid-cell" src="img/{chn}.png" width="{icon_size}" height="{icon_size}" draggable="true"'
		s += f' ondragstart="drag(event)" id="{chn}">\n'
	return s

if __name__ == '__main__':
	api_key = input('Enter API key: ')
	version = get_version()
	champs = get_champions(version)
	for ch_name in champs['data'].keys():
		print(f'Downloading {ch_name}...', flush=True)
		download_image(champ_name_to_image_url(version, ch_name), ch_name)
	html = generate_html(list(champs['data'].keys()))
	with open('../champs.html', 'w+') as fp:
		fp.write(html)
