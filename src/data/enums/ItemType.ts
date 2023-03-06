import _ from 'lodash';

export enum ATTRIBUTE_TYPE {
    GENDER = 'GENDER',
    SOURCE = 'SOURCE',
    FASHION_STYLE = 'FASHION_STYLE',
    MAIN_CATEGORY = 'MAIN_CATEGORY',
    SUB_CATEGORY = 'SUB_CATEGORY',
    ITEM_COLOR = 'ITEM_COLOR',
    ITEM_PATTERN = 'ITEM_PATTERN',
    HUMAN_ID = 'HUMAN_ID'
}

export const GENDER = {
    MAN: 1,
    WOMAN: 2,
    UNKNOWN: -1
};

export const GENDER_CODE = {
    '1': 'MAN',
    '2': 'WOMAN',
    '-1': 'UNKNOWN'
};

export const SOURCE = {
    HUMAN: 0,
    MANNEQUIN: 1,
    STYLEBOOK: 2,
    UNKNOWN: -1
};

export const SOURCE_CODE = {
    0: 'HUMAN',
    1: 'MANNEQUIN',
    2: 'STYLEBOOK',
    '-1': 'UNKNOWN'
};

export const FASHION_STYLE = [
    {
        seq: 18,
        name: 'Basic',
        slug: 'basic',
        gender: 'A',
        status: 'A',
        m: 10,
        f: 13
    },
    {
        seq: 19,
        name: 'Elegance',
        slug: 'elegance',
        gender: 'F',
        status: 'A',
        f: 2
    },
    {
        seq: 20,
        name: 'Office',
        slug: 'office',
        gender: 'F',
        status: 'A',
        f: 1
    },
    {
        seq: 21,
        name: 'Minimalist',
        slug: 'minimalist',
        gender: 'A',
        status: 'A',
        m: 3,
        f: 4
    },
    {
        seq: 22,
        name: 'Vacation',
        slug: 'vacation',
        gender: 'A',
        status: 'A',
        m: 4,
        f: 5
    },
    {
        seq: 23,
        name: 'Street',
        slug: 'street',
        gender: 'A',
        status: 'A',
        m: 8,
        f: 11
    },
    {
        seq: 24,
        name: 'Sporty',
        slug: 'sporty',
        gender: 'A',
        status: 'A',
        m: 5,
        f: 8
    },
    {
        seq: 25,
        name: 'Girly',
        slug: 'girly',
        gender: 'F',
        status: 'A',
        f: 6
    },
    {
        seq: 26,
        name: 'Sexy',
        slug: 'sexy',
        gender: 'F',
        status: 'A',
        f: 7
    },
    {
        seq: 27,
        name: 'Gentleman',
        slug: 'gentleman',
        gender: 'M',
        status: 'A',
        m: 1
    },
    {
        seq: 28,
        name: 'Punk',
        slug: 'punk',
        gender: 'A',
        status: 'A',
        m: 9,
        f: 12
    },
    {
        seq: 29,
        name: 'Tech',
        slug: 'techwear',
        gender: 'A',
        status: 'A',
        m: 6,
        f: 9
    },
    {
        seq: 30,
        name: 'Retro',
        slug: 'retro',
        gender: 'A',
        status: 'A',
        m: 7,
        f: 10
    },
    {
        seq: 31,
        name: 'Bohemian',
        slug: 'bohemian',
        gender: 'A',
        status: 'A',
        m: 2,
        f: 3
    },
    {
        seq: -1,
        name: 'Unknown',
        slug: 'unknown',
        gender: 'A',
        status: 'A',
        m: -1,
        f: -1
    }
];

export const FASHION_STYLE_MAN = FASHION_STYLE.filter(
    (item) => item.gender === 'A' || item.gender === 'M'
);

export const FASHION_STYLE_WOMAN = FASHION_STYLE.filter(
    (item) => item.gender === 'A' || item.gender === 'F'
);

export enum FASHION_STYLE_CODE_FOR_MAN {
    GENTLEMAN = 1,
    BOHEMIAN = 2,
    MINIMALIST = 3,
    VACATION = 4,
    SPORTY = 5,
    TECH = 6,
    RETRO = 7,
    STREET = 8,
    PUNK = 9,
    BASIC = 10,
    UNKNOWN = -1
}

export enum FASHION_STYLE_CODE_FOR_WOMAN {
    BASIC = 18,
    ELEGANCE = 19,
    OFFICE = 20,
    MINIMALIST = 21,
    VACATION = 22,
    STREET = 23,
    SPORTY = 24,
    GIRLY = 25,
    SEXY = 26,
    PUNK = 28,
    TECH = 29,
    RETRO = 30,
    BOHEMIAN = 31,
    UNKNOWN = -1
}

