export interface JoinVideo {
  title: string;
  type: string;
  amount: number;
  description: string;
  viewer_cnt: string;
  name: string;
  snapshot: string;
  is_streaming: number;
  live_group_id: number;
}

export interface PrivateModeRequest{
  id : string,// (model_id)
  live_video_id
  user_id: number;
  private_cpm: number;
  video_name: string;
  video_url : string;
  snapshot: string;
  is_streaming: number;
  status: number;
  cpm: number,
}