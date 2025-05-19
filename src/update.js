import { EmbedBuilder, WebhookClient } from 'discord.js';
import { readdir, readFile, appendFile } from 'node:fs/promises';

const GUILD_ID = '822931925618524240';

const DATA_DIR = './data';

const CHANNEL_WEBHOOKS_FILENAME = 'targets.txt';

const MESSAGE_REFERENCES_FILENAME = 'references.txt';
const MESSAGE_BODY_FILENAME = 'content.md';
const MESSAGE_EMBEDS_DIRNAME = 'embeds';
const MESSAGE_ATTACHMENTS_DIRNAME = 'attachments';

const EMBED_TITLE_FILENAME = 'title.md';
const EMBED_BODY_FILENAME = 'description.md';
const EMBED_COLOR_FILENAME = 'color.txt';
const EMBED_HYPERLINK_FILENAME = 'url.txt';
const EMBED_THUMBNAIL_FILENAME = 'thumbnail.txt';

const ensureNotEmpty = (str) => (str.trim().length > 0) ? str : '** **';

const readTargetsFile = async (parentPath) => {
    const contents = await readFile(`${parentPath}/${CHANNEL_WEBHOOKS_FILENAME}`, { encoding: 'utf8' });
    return contents
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            if (line.startsWith('$')) {
                const envValue = process.env[line.slice(1)];
                if (!envValue) {
                    throw new Error(`Missing ENV: ${line}`);
                }
                line = envValue;
            }
            if (line.match(/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/) === null) {
                throw new Error(`Expected a webhook URL: ${line}`);
            }
            return line;
        });
};

const readReferencesFile = async (parentPath) => {
    try {
        const contents = await readFile(`${parentPath}/${MESSAGE_REFERENCES_FILENAME}`, { encoding: 'utf8' });
        return contents.split('\n').map(line => line.trim().split('/').slice().reverse()[0]);
    } catch {
        return [];
    }
};

const readMessageBody = async (parentPath) => {
    try {
        const contents = await readFile(`${parentPath}/${MESSAGE_BODY_FILENAME}`, { encoding: 'utf8' });
        return ensureNotEmpty(contents);
    } catch {
        return ensureNotEmpty('');
    }
};

const buildEmbed = async (parentPath) => {
    let builder = new EmbedBuilder();
    try {
        const title = await readFile(`${parentPath}/${EMBED_TITLE_FILENAME}`, { encoding: 'utf8' });
        builder.setTitle(ensureNotEmpty(title));
    } catch {}
    try {
        const body = await readFile(`${parentPath}/${EMBED_BODY_FILENAME}`, { encoding: 'utf8' });
        builder.setDescription(ensureNotEmpty(body));
    } catch {}
    try {
        const color = await readFile(`${parentPath}/${EMBED_COLOR_FILENAME}`, { encoding: 'utf8' });
        try {
            builder.setColor(JSON.parse(color));
        } catch {
            const parsedColorNumber = parseInt(color);
            if (!isNaN(parsedColorNumber)) {
                builder.setColor(parsedColorNumber);
            } else {
                builder.setColor(color);
            }
        }
    } catch {}
    try {
        const hyperlink = await readFile(`${parentPath}/${EMBED_HYPERLINK_FILENAME}`, { encoding: 'utf8' });
        builder.setURL(hyperlink);
    } catch {}
    try {
        const thumbnail = await readFile(`${parentPath}/${EMBED_THUMBNAIL_FILENAME}`, { encoding: 'utf8' });
        builder.setThumbnail(thumbnail);
    } catch {}
    return builder;
};

const readEmbeds = async (parentPath) => {
    try {
        const embedDirs = (await readdir(`${parentPath}/${MESSAGE_EMBEDS_DIRNAME}`, { withFileTypes: true }))
            .filter(e => e.isDirectory())
            .map(e => `${parentPath}/${MESSAGE_EMBEDS_DIRNAME}/${e.name}`);
        embedDirs.sort();
        return await Promise.all(embedDirs.map(dir => buildEmbed(dir)));
    } catch {
        return [];
    }
};

const readAttachments = async (parentPath) => {
    try {
        const attachmentPaths = (await readdir(`${parentPath}/${MESSAGE_ATTACHMENTS_DIRNAME}`, { withFileTypes: true }))
            .filter(e => e.isFile())
            .map(e => `${parentPath}/${MESSAGE_ATTACHMENTS_DIRNAME}/${e.name}`);
        attachmentPaths.sort();
        return await Promise.all(attachmentPaths.map(path => readFile(path)));
    } catch {
        return [];
    }
};

const buildMessage = async (parentPath) => {
    const content = await readMessageBody(parentPath);
    const embeds = await readEmbeds(parentPath);
    const files = await readAttachments(parentPath);
    return {
        content,
        embeds,
        files
    };
};

const channelDirs = (await readdir(DATA_DIR, { withFileTypes: true }))
    .filter(e => e.isDirectory())
    .map(e => `${DATA_DIR}/${e.name}`);
for (const channelDir of channelDirs) {
    const targets = await readTargetsFile(channelDir);
    const webhookClients = targets.map(target => {
        const [token, id, ] = target.split('/').slice().reverse();
        const client = new WebhookClient({ id, token });
        return client;
    });
    const messageDirs = (await readdir(channelDir, { withFileTypes: true }))
        .filter(e => e.isDirectory())
        .map(e => `${channelDir}/${e.name}`);
    messageDirs.sort();
    for (const messageDir of messageDirs) {
        const message = await buildMessage(messageDir);
        const editedMessageIds = await readReferencesFile(messageDir);
        const unusedClients = new Set(webhookClients);
        for (const messageId of editedMessageIds) {
            for (const client of unusedClients) {
                let couldRead = true;
                try {
                    await client.fetchMessage(messageId);
                } catch (err) {
                    couldRead = false;
                }
                if (!couldRead) {
                    continue;
                }
                unusedClients.delete(client);
                await client.editMessage(messageId, message);
                console.log(`  [${client.id}] Message edited (ID: ${messageId}): ${messageDir}`);
            }
        }
        for (const client of unusedClients) {
            const sentMessage = (await client.send(message));
            console.log(`  [${client.id}] Message sent (ID: ${sentMessage.id}): ${messageDir}`);
            await appendFile(
                `${messageDir}/${MESSAGE_REFERENCES_FILENAME}`,
                `https://discord.com/channels/${GUILD_ID}/${sentMessage.channel_id}/${sentMessage.id}\n`,
                { encoding: 'utf8' }
            );
        }
    }
}
