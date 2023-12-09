import json
import csv
from datetime import datetime
from collections import defaultdict

# Read JSON data from file
with open('dec6.json', 'r') as file:
    json_data = json.load(file)

# Dictionary to store aggregated data
aggregated_data = defaultdict(lambda: {'count': 0, 'total_bpm': 0, 'max_bpm': float('-inf'), 'min_bpm': float('inf')})

# Process each JSON object
for entry in json_data:
    # Parse the dateTime string to a datetime object
    dt_object = datetime.strptime(entry["dateTime"], "%m/%d/%y %H:%M:%S")
    
    # Extract date and hour information
    date_key = dt_object.strftime("%m/%d/%y")
    hour_key = dt_object.hour

    # Update aggregated data
    aggregated_data[(date_key, hour_key)]['count'] += 1
    bpm_value = entry["value"]["bpm"]
    aggregated_data[(date_key, hour_key)]['total_bpm'] += bpm_value
    aggregated_data[(date_key, hour_key)]['max_bpm'] = max(aggregated_data[(date_key, hour_key)]['max_bpm'], bpm_value)
    aggregated_data[(date_key, hour_key)]['min_bpm'] = min(aggregated_data[(date_key, hour_key)]['min_bpm'], bpm_value)

# Calculate averages
averages = {key: data['total_bpm'] / data['count'] for key, data in aggregated_data.items()}

# Print results
#for (date, hour), data in aggregated_data.items():
#    print(f"{date} {hour:02d}:00 - {hour + 1:02d}:00")
#    print(f"Average BPM: {averages[(date, hour)]:.2f}")
#    print(f"Max BPM: {data['max_bpm']}")
#    print(f"Min BPM: {data['min_bpm']}")
#    print("---")

# Write results to CSV
csv_file_path = 'outputXOXO.csv'
field_names = ['date', 'hour', 'average', 'minimum', 'maximum']

with open(csv_file_path, 'w', newline='') as csv_file:
    csv_writer = csv.DictWriter(csv_file, fieldnames=field_names)
    
    # Write header
    csv_writer.writeheader()

    # Write data rows
    for (date, hour), data in aggregated_data.items():
        csv_writer.writerow({
            'date': date,
            'hour': hour,
            'average': averages[(date, hour)],
            'minimum': data['min_bpm'],
            'maximum': data['max_bpm']
        })

