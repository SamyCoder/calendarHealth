import pandas as pd
import os

def process_data():
    # Read the CSV file into a DataFrame
    df = pd.read_csv('/Users/rujula/Desktop/User2S/5DEC.csv')

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

    # Ensure all hours of the day are represented for each date
    all_hours = pd.DataFrame({'hour': range(24)})
    dates = grouped['date_without_time'].unique()
    full_df_list = []

    for date in dates:
        dated_df = grouped[grouped['date_without_time'] == date]
        merged = pd.merge(all_hours, dated_df, on='hour', how='left')
        merged['date_without_time'] = date  # Set the date
        full_df_list.append(merged)

    full_df = pd.concat(full_df_list)

    # Fill missing values for average, minimum, and maximum with 0 and round them
    full_df[['average', 'minimum', 'maximum']] = full_df[['average', 'minimum', 'maximum']].fillna(0).round()

    # Prepare the final DataFrame in the specified format
    output_df = pd.DataFrame({
        'date': full_df['date_without_time'].apply(lambda x: x.strftime('%d/%m/%y')),
        'hour': full_df['hour'],
        'average': full_df['average'],
        'minimum': full_df['minimum'],
        'maximum': full_df['maximum']
    })

    file_path='/Users/rujula/Desktop/User2S/User2S.csv'
    if os.path.exists(file_path):
        # Append without header
        output_df.to_csv(file_path, mode='a', header=False, index=False)
    else:
        # Write with header
        output_df.to_csv(file_path, index=False)

process_data()
