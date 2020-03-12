import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { WebhookEndpoint } from './endpoints/WebhookEndpoint';
import { GithubSlashCommand } from './slashcommands/github';

export class GithubIntegrationApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [
                new WebhookEndpoint(this),
            ],
        });

        configuration.settings.provideSetting({
            id: 'github-username-alias',
            public: true,
            required: false,
            type: SettingType.STRING,
            packageValue: 'GitHub',
            i18nLabel: 'github-username-alias',
            i18nDescription: 'github-username-alias-description',
        });

        configuration.slashCommands.provideSlashCommand(new GithubSlashCommand(this));
    }
}
