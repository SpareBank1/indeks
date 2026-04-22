import {
    GetLocalVariablesResponse,
    PostVariablesRequestBody,
    PostVariablesResponse,
} from '@figma/rest-api-spec';

export default class FigmaApi {
    private baseUrl = 'https://api.figma.com';
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    async getLocalVariables(fileKey: string): Promise<GetLocalVariablesResponse> {
        const resp = await fetch(`${this.baseUrl}/v1/files/${fileKey}/variables/local`, {
            headers: {
                Accept: '*/*',
                'X-Figma-Token': this.token,
            },
        });
        if (!resp.ok) throw new Error(`Figma API feil: ${resp.status} ${resp.statusText}`);
        return resp.json() as Promise<GetLocalVariablesResponse>;
    }

    async postVariables(
        fileKey: string,
        payload: PostVariablesRequestBody
    ): Promise<PostVariablesResponse> {
        const resp = await fetch(`${this.baseUrl}/v1/files/${fileKey}/variables`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'X-Figma-Token': this.token,
            },
            body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error(`Figma API feil: ${resp.status} ${resp.statusText}`);
        return resp.json() as Promise<PostVariablesResponse>;
    }
}
