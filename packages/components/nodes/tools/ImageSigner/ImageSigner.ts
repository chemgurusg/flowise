interface INodeParams {
    label: string
    name: string
    type: string
    default?: any
    secret?: boolean
}

interface INodeData {
    inputs?: {
        [key: string]: string | number
    }
}

interface INode {
    label: string
    name: string
    type: string
    icon?: string
    category?: string
    description?: string
    inputs?: INodeParams[]
    run(nodeData: INodeData): Promise<any>
}

import crypto from 'crypto';

class ImageSignerTool implements INode {
    label = 'Image Signer Tool';
    name = 'imageSignerTool';
    type = 'Tool';
    icon = 'globe.svg';
    category = 'Utilities';
    description = 'Signs image_id with token and expiry';

    inputs: INodeParams[] = [
        {
            label: 'Image ID',
            name: 'image_id',
            type: 'string'
        },
        {
            label: 'Secret Key',
            name: 'secret_key',
            type: 'string',
            secret: true
        },
        {
            label: 'Expiry (in seconds)',
            name: 'expiry_seconds',
            type: 'number',
            default: 300
        }
    ];

    async run(nodeData: INodeData): Promise<any> {
        const image_id = nodeData.inputs?.image_id as string;
        const secret_key = nodeData.inputs?.secret_key as string;
        const expiry = Math.floor(Date.now() / 1000) + (nodeData.inputs?.expiry_seconds as number || 300);

        const sig = crypto
            .createHmac('sha256', secret_key)
            .update(image_id + expiry)
            .digest('hex');

        const signed_url = `https://chemistryguru.com.sg/get-image.php?id=${image_id}&expires=${expiry}&sig=${sig}`;
        return { signed_image_url: signed_url };
    }
}

module.exports = { nodeClass: ImageSignerTool };
