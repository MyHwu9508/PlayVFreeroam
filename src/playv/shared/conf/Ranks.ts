export const enum Ranks {
    NONE = 0,
    MOD = 1,
    ADMIN = 2,
    HEADADMIN = 3,
    DEVELOPER = 4,
    CHIEF = 99,
}

export function getRankBlipColor(rank = Ranks.NONE) {
    switch (rank) {
        case Ranks.MOD:
            return 38;
        case Ranks.ADMIN:
            return 59;
        case Ranks.HEADADMIN:
            return 30;
        case Ranks.DEVELOPER:
            return 25;
        case Ranks.CHIEF:
            return 83;
        default:
            return 0;
    }
}

export function isRankHigherOrSame(rank: number, targetRank: number) {
    return rank >= targetRank;
}

export function isTeamMember(rank: number) {
    return rank > 0;
}

export function getRankDisplayName(rank: number) {
    switch (rank) {
        case Ranks.MOD:
            return 'M';
        case Ranks.ADMIN:
            return 'A';
        case Ranks.HEADADMIN:
            return 'HA';
        case Ranks.DEVELOPER:
            return 'DEV';
        case Ranks.CHIEF:
            return 'CHIEF';
        default:
            return '';
    }
}

export function getRankDisplayLongName(rank: number) {
    switch (rank) {
        case Ranks.MOD:
            return 'Moderator';
        case Ranks.ADMIN:
            return 'Admin';
        case Ranks.HEADADMIN:
            return 'HeadAdmin';
        case Ranks.DEVELOPER:
            return 'Developer';
        case Ranks.CHIEF:
            return 'CHIEF';
    }
    return 'User';
}

export function getRankDisplayColor(rank: number) {
    switch (rank) {
        case Ranks.MOD:
            return `~HUD_COLOUR_NET_PLAYER25~`;
        case Ranks.ADMIN:
            return `~HUD_COLOUR_RED~`;
        case Ranks.HEADADMIN:
            return `~HUD_COLOUR_TECH_GREEN~`;
        case Ranks.DEVELOPER:
            return `~HUD_COLOUR_G9~`;
        case Ranks.CHIEF:
            return `~HUD_COLOUR_PINKLIGHT~`;
    }
    return '~w~';
}

export function getRankChatDisplayColor(rank: number) {
    switch (rank) {
        case Ranks.MOD:
            return `#0099ff`;
        case Ranks.ADMIN:
            return `#ac1e07`;
        case Ranks.HEADADMIN:
            return `#01caca`;
        case Ranks.DEVELOPER:
            return `#21815e`;
        case Ranks.CHIEF:
            return `#d885a9`;
        default:
            return '#000000';
    }
}
