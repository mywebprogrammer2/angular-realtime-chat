export interface Message {
  id: string;
  from_id: number;
  to_id: number;
  message: string;
  attachment: {
      file: string|null
      title: string|null
      type: string|null
      url: string | null;
  };
  timeAgo: string;
  created_at: string;
  isSender: boolean;
  seen: boolean;
}


export class MessageClass implements Message {
  id: string;
  from_id: number;
  to_id: number;
  message: string;
  attachment: {
    file: string | null;
    title: string | null;
    type: string | null;
    url: string | null;
  };
  timeAgo: string;
  created_at: string;
  isSender: boolean;
  seen: boolean;

  constructor(
    id: string,
    from_id: number,
    to_id: number,
    message: string,
    attachment: { file: string | null; title: string | null; type: string | null;  url: string | null },
    timeAgo: string,
    created_at: string,
    isSender: boolean,
    seen: boolean
  ) {
    this.id = id;
    this.from_id = from_id;
    this.to_id = to_id;
    this.message = message;
    this.attachment = attachment;
    this.timeAgo = timeAgo;
    this.created_at = created_at;
    this.isSender = isSender;
    this.seen = seen;
  }
}
