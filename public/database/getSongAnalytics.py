import pandas as pd

# Read the CSV file
csv_file_path = 'userXSpotify.csv'
df = pd.read_csv(csv_file_path)

# Using 'Played At' column to datetime and make it timezone-naive
df['Played At'] = pd.to_datetime(df['Played At']).dt.tz_localize(None)
top_info_list = []

# an empty list to store DataFrames
dfs = []

# Group by date and get the top 2 most frequent artists and albums
for date, group in df.groupby(df['Played At'].dt.date):
    # Print tracks information
    tracks_info = group[['Track Name', 'Artist Name', 'Album', 'Played At']]
#    print(f"\nTracks played on {date}:\n")
#    print(tracks_info)

    # Find the top 2 most frequent artists and albums
    top_artists = group['Artist Name'].value_counts().nlargest(2)
    top_albums = group['Album'].value_counts().nlargest(2)

    # Store top artists information in DataFrame
    for artist, count in top_artists.items():
        top_info_list.append({'date': date, 'type': 'artist', 'value': f"{artist}: {count} times"})
 
    # Store top albums information in DataFrame
    for album, count in top_albums.items():
        top_info_list.append({'date': date, 'type': 'album', 'value': f"{album}: {count} times"})

#    print(f"\nTop 2 Most Frequent Artists:")
#    for artist, count in top_artists.items():
#        print(f"{artist}: {count} times")
#
#    print("\nTop 2 Most Frequent Albums:")
#    for album, count in top_albums.items():
#        print(f"{album}: {count} times\n")

    # Convert the list to a DataFrame, write to csv
    top_info_df = pd.DataFrame(top_info_list)
    top_info_df.to_csv('musicInfoDaily.csv', index=False)

    # Calculate time intervals during the day
    time_intervals = pd.date_range(start=date, end=date + pd.DateOffset(days=1), freq='H')
    track_playing_info = []

    for interval_start, interval_end in zip(time_intervals[:-1], time_intervals[1:]):
        tracks_during_interval = group[
            (group['Played At'] >= interval_start) & (group['Played At'] < interval_end)
        ]

        if not tracks_during_interval.empty:
            track_playing_info.append({'date': date, 'interval': f"{interval_start.strftime('%H:%M')} - {interval_end.strftime('%H:%M')}", 'status': 'Playing'})
        else:
            track_playing_info.append({'date': date, 'interval': f"{interval_start.strftime('%H:%M')} - {interval_end.strftime('%H:%M')}", 'status': 'Not Playing'})

    # Convert track_playing_info to DataFrame, append to list
    track_playing_df = pd.DataFrame(track_playing_info)
    dfs.append(track_playing_df)


# Concatenate all DataFrames from list, to write to csv
result_df = pd.concat(dfs, ignore_index=True)
result_df.to_csv('musicInfoHour.csv', index=False)

#    print("\nTrack Playing Information:")
#    for info in track_playing_info:
#        print(info)
#        print(date)

    
