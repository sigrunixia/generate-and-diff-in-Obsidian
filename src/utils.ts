export class GenerateDiffPluginUtils {
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}${month}${day}-${hours}${minutes}${seconds}`;
    }

    static getDeviceName(): string {
        const platform = navigator.platform.toLowerCase();
        if (platform.includes('win')) return 'Windows';
        if (platform.includes('mac')) return 'Mac';
        if (platform.includes('linux')) return 'Linux';
        if (platform.includes('iphone') || platform.includes('ipad')) return 'iOS';
        if (platform.includes('android')) return 'Android';
        return 'Unknown';
    }
}
