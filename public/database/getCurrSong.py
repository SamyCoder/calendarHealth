# import requests

#This file is basically connecting to the Spotify API to get the current song playing for the user. 


import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth

from datetime import datetime

import csv

csv_file_path = 'userXSpotify2.csv'

user = "a557233ec4e640d7a5236520b63c57d4"
passCode = "bf26901f4e1d453b8670f847ea6b442c"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=user, client_secret=passCode, redirect_uri='http://localhost:8000/callback', scope='user-read-playback-state user-modify-playback-state user-read-recently-played'))



## Current Playing Song Information

# current_track = sp.current_playback() 

# # Get the song name, artist
# song_name = current_track['item']['name']
# artists = current_track['item']['artists']
# artist_names = [artist['name'] for artist in artists]
# artist_name_str = ', '.join(artist_names) # Join artist names into a string

# # Print some information related to tracks
# print(f"Song Name: {song_name}")
# print(f"Artist(s): {artist_name_str}")

# print("Album:", current_track['item']['album']['name'])
# print("Is Playing:", current_track['is_playing'])
# print("Progress (ms):", current_track['progress_ms'])
# print("Duration (ms):", current_track['item']['duration_ms'])
# current_time = datetime.now()
# print("Hello! This is the date and time for the song play", current_time)
# # More details on the song
# print("Track ID:", current_track['item']['id'])
# print("Album URI:", current_track['item']['album']['uri'])


#### Get information on songs after a certain date

# Get the user's recently played tracks
recently_played = sp.current_user_recently_played()

# Filter tracks played after a certain date
cutoff_date = datetime(2023, 11, 1)
filtered_tracks = [track for track in recently_played['items'] if datetime.strptime(track['played_at'], "%Y-%m-%dT%H:%M:%S.%fZ") > cutoff_date]


field_names = ['Track Name', 'Artist Name', 'Album', 'Played At']

# Open the CSV file in write mode
with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
    # Create a CSV writer object
    csv_writer = csv.DictWriter(csv_file, fieldnames=field_names)

    # Write the header to the CSV file
    csv_writer.writeheader()

    # Write each track's information to the CSV file
    for track in filtered_tracks:
        track_name = track['track']['name']
        artist_name = track['track']['artists'][0]['name']
        album = track['track']['album']['name']
        
        played_at = track['played_at']

        print(f"{track_name} by {artist_name} IN album: {album}")
        print(played_at)

        # Write to the CSV
        csv_writer.writerow({
            'Track Name': track_name,
            'Artist Name': artist_name,
            'Album': album,
            'Played At': played_at
        })

print(f'Done! check {csv_file_path}')


