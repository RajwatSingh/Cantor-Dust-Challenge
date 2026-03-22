import requests

# Test prediction
files = {'file': open('path/to/test/image.jpg', 'rb')}
response = requests.post('http://localhost:8000/predict', files=files)
print(response.json())

# Test history
response = requests.get('http://localhost:8000/history')
print(response.json())
