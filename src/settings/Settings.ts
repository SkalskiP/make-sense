import {PopupWindowType} from '../data/enums/PopupWindowType';

export class Settings {
    public static readonly GITHUB_URL: string = 'https://github.com/SkalskiP';
    public static readonly MEDIUM_URL: string = 'https://medium.com/@piotr.skalski92';
    public static readonly TWITCH_URL: string = 'https://www.twitch.tv/skalskip';
    public static readonly YOUTUBE_URL: string = 'https://www.youtube.com/watch?v=AWjKfjDGiYE';

    public static readonly TOP_NAVIGATION_BAR_HEIGHT_PX: number = 35;
    public static readonly EDITOR_BOTTOM_NAVIGATION_BAR_HEIGHT_PX: number = 40 + 1;
    public static readonly EDITOR_TOP_NAVIGATION_BAR_HEIGHT_PX: number = 40 + 1;
    public static readonly SIDE_NAVIGATION_BAR_WIDTH_CLOSED_PX: number = 23 + 1;
    public static readonly SIDE_NAVIGATION_BAR_WIDTH_OPEN_PX: number = Settings.SIDE_NAVIGATION_BAR_WIDTH_CLOSED_PX + 300 + 1;
    public static readonly TOOLKIT_TAB_HEIGHT_PX: number = 40;
    public static readonly TOOLBOX_PANEL_WIDTH_PX: number = 50 + 1;
    public static readonly MAX_DROPDOWN_OPTION_LENGTH: number = 20;

    public static readonly EDITOR_MIN_WIDTH: number = 900;
    public static readonly EDITOR_MIN_HEIGHT: number = 500;

    public static readonly PRIMARY_COLOR: string = '#2af598';
    public static readonly SECONDARY_COLOR: string = '#009efd';

    public static readonly DARK_THEME_FIRST_COLOR: string = '#171717';
    public static readonly DARK_THEME_SECOND_COLOR: string = '#282828';
    public static readonly DARK_THEME_THIRD_COLOR: string = '#4c4c4c';
    public static readonly DARK_THEME_FORTH_COLOR: string = '#262c2f';

    public static readonly CROSS_HAIR_THICKNESS_PX: number = 1;
    public static readonly CROSS_HAIR_COLOR: string = '#fff';

    public static readonly RESIZE_HANDLE_DIMENSION_PX: number = 8;
    public static readonly RESIZE_HANDLE_HOVER_DIMENSION_PX = 16;

    public static readonly CLOSEABLE_POPUPS: PopupWindowType[] = [
        PopupWindowType.IMPORT_IMAGES,
        PopupWindowType.EXPORT_ANNOTATIONS,
        PopupWindowType.IMPORT_ANNOTATIONS,
        PopupWindowType.EXIT_PROJECT,
        PopupWindowType.UPDATE_LABEL,
        PopupWindowType.LOAD_AI_MODEL,
        PopupWindowType.LOAD_YOLO_V5_MODEL
    ];

    public static readonly LABEL_COLORS_PALETTE = [
        '#ff3838',
        '#ff9d97',
        '#ff701f',
        '#ffb21d',
        '#cff231',
        '#48f90a',
        '#92cc17',
        '#3ddb86',
        '#1a9334',
        '#00d4bb',
        '#2c99a8',
        '#00c2ff',
        '#344593',
        '#6473ff',
        '#0018ec',
        '#8438ff',
        '#520085',
        '#cb38ff',
        '#ff95c8',
        '#ff37c7'
    ];

    public static readonly CSV_SEPARATOR = ','
    public static readonly RECT_LABELS_EXPORT_CSV_COLUMN_NAMES = [
        'label_name',
        'bbox_x',
        'bbox_y',
        'bbox_width',
        'bbox_height',
        'image_name',
        'image_width',
        'image_height'
    ].join(Settings.CSV_SEPARATOR)
}
