export type APIImageData = {
    image_id: string;
    image_url: string;
    style_list: {
        seq: string;
        name: string;
    }[];
    labeling_json?: string;
    image_width: string;
    image_height: string;
};
