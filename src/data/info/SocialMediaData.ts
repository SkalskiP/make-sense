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
        imageAlt: 'GitHub Logo',
        href: Settings.GITHUB_URL,
        tooltipMessage: 'Show me some love on GitHub',
    },
    {
        displayName: 'Medium',
        imageSrc: '/ico/medium-logo.png',
        imageAlt: 'Medium Logo',
        href: Settings.MEDIUM_URL,
        tooltipMessage: 'Read my AI content on Medium',
    },
    {
        displayName: 'Patreon',
        imageSrc: '/ico/patreon-logo.png',
        imageAlt: 'Patreon Logo',
        href: Settings.PATREON_URL,
        tooltipMessage: 'Support Make Sense on Patreon and help it grow'
    },
];
