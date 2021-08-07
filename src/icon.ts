export class Icon {

    static get dropdown(): string {
        return `
            <svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.4211 7H4.57883C4.06575 7 3.80438 7.61956 4.17224 7.98743L9.5934 13.4086C9.81605 13.6312 10.1839 13.6312 10.4067 13.4086L15.8278 7.98743C16.1956 7.61956 15.9342 7 15.4211 7Z" fill="#888888"/>
            </svg>`
    }

    static get fullscreen(): string {
        return `
        <svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 3V2H2.5C2.22384 2 2 2.22384 2 2.5V6H3V3.705L7.645 8.35L8.35 7.645L3.705 3H6Z" fill="#888888"/>
            <path d="M17.5 2H14V3H16.295L11.65 7.645L12.355 8.35L17 3.705V6H18V2.5C18 2.22384 17.7762 2 17.5 2Z" fill="#888888"/>
            <path d="M17 16.295L12.355 11.65L11.65 12.355L16.295 17H14V18H17.5C17.7762 18 18 17.7762 18 17.5V14H17V16.295Z" fill="#888888"/>
            <path d="M7.645 11.645L3 16.295V14H2V17.5C2 17.7762 2.22384 18 2.5 18H6V17H3.705L8.35 12.355L7.645 11.645Z" fill="#888888"/>
        </svg>`
    }

}