// Thanks for downloading my shit cfx finder!
// Everything you see here is stolen from google

// Quick Tutorial (How to code?)
// Step 1. Learn to use "CTRL-C" & "CTRL-V"
// Step 2. Visit youtube or google and search for what you need.

// Please visit my shit discord: https://discord.gg/HxmhAdCBTy
// Made by Visualz#1111

console.clear();

require('dotenv').config();
const Discord = require("discord.js");
const intents = new Discord.Intents(32767);
const { MessageEmbed } = require('discord.js');
const { on } = require('nodemon');
const request = require('request');
const client = new Discord.Client({ intents });
const PREFIX = "-";

client.on("ready", () => console.log("Cfx Finder | Bot started!"));

client.on("messageCreate", async message => {
    var serverAddress = undefined;
    var ip = undefined;
    var port = undefined;
    if (message.guild)
	if (message.content.startsWith(PREFIX)) {
        setTimeout(() => message.delete(), 1000);
        const [CMD_NAME, ...args] = message.content
                .trim()
                .substring(PREFIX.length)
                .split(/\s+/);
        if (CMD_NAME === "cfx") {
            if (args.length === 0) {
                
                // Error mesage (Only the "-cfx" command was send!)
                // People usually say "Don't touch if you don't know what you are doing!", but touch all you want, is the only way to learn!
                const embed = new MessageEmbed()
                    .setAuthor('Ninja Op | CFX Finder', 'https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                    .addField('Please enter a cfx address!', 'Example: -Cfx 6lgqdd')
                    .setThumbnail('https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));
            }

            // Request to fivem server api (https://servers-frontend.fivem.net/api/servers/single/cfx)
            request.get({
                url: `https://servers-frontend.fivem.net/api/servers/single/${args[0]}`,
                json: true,
                headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'}
              }, (err, res, data) => {
                if (err) {
                  console.log('Error:', err);
                } else if (res.statusCode !== 200) {

                    // Error mesage (Api did not response with statuscode 200)
                    const embed = new MessageEmbed()
                        .setAuthor('Ninja Op | CFX Finder', 'https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                        .addField('Cfx Address is unavaible!', 'Please try again later...')
                        .setThumbnail('https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                    return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000))

                } else {

                    // Some shit json i think.. idk, got it to work i guess
                    var iplort = data['Data']['connectEndPoints']['0'];
                    var owner = data['Data']['ownerName'];

                    if (iplort.startsWith("http")) {
                        
                        request.post({
                            url: `https://${owner}-${args[0]}.users.cfx.re/client`,
                            json: true,
                            headers: {},
                            form: "method=getEndpoints"
                        }, async (errx, resx, body) => {
                            if (errx) {
                                console.log('Error:', errx);
                            } else if (resx.statusCode !== 200) {

                                // Error mesage (Api did not response with statuscode 200)
                                const embed = new MessageEmbed()
                                    .setAuthor('Ninja Op | CFX Finder', 'https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                                    .addField('Cfx Address is unavaible!', 'Please try again later...')
                                    .setThumbnail('https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png');
                                return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));

                            } else {

                                serverAddress = await body[0];
                                var splitAddresse = serverAddress.split(":");
                                ip = splitAddresse[0];
                                port = splitAddresse[1];
                                console.log(body[0]);

                            }
                        });
                    } else {
                        serverAddress = data['Data']['connectEndPoints']['0']
                        var splitAddresse = serverAddress.split(":")
                        ip = splitAddresse[0]
                        port = splitAddresse[1]
                    }
                    if (data['Data']['vars']['onesync_enabled'] === 'true') {
                        var onesync = 'Enabled'
                    } else {
                        var onesync = 'Disabled'
                    }

                    // Another shit api request to some api lookup
                    request.get({
                        url: `http://ip-api.com/json/${ip}`,
                        json: true,
                        headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'}
                      }, (error, response, dataip) => {
                        if (error) {
                          console.log('Error:', error);
                        } else if (response.statusCode !== 200) {
                            
                            // Idk, still working i guess
                            var country = 'Timeout'
                            var isp = 'Timeout'
                            var city = 'Timeout'

                            // Embed dog shit
                            const embed = new MessageEmbed()
                                .setAuthor('Ninja Op | CFX Finder', 'https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                                .addField(':electric_plug: Server Address & Port :electric_plug:', `\`\`\`${serverAddress}\`\`\``)
                                .addField(':earth_africa: Network Information :earth_africa:', `▸Server Cfx | \`${args[0]}\`\n▸Server Address | \`${ip}\`\n▸Server Port | \`${port}\``)
                                .addField(':link: Server Information :link:', `▸Online Players | \`${data['Data']['clients']}/${data['Data']['sv_maxclients']}\`\n▸Gamebuild | \`${data['Data']['vars']['sv_enforceGameBuild']}\`\n▸Onesync | \`${onesync}\``)
                                .addField(':mag_right: IP Information :mag_right:', `▸Country | \`${country}\`\n▸ISP | \`${isp}\`\n▸City | \`${city}\``)
                                .setThumbnail('https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                            return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 60000)) // delete after 1 minute beacuse it failed most of the information

                        } else {
                            if (dataip['country'] === undefined) {
                                var country = 'Timeout'
                                var isp = 'Timeout'
                                var city = 'Timeout'
                            } else {
                                var country = dataip['country']
                                var isp = dataip['isp']
                                var city = dataip['city']
                            }

                            // Some text, just delete ;)
                            const embed = new MessageEmbed()
                                .setAuthor('Ninja Op | CFX Finder', 'https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                                .addField(':electric_plug: Server Address & Port :electric_plug:', `\`\`\`${serverAddress}\`\`\``)
                                .addField(':earth_africa: Network Information :earth_africa:', `▸Server Cfx | \`${args[0]}\`\n▸Server Address | \`${ip}\`\n▸Server Port | \`${port}\``)
                                .addField(':link: Server Information :link:', `▸Online Players | \`${data['Data']['clients']}/${data['Data']['sv_maxclients']}\`\n▸Gamebuild | \`${data['Data']['vars']['sv_enforceGameBuild']}\`\n▸Onesync | \`${onesync}\``)
                                .addField(':mag_right: IP Information :mag_right:', `▸Country | \`${country}\`\n▸ISP | \`${isp}\`\n▸City | \`${city}\``)
                                .setThumbnail('https://cdn.discordapp.com/attachments/853647945634938920/902598606266179614/Ninja.png')
                            return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 300000)) // delete after 5 minutes
                        }
                    })
                }
            });
        }
    }
});

client.login(process.env.TOKEN);