export enum MAIN_CATEGORY_CODE {
    OUTER = 1,
    TOP,
    PANTS,
    SKIRT,
    DRESSES,
    SWIMWEAR,
    UNDERWEAR,
    SHOES,
    BAG,
    CAP_HAT,
    FASHION_ACC,
    EYEWEAR,
    UNKNOWN = -1
}

export enum SUB_CATEGORY_CODE {
    JACKET = 1,
    COAT,
    JUMPER,
    PADDING_COAT,
    VEST,
    CARDIGAN,
    HOOD_ZIPUP,
    CASUAL_TOP,
    SLEEVELESS,
    SWEATSHIRT,
    HOODED_TSHIRT,
    SHIRTS_BLOUSE,
    KNIT_SWEATER,
    SHORTS,
    SLACKS_COTTON_PANTS_CHINO,
    WIDE_PANTS,
    JEANS,
    CARGO_PANTS,
    LEGGINGS,
    JOGGER_PANTS,
    OVERALLS,
    MINI_SKIRT,
    SKIRT,
    MINI_DRESS,
    DRESS,
    BIKINI,
    RASH_GUARD,
    ONE_PIECE_SWIMSUIT,
    BEACH_TOPS,
    BEACH_PANTS,
    BRA,
    PANTIES_UNDERWEAR,
    PAJAMAS_HOMEWEAR,
    SLIP,
    BATHROBE,
    CORRECTION_UNDERWEAR,
    SHOES_LOERFERS,
    HEELS,
    SPORTS_SHOES_SNEAKERS,
    BOOTS,
    SANDALS_SLIPPERS,
    CROSS_BAG,
    SHOULDER_BAG,
    TOTE_BAG,
    BREIF_CASE,
    WAIST_BAG,
    CANVAS_BAG,
    CLUTCH_BAG,
    BACKPACK,
    POUCH,
    WALLET,
    LUGGAGE,
    BALLCAP,
    BUCKET_HAT,
    FEDORA_HAT,
    BEANIE_HAT_WATCH_CAP,
    PHONE_CASE,
    SOCKS,
    WATCH,
    BELT,
    SCARF,
    TIGHTS_STOCKINGS,
    GLOVES,
    GLASSES,
    SUNGLASSES,
    UNKNOWN = -1
}

