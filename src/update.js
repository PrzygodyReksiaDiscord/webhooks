import { EmbedBuilder, WebhookClient } from 'discord.js';
import { readdir, readFile } from 'node:fs/promises';

const DATA_DIR = './data';

const files = await readdir(DATA_DIR);
for (const file of files) {
    if (!file.toLowerCase().endsWith('.json')) {
        continue;
    }
    const fullPath = `${DATA_DIR}/${file}`;
    console.log(`Processing file: ${fullPath}`);
    const contents = await readFile(fullPath, { encoding: 'utf8' });
    const parsedContents = JSON.parse(contents);
    for (const target of parsedContents.targets) {
        let url = target.url;
        console.log(` Targeting URL: ${url}`);
        if (url.startsWith('$')) {
            const envValue = process.env[url.slice(1)];
            if (!envValue) {
                throw new Error(`Missing ENV: ${url}`);
            }
            url = envValue;
        }
        const [token, id, ] = url.split('/').slice().reverse();
        const webhookClient = new WebhookClient({ id, token });
        for (const { data, reference } of parsedContents.messages) {
            const content = data.content ?? null;
            let files = [];
            if (data.attachments) {
                for (const path of data.attachments) {
                    files.push(await readFile(path));
                }
            }
            let embeds = [];
            if (data.embeds) {
                for (const embed of data.embeds) {
                    let builder = new EmbedBuilder()
                        .setAuthor(embed.author ?? null)
                        .setColor(embed.color ?? null)
                        .setDescription(embed.description ?? null)
                        .setFooter(embed.footer ?? null)
                        .setImage(embed.image ?? null)
                        .setTimestamp(embed.timestamp ?? null)
                        .setTitle(embed.title ?? null)
                        .setURL(embed.url ?? null);
                    if (embed.thumbnail) {
                        builder = builder.setThumbnail(embed.thumbnail.url ?? null);
                    }
                    embeds.push(builder);
                }
            }
            const message = {
                content,
                embeds,
                files,
            };
            let currentReference;
            if (reference) {
                if (typeof reference === 'string') {
                    currentReference = reference;
                } else {
                    currentReference = reference[target.url];
                }
            }
            if (currentReference) {
                const messageId = currentReference.split('/').slice().reverse()[0];
                await webhookClient.editMessage(messageId, message);
                console.log(`  Message edited (ID: ${messageId})!`);
            } else {
                const messageId = (await webhookClient.send(message)).id;
                console.log(`  Message sent (ID: ${messageId})!`);
            }
        }
    }
}
