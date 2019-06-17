import {Settings} from "../settings/Settings";

export interface ISocialMedia {
    displayName:string;
    imageSrc:string;
    imageAlt:string;
    href:string;
}

export const SocialMediaData:ISocialMedia[] = [
    {
        displayName: "Github",
        imageSrc: "/img/github-logo.png",
        imageAlt: "GitHub Logo",
        href: Settings.GITHUB_URL
    },
    {
        displayName: "Medium",
        imageSrc: "/img/medium-logo.png",
        imageAlt: "Medium Logo",
        href: Settings.MEDIUM_URL
    },
    {
        displayName: "Twitter",
        imageSrc: "/img/patreon-logo.png",
        imageAlt: "Patreon Logo",
        href: Settings.PATREON_URL
    },
];