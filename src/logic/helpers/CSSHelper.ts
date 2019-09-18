import {Settings} from "../../settings/Settings";
import {AISelector} from "../../store/selectors/AISelector";

export class CSSHelper {
    public static initVariables() {
        let css = document.createElement('style');
        css.appendChild(document.createTextNode(":root " +
            "{" +
                "--leading-color: " + Settings.SECONDARY_COLOR + ";" +
                "--hue-value: 172deg;" +
            "}"
        ));
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    public static updateVariables() {
        let css = document.createElement('style');
        css.appendChild(document.createTextNode(":root " +
            "{" +
            "--leading-color: " + Settings.PRIMARY_COLOR + ";" +
            "--hue-value: 120deg;" +
            "}"
        ));
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    public static getLeadingColor(): string {
        return AISelector.isAiModelLoaded() ? Settings.PRIMARY_COLOR : Settings.SECONDARY_COLOR;
    }
}