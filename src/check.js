import { EmbedBuilder, MessageFlags } from 'discord.js';
import { readdir, readFile } from 'node:fs/promises';

const DATA_DIR = './data';

const MESSAGE_BODY_FILENAME = 'content.md';
const MESSAGE_THREAD_NAME_FILENAME = 'thread_name.txt';
const MESSAGE_THREAD_ID_FILENAME = 'thread_id.txt';
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
        return ensureNotEmpty(contents).trim();
    } catch { }
    return ensureNotEmpty('');
};

const buildEmbed = async (parentPath) => {
    let builder = new EmbedBuilder();
    try {
        const title = await readFile(`${parentPath}/${EMBED_TITLE_FILENAME}`, { encoding: 'utf8' });
        builder.setTitle(ensureNotEmpty(title).trim());
    } catch {}
    try {
        const body = await readFile(`${parentPath}/${EMBED_BODY_FILENAME}`, { encoding: 'utf8' });
        builder.setDescription(ensureNotEmpty(body).trim());
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
        builder.setURL(hyperlink.trim());
    } catch {}
    try {
        const thumbnail = await readFile(`${parentPath}/${EMBED_THUMBNAIL_FILENAME}`, { encoding: 'utf8' });
        builder.setThumbnail(thumbnail.trim());
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

const readThreadName = async (parentPath) => {
    try {
        const contents = await readFile(`${parentPath}/${MESSAGE_THREAD_NAME_FILENAME}`, { encoding: 'utf8' });
        return ensureNotEmpty(contents);
    } catch {
        return undefined;
    }
};

const readThreadId = async (parentPath) => {
    try {
        const contents = await readFile(`${parentPath}/${MESSAGE_THREAD_ID_FILENAME}`, { encoding: 'utf8' });
        return contents;
    } catch {
        return undefined;
    }
};

const buildMessage = async (parentPath) => {
    const content = await readMessageBody(parentPath);
    const embeds = await readEmbeds(parentPath);
    const files = await readAttachments(parentPath);
    return {
        content,
        embeds,
        files,
    };
};

const channelDirs = (await readdir(DATA_DIR, { withFileTypes: true }))
    .filter(e => e.isDirectory())
    .map(e => `${DATA_DIR}/${e.name}`);

const errors = [];

for (const channelDir of channelDirs) {
    const messageDirs = (await readdir(channelDir, { withFileTypes: true }))
        .filter(e => e.isDirectory())
        .map(e => `${channelDir}/${e.name}`);
    messageDirs.sort();
    for (const messageDir of messageDirs) {
        console.log(`Checking message dir: ${messageDir}`);
        const threadName = await readThreadName(messageDir);
        const threadId = await readThreadId(messageDir);
        const message = {
            ...await buildMessage(messageDir),
            threadName,
            threadId,
            flags: MessageFlags.SuppressNotifications,
        };

        const logError = errorMessage => {
            console.error('  ' + errorMessage);
            errors.push(new Error(`[${messageDir}] ${errorMessage}`));
        };

        const contentLength = message.content.length;
        if (contentLength > 2000) {
            logError(`Message content exceeds 2000 characters (is ${contentLength})`);
        }

        const fileCount = message.files.length;
        if (fileCount > 10) {
            logError(`Message has over 10 attachments (has ${fileCount})`);
        }
        const fileSize = message.files.reduce((acc, val) => acc + val.byteLength, 0);
        if (fileSize > 25 * 1024 * 1024) {
            logError(`Total size of attachments exceeds 25 MiB (is ${fileSize} bytes)`);
        }

        const embedCount = message.embeds.length;
        if (embedCount > 10) {
            logError(`Message has over 10 embeds (has ${embedCount})`);
        }
        let totalEmbeddedTextLength = 0;
        const urlMap = new Map();
        for (let i = 0; i < message.embeds.length; i++) {
            const embed = message.embeds[i].data;

            if (embed.url) {
                if (urlMap.has(embed.url)) {
                    logError(`URL of embed #${i} duplicated (is the same as in embed #${urlMap.get(embed.url)})`);
                }
                urlMap.set(embed.url, i);
            }

            const titleLength = (embed.title ?? '').length;
            if (titleLength > 256) {
                logError(`Title of embed #${i} exceeds 256 characters (is ${titleLength})`);
            }
            totalEmbeddedTextLength += titleLength;

            const descriptionLength = (embed.description ?? '').length;
            if (descriptionLength > 4096) {
                logError(`Description of embed #${i} exceeds 4096 characters (is ${descriptionLength})`);
            }
            totalEmbeddedTextLength += descriptionLength;

            const fieldCount = (embed.fields ?? []).length;
            if (fieldCount > 25) {
                logError(`Embed #${i} has over 25 fields (has ${fieldCount})`);
            }
            for (let j = 0; j < (message.fields ?? []).length; j++) {
                const field = embed.fields[j];

                const fieldNameLength = field.name.length;
                if (fieldNameLength > 256) {
                    logError(`Name of field #${j} in embed #${i} exceeds 256 characters (is ${fieldNameLength})`);
                }
                totalEmbeddedTextLength += fieldNameLength;

                const fieldValueLength = field.value.length;
                if (fieldValueLength > 1024) {
                    logError(`Value of field #${j} in embed #${i} exceeds 1024 characters (is ${fieldValueLength})`);
                }
                totalEmbeddedTextLength += fieldValueLength;
            }

            const footerTextLength = (embed.footer?.text ?? '').length;
            if (footerTextLength > 2048) {
                logError(`Footer text of embed #${i} exceeds 2048 characters (is ${footerTextLength})`);
            }
            totalEmbeddedTextLength += footerTextLength;

            const authorNameLength = (embed.author?.name ?? '').length;
            if (authorNameLength.length > 256) {
                logError(`Author name of embed #${i} exceeds 256 characters (is ${authorNameLength})`);
            }
            totalEmbeddedTextLength += authorNameLength;
        }
        if (totalEmbeddedTextLength > 6000) {
            logError(`Total length of text in embeds exceeds 6000 (is ${totalEmbeddedTextLength})`);
        }
    }
}

if (errors.length > 0) {
    throw errors;
}
