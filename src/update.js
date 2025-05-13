import { WebhookClient } from 'discord.js';
import { readdir, readFile } from 'node:fs/promises';

const DATA_DIR = './data';

const CHANNEL_WEBHOOKS_FILENAME = 'targets.txt';

const MESSAGE_REFERENCES_FILENAME = 'references.txt';

const readTargetsFile = async (parentPath) => {
    const contents = await readFile(`${parentPath}/${CHANNEL_WEBHOOKS_FILENAME}`, { encoding: 'utf8' });
    return contents.split('\n').map(line => {
        line = line.trim();
        if (line.startsWith('$')) {
            const envValue = process.env[line.slice(1)];
            if (!envValue) {
                throw new Error(`Missing ENV: ${line}`);
            }
            line = envValue;
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
    const inFilename = channelDir.replace(/\/*$/, '.json');
    const messages = await Promise.all(JSON.parse(await readFile(inFilename, { encoding: 'utf8' }))
        .messages
        .map(async ({ content, embeds, files: filenames }) => ({
            content,
            embeds,
            files: await Promise.all(filenames.map(path => readFile(path))),
        }))
    );
    for (const [message, messageDir] of messageDirs.map((e, i) => [messages[i], e])) {
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
            const messageId = (await client.send(message)).id;
            console.log(`  [${client.id}] Message sent (ID: ${messageId}): ${messageDir}`)
        }
    }
}
