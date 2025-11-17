export type Player = {
  Id: string;
  Name: string;
  Team: string;
  Division: string;
  Sweater: number;
  Position: string;
  BirthDate: string;
  Country: string;
  Headshot: string;
};

// Useful convenience type for places that only need id+name
export type MinimalPlayer = Pick<Player, "Id" | "Name">;
