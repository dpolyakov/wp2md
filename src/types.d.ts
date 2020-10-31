export interface IConfig {
  SOURCE: string;
  OUTRUT_DIR: string;
}

export interface IWpExport {
  rss: {
    channel: {
      title: string;
      description: string;
      item: Array<IWpEntry>;
      'wp:author': IWpAuthor | Array<IWpAuthor>;
      'wp:base_blog_url': string;
      'wp:base_site_url': string;
      language: string;
      link: string;
      pubDate: string;
      'wp:category': Array<{}> /* TODO */;
      'wp:tag': Array<{}> /* TODO */;
      'wp:term': Array<{}> /* TODO */;
    };
  };
}

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
  'wp:post_type': WpPostType;
  'wp:post_password': string;
  'wp:is_sticky': number;
  category?: Array<IWpTaxonomy>;
  'wp:postmeta': Array<WpMeta>;
  'wp:comment'?: Array<IWpComment>;
}

export interface IWpTaxonomy {
  value: string;
  attr: {
    domain: 'category' | 'post_tag';
    nicename: string;
  };
}

export interface IWpAuthor {
  'wp:author_id': number;
  'wp:author_login': string;
  'wp:author_email': string;
  'wp:author_display_name': string;
  'wp:author_first_name': string;
  'wp:author_last_name': string;
  'wp:comment_user_id'?: number;
}

export interface IStaticAuthor {
  id: number;
  login: string;
  email: string;
  emailMd5: string;
  displayName: string;
}

export interface IStaticAuthorsData {
  [key: number]: IStaticAuthor;
}

export interface IWpComment {
  'wp:comment_approved': '0' | '1';
  'wp:comment_author': string;
  'wp:comment_author_email': string;
  'wp:comment_author_IP': string;
  'wp:comment_author_url': string;
  'wp:comment_content': string;
  'wp:comment_date': string;
  'wp:comment_date_gmt': string;
  'wp:comment_id': number;
  'wp:comment_parent': number;
  'wp:comment_type': string;
  'wp:comment_user_id': number;
}

export interface IStaticComment {
  id: string;
  parentId: string;
  date: string;
  content: string;
  author: string;
  authorSite: string;
  authorEmailMd5?: string;
  authorEmail?: string;
  approved: boolean;
}

export type WpPostType = 'post' | 'page' | 'nav_menu_item' | string;

type WpMeta = {
  'wp:meta_key': string;
  'wp:meta_value': string;
};

type WpStatus = 'open' | 'close';

type PostStatus = 'private' | 'inherit' | 'publish' | 'draft';
