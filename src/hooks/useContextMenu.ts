import { useCallback, useEffect, useState } from "react";

export const useContextMenu = () => {
    const [xPos, setXPos] = useState("0px");
    const [yPos, setYPos] = useState("0px");
    const [showMenu, setShowMenu] = useState(false);

    const handleContextMenu = useCallback(
        (e) => {
            e.preventDefault();

            setXPos(`${e.pageX}px`);
            setYPos(`${e.pageY}px`);
            setShowMenu(true);
        },
        [setXPos, setYPos]
    );

    const handleClick = useCallback(() => {
        showMenu && setShowMenu(false);
    }, [showMenu]);

    useEffect(() => {
        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.addEventListener("click", handleClick);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    });

    return { xPos, yPos, showMenu };
}; 