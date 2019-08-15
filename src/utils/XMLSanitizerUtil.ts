export class XMLSanitizerUtil {
    public static sanitize(input: string): string {
        return input
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('&', '&amp;')
            .replace("'", '&#39;')
            .replace("/", '&#x2F;')
    }
}