import requests
import json

with open('output.json') as f:
    data = json.load(f)

payload_template = {
    "event_key": "2025mrcmp",
    "scouted_by": ["7414", "103"],
    "data": None
}

for i in range(0, len(data), 50):
    chunk = data[i:i+50]
    payload = payload_template.copy()
    payload["data"] = chunk
    response = requests.post('http://localhost:3000/submit', json=payload)
    if response.status_code != 200:
        print(f'Error sending {chunk} to server: {response.text}')
    else:
        print(f'Sent {chunk} to server successfully')

