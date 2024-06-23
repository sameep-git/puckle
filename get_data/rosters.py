import requests
import json

# Get three letter abbreviations of teams
team_response = requests.get("https://api.nhle.com/stats/rest/en/team")
team_json = json.loads(team_response.text)

team_abbr = []

for team in team_json["data"]:
    team_abbr.append(team["triCode"])
    
for team in team_abbr:
    print(team)