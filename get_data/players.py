import json
import os

players = []

# Division lists with team abbr
atlantic = ["BOS", "BUF", "DET", "FLA", "MTL", "OTT", "TBL", "TOR"]
metro = ["CAR", "CBJ", "NJD", "NYI", "NYR", "PHI", "PIT", "WSH"]
central = ["CHI", "COL", "DAL", "MIN", "NSH", "STL", "UTA", "WPG"]
pacific = ["ANA", "CGY", "EDM", "LAK", "SEA", "SJS", "VAN", "VGK"]

def get_division(team):
    if team in atlantic: return "ATL"
    elif team in metro: return "MET"
    elif team in central: return "CEN"
    elif team in pacific: return "PAC"
    else: return "Error: team not found"

rosters_dir = 'get_data/team_rosters'
for roster_dir in os.listdir(rosters_dir):
    roster = open(os.path.join(rosters_dir, roster_dir))
    roster_data = json.load(roster)
    for forward in roster_data["forwards"]:
        player = {}
        try:
            player["Team"] = roster_dir[:3]
            player["Division"] = get_division(player["Team"])
            player["Name"] = forward["firstName"]["default"] + " " + forward["lastName"]["default"]
            player["Sweater"] = forward["sweaterNumber"]
            player["Position"] = forward["positionCode"]
            player["BirthDate"] = forward["birthDate"]
            player["Country"] = forward["birthCountry"]
        except:
            continue
        else:
            players.append(player)
    
    for defenseman in roster_data["defensemen"]:
        player = {}
        try:
            player["Team"] = roster_dir[:3]
            player["Division"] = get_division(player["Team"])
            player["Name"] = defenseman["firstName"]["default"] + " " + defenseman["lastName"]["default"]
            player["Sweater"] = defenseman["sweaterNumber"]
            player["Position"] = defenseman["positionCode"]
            player["BirthDate"] = defenseman["birthDate"]
            player["Country"] = defenseman["birthCountry"]
        except:
            continue
        else:
            players.append(player)
    
    for goalie in roster_data["goalies"]:
        player = {}
        try:
            player["Team"] = roster_dir[:3]
            player["Division"] = get_division(player["Team"])
            player["Name"] = goalie["firstName"]["default"] + " " + goalie["lastName"]["default"]
            player["Sweater"] = goalie["sweaterNumber"]
            player["Position"] = goalie["positionCode"]
            player["BirthDate"] = goalie["birthDate"]
            player["Country"] = goalie["birthCountry"]
        except:
            continue
        else:
            players.append(player)

with open("get_data/players.json", "w") as outfile:
    json.dump(players, outfile, indent=4)