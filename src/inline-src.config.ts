export interface InlineSource {
    type: string;
    assetPath: string;
    componentPath: string;
    pattern: string;
    componentCode: string;
    uglifyConfig?: string;
}

export interface Config {
    inlineSource: InlineSource[];
    swcrcPath: string;
    silent?: boolean | string;
    uglifyConfig? : string;
}