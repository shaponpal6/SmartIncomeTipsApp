export interface Roadmap {
    id: string;
    uid: number;
    pid: number;
    parent: number;
    title: string;
    desc?: string;
    progress?: string;
    status?: number;
    input?: number;
    answer?: string;
  }
  
  export interface RoadmapProps {
    uid: number;
    pid: number;
  }
  