export interface VGGShape {}

export interface VGGRect extends VGGShape {
    name: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface VGGPolygon extends VGGShape {
    name: string,
    all_points_x: number[],
    all_points_y: number[]
}

export interface VGGRegion {
    shape_attributes: VGGShape,
    region_attributes: { [key:string]:string; }
}