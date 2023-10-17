import requests
from bs4 import BeautifulSoup
import os
import json

# Set the PYTHONIOENCODING environment variable to UTF-8
os.environ['PYTHONIOENCODING'] = 'utf-8'

def map_difficulty(difficulty_text):
    # Mapping textual representations to integers
    difficulty_map = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        '-': None  # For null values
    }

    # Convert textual representation to the corresponding integer
    return difficulty_map.get(difficulty_text, None)

def scrape_data(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    tbody = soup.find('tbody')
    
    if tbody:
        rows = tbody.find_all('tr')
        songs_data = []
        
        for row in rows:
            song_name_tag = row.find('th')
            artist_tag = row.find('th').find('p')
            difficulty_tags = row.find_all('td')
            papamama_tag = row.find('td', class_='papamama')

            if song_name_tag and artist_tag and len(difficulty_tags) >= 5:
                song_name = song_name_tag.text.strip()
                artist = artist_tag.text.strip()
                
                # Check for presence of 'papamama' class to set boolean value
                papamama = True if papamama_tag else False

                difficulties = []
                for tag in difficulty_tags:
                    difficulty_text = tag.text.strip()
                    mapped_difficulty = map_difficulty(difficulty_text)
                    if mapped_difficulty is not None:
                        difficulties.append(mapped_difficulty)
                
                # Ensure difficulties list has 5 elements, fill missing values with None
                while len(difficulties) < 5:
                    difficulties.append(None)

                song_data = {
                    'songName': song_name,
                    'songArtist': artist,
                    'papamama': papamama,
                    'kantan': difficulties[0],
                    'futsuu': difficulties[1],
                    'muzukashii': difficulties[2],
                    'oni': difficulties[3],
                    'uraOni': difficulties[4]
                }
                
                songs_data.append(song_data)
        
        return songs_data

    else:
        print("No tbody element found.")
        return []

if __name__ == "__main__":
    url = "https://taiko.namco-ch.net/taiko/songlist/variety.php#sgnavi"
    data = scrape_data(url)

    # Create a list of dictionaries
    songs_list = []
    for item in data:
        song_name = item['songName'] if item['songName'] else ''
        song_artist = item['songArtist'] if item['songArtist'] else ''
        papamama = item['papamama']
        kantan = item['kantan'] if item['kantan'] is not None else ''
        futsuu = item['futsuu'] if item['futsuu'] is not None else ''
        muzukashii = item['muzukashii'] if item['muzukashii'] is not None else ''
        oni = item['oni'] if item['oni'] is not None else ''
        ura_oni = item['uraOni'] if item['uraOni'] is not None else ''

        # Create a dictionary for each song and append it to the list
        song_data = {
            'songName': song_name,
            'songArtist': song_artist,
            'papamama': papamama,
            'kantan': kantan,
            'futsuu': futsuu,
            'muzukashii': muzukashii,
            'oni': oni,
            'uraOni': ura_oni
        }
        songs_list.append(song_data)

    # Serialize the list of dictionaries into a JSON object
    with open('output.json', 'w', encoding='utf-8') as json_file:
        json.dump(songs_list, json_file, ensure_ascii=False, indent=4)
