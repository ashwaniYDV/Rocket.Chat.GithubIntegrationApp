import { IApiEndpointMetadata } from '@rocket.chat/apps-engine/definition/api';
import { GithubIntegrationApp } from '../../GithubIntegrationApp';

export async function getWebhookUrl(app: GithubIntegrationApp): Promise<string> {
    const accessors = app.getAccessors();

    const webhookEndpoint = accessors.providedApiEndpoints.find((endpoint) => endpoint.path === 'webhook') as IApiEndpointMetadata;
    const siteUrl = await accessors.environmentReader.getServerSettings().getValueById('Site_Url');

    return siteUrl + webhookEndpoint.computedPath;
}
