export interface Node {
    _id?:String
    label?: any;
    leaf?: boolean;
    children?: Array<Node>;
    parentId?: String;
    low?: number;
    high?: number;
    expanded?: boolean;
}