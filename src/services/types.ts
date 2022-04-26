export type APIImageData = {
    image_id: string;
    image_url: string;
    style_list: {
        seq: string;
        name: string;
    }[];
    json?: string;
};
