export interface IWpEntry {
  title: string;
  link: string;
  pubDate: string;
  'dc:creator': string;
  guid: string;
  description: string;
  'content:encoded': string;
  'excerpt:encoded': string;
  'wp:post_id': number;
  'wp:post_date': string;
  'wp:post_date_gmt': string;
  'wp:comment_status': WpStatus;
  'wp:ping_status': WpStatus;
  'wp:post_name': string;
  'wp:status': PostStatus;
  'wp:post_parent': number;
  'wp:menu_order': number;
  'wp:post_type': 'post' | 'page';
  'wp:post_password': string;
  'wp:is_sticky': number;
  category?: Array<IWpTaxonomy>;
  'wp:postmeta': Array<WpMeta>;
  'wp:comment': Array<{}>;
}

export interface IWpTaxonomy {
  value: string;
  attr: {
    domain: 'category' | 'post_tag';
    nicename: string;
  };
}

type WpMeta = {
  'wp:meta_key': string;
  'wp:meta_value': string;
};

type WpStatus = 'open' | 'close';

type PostStatus = 'private' | 'inherit' | 'publish' | 'draft';
