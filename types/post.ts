// Define types for the arguments
export type Post = {
    ID: number;
    post_author: number;
    post_date: string;
    post_content: string;
    post_title: string;
    post_status: string;
    comment_status: string;
    ping_status: string;
    post_name: string;
    sort?: string;
    post_image?: string;
    is_feature?: boolean;
    post_modified: string;
    post_type: string;
    excerpt?: string;
    categories?: string;
    tags?: string;
    profession?: string;
    interests?: string;
    skills?: string;
  };
  
  export type Taxonomy = {
    term_id: number;
    name: string;
    type?: string;
    image?: string;
    count: number;
    slug: string;
    desc: string;
  };
  export type Tag = {
    term_id: number;
    name: string;
    count: number;
    slug: string;
    type?: string;
    image?: string;
    description: string;
  };
  export type Config = {
    id: number;
    key: string;
    value: string;
    type: string;
  };
  
  export type Category = Tag; // Since they share the same structure
  
  export type Course = Post;
  
  export type Page = Post;
  
  // Adjust the function signature to use typed parameters
  export type insertDataWithTransactionType = {
    posts: Post[];
    tags: Tag[];
    categories: Category[];
    courses: Course[];
    pages: Page[];
    configs: Config[];
  }
  