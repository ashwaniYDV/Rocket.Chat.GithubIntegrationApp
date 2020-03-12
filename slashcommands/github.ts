import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { GithubIntegrationApp } from '../GithubIntegrationApp';
import { getWebhookUrl } from '../lib/helpers/getWebhookUrl';
import { getRepoName, GithubSDK, sendNotification } from '../lib/sdk';

enum Command {
    Connect = 'connect',
}

export class GithubSlashCommand implements ISlashCommand {
    public command = 'github';
    public i18nParamsExample = 'github-command-example';
    public i18nDescription = 'github-command-description';
    public providesPreview = false;

    constructor(private readonly app: GithubIntegrationApp) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [command] = context.getArguments();

        switch (command) {
            case Command.Connect:
                await this.processConnectCommand(context, read, modify, http, persis);
                break;
        }
    }

    private async processConnectCommand(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [, repoUrl] = context.getArguments();
        if (!repoUrl) {
            await sendNotification('Usage: `/github connect REPO_URL`', read, modify, context.getSender(), context.getRoom());
            return;
        }

        const repoName = getRepoName(repoUrl);
        if (!repoName) {
            await sendNotification('Invalid github repo address', read, modify, context.getSender(), context.getRoom());
            return;
        }

        const sdk = new GithubSDK(http);

        try {
            await sdk.createWebhook(repoName, await getWebhookUrl(this.app));
        } catch (err) {
            console.error(err);
            await sendNotification('Error connecting to the repo', read, modify, context.getSender(), context.getRoom());
            return;
        }

        await sendNotification('Successfully connected to the repo', read, modify, context.getSender(), context.getRoom());
    }
}
