import {
    updateActivePopupType,
    updateProjectData
} from '../../store/general/actionCreators';
import {PopupWindowType} from '../enums/PopupWindowType';
import {store} from '../../index';
import {updateAuthData} from '../../store/auth/actionCreators';
import {
    updateActiveImageIndex,
    updateActiveLabelNameId,
    updateFirstLabelCreatedFlag,
    updateImageData,
    updateLabelNames
} from '../../store/labels/actionCreators';
import {PopupActions} from '../../logic/actions/PopupActions';

export type DropDownMenuNode = {
    name: string;
    description?: string;
    imageSrc: string;
    imageAlt: string;
    disabled: boolean;
    onClick?: () => void;
    children?: DropDownMenuNode[];
};

export const DropDownMenuData: DropDownMenuNode[] = [
    // {
    //     name: 'Hành động(Actions)',
    //     imageSrc: 'ico/actions.png',
    //     imageAlt: 'actions',
    //     disabled: false,
    //     children: [
    //         // {
    //         //     name: 'Sửa Nhãn(Edit Labels)',
    //         //     description: 'Sửa danh sách nhãn(Modify labels list)',
    //         //     imageSrc: 'ico/tags.png',
    //         //     imageAlt: 'labels',
    //         //     disabled: false,
    //         //     onClick: () =>
    //         //         store.dispatch(
    //         //             updateActivePopupType(PopupWindowType.UPDATE_LABEL)
    //         //         )
    //         // },
    //         // {
    //         //     name: 'Nhập hình ảnh(Import Images)',
    //         //     description: 'Tải thêm hình ảnh(Load more images)',
    //         //     imageSrc: 'ico/camera.png',
    //         //     imageAlt: 'images',
    //         //     disabled: false,
    //         //     onClick: () =>
    //         //         store.dispatch(
    //         //             updateActivePopupType(PopupWindowType.IMPORT_IMAGES)
    //         //         )
    //         // },
    //         // {
    //         //     name: 'Nhập chú thích(Import Annotations)',
    //         //     description:
    //         //         'Nhập chú thích từ tệp(Import annotations from file)',
    //         //     imageSrc: 'ico/import-labels.png',
    //         //     imageAlt: 'import-labels',
    //         //     disabled: false,
    //         //     onClick: () =>
    //         //         store.dispatch(
    //         //             updateActivePopupType(
    //         //                 PopupWindowType.IMPORT_ANNOTATIONS
    //         //             )
    //         //         )
    //         // },
    //         // {
    //         //     name: 'Xuất chú thích(Export Annotations)',
    //         //     description:
    //         //         'Xuất chú thích sang tệp(Export annotations to file)',
    //         //     imageSrc: 'ico/export-labels.png',
    //         //     imageAlt: 'export-labels',
    //         //     disabled: false,
    //         //     onClick: () =>
    //         //         store.dispatch(
    //         //             updateActivePopupType(
    //         //                 PopupWindowType.EXPORT_ANNOTATIONS
    //         //             )
    //         //         )
    //         // },
    //         // {
    //         //     name: 'Tải mô hình AI(Load AI Model)',
    //         //     description:
    //         //         'Tải mô hình AI được đào tạo trước(Load our pre-trained annotation models)',
    //         //     imageSrc: 'ico/ai.png',
    //         //     imageAlt: 'load-ai-model',
    //         //     disabled: false,
    //         //     onClick: () =>
    //         //         store.dispatch(
    //         //             updateActivePopupType(PopupWindowType.LOAD_AI_MODEL)
    //         //         )
    //         // }
    //     ]
    // },
    {
        name: 'Người dùng (User)',
        imageSrc: 'ico/user.png',
        imageAlt: 'user',
        disabled: false,
        children: [
            {
                name: `Đăng xuất (Logout)`,
                description:
                    'Xóa xác thực hiện tại(Clear current authentication)',
                imageSrc: 'ico/user.png',
                imageAlt: 'logout',
                disabled: false,
                onClick: () => {
                    store.dispatch(
                        updateActivePopupType(PopupWindowType.LOGOUT)
                    );
                }
            }
        ]
    }
    // {
    //     name: 'Cộng đồng(Community)',
    //     imageSrc: 'ico/plant.png',
    //     imageAlt: 'community',
    //     disabled: false,
    //     children: [
    //         {
    //             name: 'Tài liệu(Documentation)',
    //             description:
    //                 'Đọc thêm về Make Sense(Read more about Make Sense)',
    //             imageSrc: 'ico/documentation.png',
    //             imageAlt: 'documentation',
    //             disabled: false,
    //             onClick: () =>
    //                 window.open(
    //                     'https://skalskip.github.io/make-sense',
    //                     '_blank'
    //                 )
    //         },
    //         {
    //             name: 'Lỗi và Chức năng(Bugs and Features)',
    //             description:
    //                 'Báo cáo lỗi hoặc đề xuất một chức năng mới(Report a bug or propose a new feature)',
    //             imageSrc: 'ico/bug.png',
    //             imageAlt: 'bug',
    //             disabled: false,
    //             onClick: () =>
    //                 window.open(
    //                     'https://github.com/SkalskiP/make-sense/issues',
    //                     '_blank'
    //                 )
    //         }
    //     ]
    // }
];
