import requests
import json

# Get three letter abbreviations of teams
team_response = requests.get("https://api.nhle.com/stats/rest/en/team")
team_json = json.loads(team_response.text)

# team_abbr contains all the three-letter abbreviations of all NHL franchises ever (includes inactive and future teams)
team_abbr = []

for team in team_json["data"]:
    team_abbr.append(team["triCode"])

for team in team_abbr:
    roster_response = requests.get(f"https://api-web.nhle.com/v1/roster/{team}/current")
    print(roster_response)
    if roster_response.status_code == 200:
        roster_json = json.loads(roster_response.text)
        with open(f'get_data/team_rosters/{team}.json', 'w', encoding='utf-8') as f:
            json.dump(roster_json, f, ensure_ascii=False, indent=4)