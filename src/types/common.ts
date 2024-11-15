export interface ListFields {
  id: string;
  title: string;
  duration: number;
  create_time: string;
}

export interface DataFields {
  code: number;
  data: {
    list: ListFields[];
    page: {
      page_now: number;
      page_size: number;
      page_total: number;
      total_num: number;
    };
  };
  message: string;
}