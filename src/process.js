import { EmbedBuilder } from 'discord.js';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const DATA_DIR = './data';

const MESSAGE_BODY_FILENAME = 'content.md';
const MESSAGE_EMBEDS_DIRNAME = 'embeds';
const MESSAGE_ATTACHMENTS_DIRNAME = 'attachments';

const EMBED_TITLE_FILENAME = 'title.md';
const EMBED_BODY_FILENAME = 'description.md';
const EMBED_COLOR_FILENAME = 'color.txt';
const EMBED_HYPERLINK_FILENAME = 'url.txt';
const EMBED_THUMBNAIL_FILENAME = 'thumbnail.txt';

const ensureNotEmpty = (str) => (str.trim().length > 0) ? str : '** **';

const readMessageBody = async (parentPath) => {
    try {
        const contents = await readFile(`${parentPath}/${MESSAGE_BODY_FILENAME}`, { encoding: 'utf8' });
        return ensureNotEmpty(contents);
    } catch {
        return null;
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
        return null;
    }
};

const readAttachments = async (parentPath) => {
    try {
        const attachmentPaths = (await readdir(`${parentPath}/${MESSAGE_ATTACHMENTS_DIRNAME}`, { withFileTypes: true }))
            .filter(e => e.isFile())
            .map(e => `${parentPath}/${MESSAGE_ATTACHMENTS_DIRNAME}/${e.name}`);
        attachmentPaths.sort();
        return (await Promise.all(attachmentPaths.map(path => readFile(path).then(buffer => ({ path, buffer })))))
            .map(({ path, buffer }) => ({ path, buffer: buffer.toString('base64') }));
    } catch {
        return null;
    }
};

const buildMessage = async (parentPath) => {
    const content = await readMessageBody(parentPath);
    const embeds = await readEmbeds(parentPath);
    const files = await readAttachments(parentPath);
    return {
        parentPath,
        content,
        embeds,
        files
    };
};

const channelDirs = (await readdir(DATA_DIR, { withFileTypes: true }))
    .filter(e => e.isDirectory())
    .map(e => `${DATA_DIR}/${e.name}`);
for (const channelDir of channelDirs) {
    const messageDirs = (await readdir(channelDir, { withFileTypes: true }))
        .filter(e => e.isDirectory())
        .map(e => `${channelDir}/${e.name}`);
    messageDirs.sort();
    const messages = await Promise.all(messageDirs.map(buildMessage));
    const outFilename = channelDir.replace(/\/*$/, '.json');
    await writeFile(outFilename, JSON.stringify({ messages }), { encoding: 'utf8' });
}
