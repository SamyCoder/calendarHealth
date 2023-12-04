
import pandas as pd

def process_data(file_path, output_path):
    # Read the CSV file into a DataFrame
    df = pd.read_csv('/Users/rujula/Desktop/HCI/proj/calendarHealth/public/database/Nov19.csv')

    # Convert 'date' to datetime and extract date and hour
    df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d-%H:%M')
    df['date_without_time'] = df['date'].dt.date
    df['hour'] = df['date'].dt.hour

    # Group by the new date and hour columns and calculate the average, minimum, and maximum
    grouped = df.groupby(['date_without_time', 'hour']).agg({
        'average': 'mean',
        'minimum': 'min',
        'maximum': 'max'
    }).reset_index()

    # Save the aggregated data to a new CSV file
    grouped.to_csv('/Users/rujula/Desktop/HCI/proj/calendarHealth/public/database/testing.csv', index=False)

