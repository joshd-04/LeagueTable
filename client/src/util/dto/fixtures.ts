import { Fixture, TeamDetails } from '../definitions';

export interface SingleFixtureDTO {
  fixture: Fixture;
  homeDetails: TeamDetails;
  awayDetails: TeamDetails;
}

export interface FixturesListDTO {
  totalFixtures: number;
  fixturesReturned: number;
  fixtures: SingleFixtureDTO[];
}
