import { Result, TeamDetails } from '../definitions';

export interface SingleResultDTO {
  result: Result;
  homeDetails: TeamDetails;
  awayDetails: TeamDetails;
}

export interface ResultsListDTO {
  results: SingleResultDTO[];
}

export interface HeadToHeadDTO {
  headtohead: SingleResultDTO[];
}
