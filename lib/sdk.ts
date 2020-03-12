import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

const BaseHost = 'https://github.com/';
const BaseApiHost = 'https://github.com/repos';

export class GithubSDK {
    constructor(private readonly http: IHttp) {}

    public createWebhook(repoName: string, webhookUrl: string) {
        return this.post(BaseApiHost + repoName + '/hooks', {
            active: true,
            events: ['push'],
            config: {
                url: webhookUrl,
                content_type: 'json',
            },
        });
    }

    private async post(url: string, data: any): Promise<any> {
        const response = await this.http.post(url, {
            headers: {
                'Authorization': 'Bearer ece9757d24fd853e67a901dcc703f726b98d4149',
                'Content-Type': 'application/json',
                'User-Agent': 'Rocket.Chat-Apps-Engine',
            },
            data,
        });

        if (!response.statusCode.toString().startsWith('2')) {
            throw response;
        }

        return JSON.parse(response.content || '{}');
    }
}

export function getRepoName(repoUrl: string): string {
    if (!repoUrl.startsWith(BaseHost)) {
        return '';
    }

    const apiUrl = repoUrl.substring(BaseHost.length);
    const secondSlashIndex = apiUrl.indexOf('/', apiUrl.indexOf('/') + 1);

    return apiUrl.substring(0, secondSlashIndex === -1 ? undefined : secondSlashIndex);
}

export async function sendNotification(msg, read, modify, sender, room) {
    if (!room) {
        throw new Error('No room is configured for the message');
    }
    const message = await modify.getCreator().startMessage();
    message
        .setSender(sender)
        .setGroupable(false)
        .setRoom(room)
        .setText(msg);

    modify.getNotifier().notifyRoom(room, message.getMessage());
}