export const ITEM_CATEGORY = {
    OUTER: [
        SUB_CATEGORY_CODE.JACKET,
        SUB_CATEGORY_CODE.COAT,
        SUB_CATEGORY_CODE.JUMPER,
        SUB_CATEGORY_CODE.PADDING_COAT,
        SUB_CATEGORY_CODE.VEST,
        SUB_CATEGORY_CODE.CARDIGAN,
        SUB_CATEGORY_CODE.HOOD_ZIPUP
    ],
    TOP: [
        SUB_CATEGORY_CODE.CASUAL_TOP,
        SUB_CATEGORY_CODE.SLEEVELESS,
        SUB_CATEGORY_CODE.SWEATSHIRT,
        SUB_CATEGORY_CODE.HOODED_TSHIRT,
        SUB_CATEGORY_CODE.SHIRTS_BLOUSE,
        SUB_CATEGORY_CODE.KNIT_SWEATER
    ],
    PANTS: [
        SUB_CATEGORY_CODE.SHORTS,
        SUB_CATEGORY_CODE.SLACKS_COTTON_PANTS_CHINO,
        SUB_CATEGORY_CODE.WIDE_PANTS,
        SUB_CATEGORY_CODE.JEANS,
        SUB_CATEGORY_CODE.CARGO_PANTS,
        SUB_CATEGORY_CODE.LEGGINGS,
        SUB_CATEGORY_CODE.JOGGER_PANTS,
        SUB_CATEGORY_CODE.OVERALLS
    ],
    SKIRT: [SUB_CATEGORY_CODE.MINI_SKIRT, SUB_CATEGORY_CODE.SKIRT],
    DRESSES: [SUB_CATEGORY_CODE.MINI_DRESS, SUB_CATEGORY_CODE.DRESS],
    SWIMWEAR: [
        SUB_CATEGORY_CODE.BIKINI,
        SUB_CATEGORY_CODE.RASH_GUARD,
        SUB_CATEGORY_CODE.ONE_PIECE_SWIMSUIT,
        SUB_CATEGORY_CODE.BEACH_TOPS,
        SUB_CATEGORY_CODE.BEACH_PANTS
    ],
    UNDERWEAR: [
        SUB_CATEGORY_CODE.BRA,
        SUB_CATEGORY_CODE.PANTIES_UNDERWEAR,
        SUB_CATEGORY_CODE.PAJAMAS_HOMEWEAR,
        SUB_CATEGORY_CODE.SLIP,
        SUB_CATEGORY_CODE.BATHROBE,
        SUB_CATEGORY_CODE.CORRECTION_UNDERWEAR
    ],
    SHOES: [
        SUB_CATEGORY_CODE.SHOES_LOERFERS,
        SUB_CATEGORY_CODE.HEELS,
        SUB_CATEGORY_CODE.SPORTS_SHOES_SNEAKERS,
        SUB_CATEGORY_CODE.BOOTS,
        SUB_CATEGORY_CODE.SANDALS_SLIPPERS
    ],
    BAG: [
        SUB_CATEGORY_CODE.CROSS_BAG,
        SUB_CATEGORY_CODE.SHOULDER_BAG,
        SUB_CATEGORY_CODE.TOTE_BAG,
        SUB_CATEGORY_CODE.BREIF_CASE,
        SUB_CATEGORY_CODE.WAIST_BAG,
        SUB_CATEGORY_CODE.CANVAS_BAG,
        SUB_CATEGORY_CODE.CLUTCH_BAG,
        SUB_CATEGORY_CODE.BACKPACK,
        SUB_CATEGORY_CODE.POUCH,
        SUB_CATEGORY_CODE.WALLET,
        SUB_CATEGORY_CODE.LUGGAGE
    ],
    CAP_HAT: [
        SUB_CATEGORY_CODE.BALLCAP,
        SUB_CATEGORY_CODE.BUCKET_HAT,
        SUB_CATEGORY_CODE.FEDORA_HAT,
        SUB_CATEGORY_CODE.BEANIE_HAT_WATCH_CAP
    ],
    FASHION_ACC: [
        SUB_CATEGORY_CODE.PHONE_CASE,
        SUB_CATEGORY_CODE.SOCKS,
        SUB_CATEGORY_CODE.WATCH,
        SUB_CATEGORY_CODE.BELT,
        SUB_CATEGORY_CODE.SCARF,
        SUB_CATEGORY_CODE.TIGHTS_STOCKINGS,
        SUB_CATEGORY_CODE.GLOVES
    ],
    EYEWEAR: [SUB_CATEGORY_CODE.GLASSES, SUB_CATEGORY_CODE.SUNGLASSES]
};

