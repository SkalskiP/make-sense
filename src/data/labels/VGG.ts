export interface VGGShape {
    name: string,
}

export interface VGGRect extends VGGShape {
    x: number,
    y: number,
    width: number,
    height: number;
}

export interface VGGPolygon extends VGGShape {
    all_points_x: number[],
    all_points_y: number[];
}

export interface VGGRegion {
    shape_attributes: VGGShape,
    region_attributes: { [key: string]: string; };
}

export type VGGRegionsData = { [key: string]: VGGRegion; };

export type VGGFileData = {
    fileref: string;
    size: number;
    filename: string;
    base64_img_data: string;
    file_attributes: object;
    regions: VGGRegionsData;
};

export type VGGObject = { [key: string]: VGGFileData; };