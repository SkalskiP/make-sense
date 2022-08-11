import {Settings} from '../../settings/Settings';

export interface ISocialMedia {
    displayName:string;
    imageSrc:string;
    imageAlt:string;
    href:string;
    tooltipMessage:string;
}

export const SocialMediaData: ISocialMedia[] = [
    {
        displayName: 'Github',
        imageSrc: '/ico/github-logo.png',
        imageAlt: 'GitHub',
        href: Settings.GITHUB_URL,
        tooltipMessage: 'Show us some love on GitHub',
    },
    {
        displayName: 'Medium',
        imageSrc: '/ico/medium-logo.png',
        imageAlt: 'Medium',
        href: Settings.MEDIUM_URL,
        tooltipMessage: 'Read our AI content on Medium',
    },
    {
        displayName: 'Twitch',
        imageSrc: '/ico/twitch-logo.png',
        imageAlt: 'Twitch',
        href: Settings.TWITCH_URL,
        tooltipMessage: 'Watch as we build Make Sense right in front your eyes on Twitch'
    },
];