export const SUB_CATEGORY_TO_MAIN = {
    JACKET: MAIN_CATEGORY_CODE.OUTER,
    COAT: MAIN_CATEGORY_CODE.OUTER,
    JUMPER: MAIN_CATEGORY_CODE.OUTER,
    PADDING_COAT: MAIN_CATEGORY_CODE.OUTER,
    VEST: MAIN_CATEGORY_CODE.OUTER,
    CARDIGAN: MAIN_CATEGORY_CODE.OUTER,
    HOOD_ZIPUP: MAIN_CATEGORY_CODE.OUTER,
    CASUAL_TOP: MAIN_CATEGORY_CODE.TOP,
    SLEEVELESS: MAIN_CATEGORY_CODE.TOP,
    SWEATSHIRT: MAIN_CATEGORY_CODE.TOP,
    HOODED_TSHIRT: MAIN_CATEGORY_CODE.TOP,
    SHIRTS_BLOUSE: MAIN_CATEGORY_CODE.TOP,
    KNIT_SWEATER: MAIN_CATEGORY_CODE.TOP,
    SHORTS: MAIN_CATEGORY_CODE.PANTS,
    SLACKS_COTTON_PANTS_CHINO: MAIN_CATEGORY_CODE.PANTS,
    WIDE_PANTS: MAIN_CATEGORY_CODE.PANTS,
    JEANS: MAIN_CATEGORY_CODE.PANTS,
    CARGO_PANTS: MAIN_CATEGORY_CODE.PANTS,
    LEGGINGS: MAIN_CATEGORY_CODE.PANTS,
    JOGGER_PANTS: MAIN_CATEGORY_CODE.PANTS,
    OVERALLS: MAIN_CATEGORY_CODE.PANTS,
    MINI_SKIRT: MAIN_CATEGORY_CODE.SKIRT,
    SKIRT: MAIN_CATEGORY_CODE.SKIRT,
    MINI_DRESS: MAIN_CATEGORY_CODE.DRESSES,
    DRESS: MAIN_CATEGORY_CODE.DRESSES,
    BIKINI: MAIN_CATEGORY_CODE.SWIMWEAR,
    RASH_GUARD: MAIN_CATEGORY_CODE.SWIMWEAR,
    ONE_PIECE_SWIMSUIT: MAIN_CATEGORY_CODE.SWIMWEAR,
    BEACH_TOPS: MAIN_CATEGORY_CODE.SWIMWEAR,
    BEACH_PANTS: MAIN_CATEGORY_CODE.SWIMWEAR,
    BRA: MAIN_CATEGORY_CODE.UNDERWEAR,
    PANTIES_UNDERWEAR: MAIN_CATEGORY_CODE.UNDERWEAR,
    PAJAMAS_HOMEWEAR: MAIN_CATEGORY_CODE.UNDERWEAR,
    SLIP: MAIN_CATEGORY_CODE.UNDERWEAR,
    BATHROBE: MAIN_CATEGORY_CODE.UNDERWEAR,
    CORRECTION_UNDERWEAR: MAIN_CATEGORY_CODE.UNDERWEAR,
    SHOES_LOERFERS: MAIN_CATEGORY_CODE.SHOES,
    HEELS: MAIN_CATEGORY_CODE.SHOES,
    SPORTS_SHOES_SNEAKERS: MAIN_CATEGORY_CODE.SHOES,
    BOOTS: MAIN_CATEGORY_CODE.SHOES,
    SANDALS_SLIPPERS: MAIN_CATEGORY_CODE.SHOES,
    CROSS_BAG: MAIN_CATEGORY_CODE.BAG,
    SHOULDER_BAG: MAIN_CATEGORY_CODE.BAG,
    TOTE_BAG: MAIN_CATEGORY_CODE.BAG,
    BREIF_CASE: MAIN_CATEGORY_CODE.BAG,
    WAIST_BAG: MAIN_CATEGORY_CODE.BAG,
    CANVAS_BAG: MAIN_CATEGORY_CODE.BAG,
    CLUTCH_BAG: MAIN_CATEGORY_CODE.BAG,
    BACKPACK: MAIN_CATEGORY_CODE.BAG,
    POUCH: MAIN_CATEGORY_CODE.BAG,
    WALLET: MAIN_CATEGORY_CODE.BAG,
    LUGGAGE: MAIN_CATEGORY_CODE.BAG,
    BALLCAP: MAIN_CATEGORY_CODE.CAP_HAT,
    BUCKET_HAT: MAIN_CATEGORY_CODE.CAP_HAT,
    FEDORA_HAT: MAIN_CATEGORY_CODE.CAP_HAT,
    BEANIE_HAT_WATCH_CAP: MAIN_CATEGORY_CODE.CAP_HAT,
    PHONE_CASE: MAIN_CATEGORY_CODE.FASHION_ACC,
    SOCKS: MAIN_CATEGORY_CODE.FASHION_ACC,
    WATCH: MAIN_CATEGORY_CODE.FASHION_ACC,
    BELT: MAIN_CATEGORY_CODE.FASHION_ACC,
    SCARF: MAIN_CATEGORY_CODE.FASHION_ACC,
    TIGHTS_STOCKINGS: MAIN_CATEGORY_CODE.FASHION_ACC,
    GLOVES: MAIN_CATEGORY_CODE.FASHION_ACC,
    GLASSES: MAIN_CATEGORY_CODE.EYEWEAR,
    SUNGLASSES: MAIN_CATEGORY_CODE.EYEWEAR
};

export enum ITEM_COLOR {
    BLACK = 1,
    WHITE,
    GREY,
    RED,
    PINK,
    ORANGE,
    BEIGE,
    BROWN,
    YELLOW,
    GREEN,
    KHAKI,
    MINT,
    BLUE,
    NAVY,
    SKYBLUE,
    PURPLE,
    LAVENDER,
    WINE,
    NEON,
    GOLD,
    SILVER,
    CYAN,
    MAGENTA,
    UNKNOWN = -1
}

export enum ITEM_PATTERN {
    CHECK = 1,
    STRIPE,
    ZIGZAG,
    LEOPARD,
    ZEBRA,
    DOT,
    CAMOUFLAGE,
    PAISLEY,
    ARGYLE,
    FLORAL,
    LETTERING,
    SKULL,
    GRADATION,
    SOLID,
    GRAPHIC,
    HOUNDS_TOOTH,
    COLOR_BLOCK,
    MESH,
    UNKNOWN = -1
}
