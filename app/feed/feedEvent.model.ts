export interface FeedEvent {
  type: string;
  srcusername: string;
  targetid: number;
  stocktextid: string;
  stockname: string;
  time: number;
  leader: string;
  amount: number;
}