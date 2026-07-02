const ICON_CDN_BASE = 'https://cdn.sparebank1.no/icons';

// Ikonnavn er Material Design-filnavnet direkte (uten .svg). `COMMON_ICON_NAMES` er de mest
// brukte ikonene i SB1-apper (3+ apper) og gir autocomplete på `name`. Alle andre MD-navn
// godtas også — se `IconName` under.
//
// VIKTIG: Denne listen dupliseres bevisst i indeks-react (icon-types.ts) og holdes i synk via
// icon-types.sync.test.ts. indeks-react skal IKKE importere fra @sb1/indeks-web i library-kode —
// web lastes fra CDN som en separat pakke, og en import ville dratt web-bundelen inn i React.
export const COMMON_ICON_NAMES = [
    'close', 'chevron_right', 'add', 'check', 'open_in_new', 'account_balance', 'edit',
    'credit_card', 'delete', 'savings', 'download', 'person', 'keyboard_arrow_down', 'mail',
    'payments', 'info', 'search', 'settings', 'directions_car', 'chevron_left', 'error',
    'check_circle', 'content_copy', 'expand_more', 'face', 'add_circle', 'cancel',
    'celebration', 'description', 'school', 'shopping_cart', 'arrow_downward', 'arrow_upward',
    'healing', 'local_gas_station', 'account_balance_wallet', 'calendar_month', 'exclamation',
    'group', 'nutrition', 'potted_plant', 'thumb_down', 'thumb_up', 'tune', 'wallet',
    'apparel', 'bolt', 'book_2', 'call', 'chair', 'check_circle_filled', 'coffee', 'cottage',
    'diversity_2', 'eyeglasses', 'favorite', 'flights_and_hotels', 'flightsmode', 'garage',
    'groups', 'handyman', 'health_and_beauty', 'hotel', 'laptop_chromebook', 'live_tv',
    'local_bar', 'local_taxi', 'luggage', 'medication', 'oven_gen', 'palette', 'pedal_bike',
    'person_play', 'pets', 'phone_iphone', 'playing_cards', 'restaurant', 'shopping_bag',
    'spa', 'sports_tennis', 'steps', 'stethoscope', 'stroller', 'support_agent',
    'theater_comedy', 'train', 'tv', 'arrow_back', 'autorenew', 'blender', 'build', 'cabin',
    'car_repair', 'currency_bitcoin', 'dentistry', 'detector_alarm', 'devices', 'diamond',
    'exercise', 'fastfood', 'featured_seasonal_and_gifts', 'house', 'icecream',
    'import_contacts', 'local_car_wash', 'local_pizza', 'menu_book', 'monitoring',
    'photo_camera', 'priority_high', 'question_mark', 'redeem', 'restaurant_menu',
    'sports_and_outdoors', 'stadia_controller', 'swap_horiz', 'things_to_do',
    'tools_power_drill', 'toys', 'add_card', 'apartment', 'arrow_right', 'article', 'contract',
    'handshake', 'home', 'info_i', 'logout', 'money_bag', 'motorcycle', 'notifications',
    'phone', 'print', 'real_estate_agent', 'receipt', 'remove', 'agriculture',
    'arrow_right_alt', 'bookmark', 'calculate', 'circle', 'event', 'exit_to_app', 'help',
    'keyboard_arrow_right', 'keyboard_arrow_up', 'lock', 'more_vert', 'people', 'schedule',
    'sync_alt', 'warning',
] as const;

export type CommonIconName = (typeof COMMON_ICON_NAMES)[number];

// `CommonIconName | (string & {})`: `(string & {})` beholder literalene i autocomplete
// samtidig som enhver string godtas. `CommonIconName | string` ville kollapset til bare
// `string` og drept autocomplete. Merk: gir INGEN validering — 'hjem' kompilerer fint og gir
// 403 på runtime.
export type IconName = CommonIconName | (string & {});

export class IxIcon extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['name', 'aria-label', 'aria-labelledby'];
    }

    connectedCallback(): void {
        this._update();
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) return;
        this._update();
    }

    private _update(): void {
        // `name` er Material Design-filnavnet direkte.
        const iconFileName = this.getAttribute('name');
        const ariaLabel = this.getAttribute('aria-label');
        const ariaLabelledBy = this.getAttribute('aria-labelledby');

        if (iconFileName) {
            this.style.setProperty('--ii-icon-url', `url(${ICON_CDN_BASE}/${iconFileName}.svg)`);
        } else {
            this.style.removeProperty('--ii-icon-url');
        }

        if (ariaLabel || ariaLabelledBy) {
            this.setAttribute('role', 'img');
            this.removeAttribute('aria-hidden');
        } else {
            this.removeAttribute('role');
            this.setAttribute('aria-hidden', 'true');
        }
    }
}
