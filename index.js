const dotenv = require('dotenv');
dotenv.config();

// Keep Alive Code
const keep_alive = require('./keep_alive.js')

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ],
});

// Event: Bot Ready
client.once('ready', () => {
    console.log('The bot is ready!');
});

const BotControllerID = '1318894826225270814';

// Rules Embed
const RulesEmbed = new EmbedBuilder()
    .setColor('Yellow')
    .setTitle('**القوانين | RULES**')
    .setDescription(
        `# المحتوى الممنوع  
- طلب أدمن  
- نشر سيرفرات  
- روابط ضارة  
- فتح تكت بدون سبب  
- عنصرية  
- إسبام  

# الرسائل المحظورة  
- سب وشتم  
- أشياء غير أخلاقية  
- تهديد  
- نشر معلومات خاصة`
    );

const GuildsEmbed = new EmbedBuilder()
    .setColor('White')
    .setTitle('**التعليمات | GUILDS**')
    .setDescription(
        `# أخذ رتب
تفاعل في الشاتات - مساعدات - بلاغات مفيدة  

# استعمال الأوامر
في شات: <#1316713797930586143>  

# بلاغات أو أخطاء 
فتح تكت من: <#1316433097973039114>  

# أخذ أدمن
في أحلامك
# كوماندات البوت
!setwarns
!resetwarns
!warn
!guilds
!rules
!currentwarns

# استعمال (ادمن)
**!setwarns**
!setwarns "منشن للعضو" "عدد التحذيرات"

**!resetwarns**
!resetwarns "منشن للعضو"

**!warn**
!warn "منشن للعضو" "السبب"

**!guilds**
!guilds

**!rules**
!rules

# استعمال (الكل)
!currentwarns او !currentwarns "منشن للعضو"`
    );

// Punishments Embed
const PunishmentsEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('**تم طرد العضو**')
    .setDescription(
        `**العقوبة**: طرد من السيرفر  
**السبب**: وصول الحد الأقصى من التحذيرات`
    );

// Regular expressions to match variations of bad words
const BadWordsRegex = [
    /n[\W_]*i[\W_]*g[\W_]*g[\W_]*a/i,
    /n[\W_]*i[\W_]*g[\W_]*g[\W_]*e?r/i,
    /a[\W_]*s[\W_]*s/i,
    /a[\W_]*s[\W_]*s[\W_]*h[\W_]*o[\W_]*l[\W_]*e/i,
    /h[\W_]*e[\W_]*l[\W_]*l/i,
    /g[\W_]*o[\W_]*t[\W_]*o[\W_]*h[\W_]*e[\W_]*l[\W_]*l/i,
    /z[\W_]*o[\W_]*t/i,
    /g[\W_]*a[\W_]*y/i,
    /b[\W_]*i[\W_]*t[\W_]*c[\W_]*h/i,
    /d[\W_]*i[\W_]*c[\W_]*k/i,
    /ني[\W_]*ق[\W_]*ا/i,
    /ن[\W_]*ق[\W_]*ا/i,
    /ني[\W_]*ق[\W_]*ر/i,
    /ن[\W_]*ق[\W_]*ر/i,
    /ب[\W_]*ت[\W_]*ش/i,
    /ب[\W_]*ي[\W_]*ت[\W_]*ش/i,
    /د[\W_]*ك/i,
    /ني[\W_]*ق[\W_]*ا[\W_]*ز/i,
    /ن[\W_]*ق[\W_]*ا[\W_]*ز/i,
    /ني[\W_]*ق[\W_]*ر[\W_]*ز/i,
    /ن[\W_]*ق[\W_]*ر[\W_]*ز/i,
    /ق[\W_]*ا[\W_]*ي/i,
    /ق[\W_]*ي/i,
    /ز[\W_]*و[\W_]*ط/i,
    /ا[\W_]*م[\W_]*ك/i,
    /your[\W_]*mom/i,
    /you[\W_]*mom/i,
    /f[\W_]*u[\W_]*c[\W_]*k/i,
    /ف[\W_]*ك/i,
    /م[\W_]*ن[\W_]*ي[\W_]*و[\W_]*ك/i,
    /ق[\W_]*ح[\W_]*ب[\W_]*ه/i,
    /ق[\W_]*ا[\W_]*ن[\W_]*د[\W_]*و/i,
    /ز[\W_]*و[\W_]*ط/i,
    /ز[\W_]*ن[\W_]*ج[\W_]*ي/i,
    /g[\W_]*y[\W_]*a[\W_]*t/i,         
    /ط[\W_]*ي[\W_]*ز/i,                
    /ا[\W_]*س[\W_]*ت/i,                
    /ز[\W_]*ف[\W_]*ت/i                 
];

// Warning Map
const warnings = {};

// Bad Words Detection
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const messageContent = message.content.toLowerCase();
    const BadWordsFound = BadWordsRegex.some(regex => regex.test(messageContent));
    const userId = message.author.id;

    if (!warnings[userId]) warnings[userId] = 0;

    if (BadWordsFound) {
        warnings[userId]++;
        const WarnEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`**تحذير إلى ${message.author.displayName}**`)
            .setDescription(
                `**السبب**  
    كلام سيء  

    **العقوبة**  
    تايم أوت  

    **المدة**  
    10 دقائق  

    **محتوى الرسالة**  
    ${message.content}  

    **التحذيرات المتبقية**  
    ${5 - warnings[userId]}`
            );

        // تحديد قناة التحذيرات
        const warningChannel = message.guild.channels.cache.get('1316420636075102268');
        
        // إرسال التحذير إلى القناة
        if (warningChannel) {
            warningChannel.send({ embeds: [WarnEmbed] }).then(() => message.delete());
        } else {
            console.error('Channel not found');
        }

        // Apply timeout (10 minutes)
        const member = message.guild.members.cache.get(userId);
        if (member) {
            member.timeout(10 * 60 * 1000, 'استخدام كلمات سيئة') // 10 minutes in milliseconds
                .catch(async () => {
                    console.log('cant timeout member');
                });
        }

        // Check if warnings exceed limit and kick the user
        if (warnings[userId] >= 5) {
            const punishEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`**تم طرد ${message.author.displayName}**`)
                .setDescription('**السبب** : وصول الحد الأقصى من التحذيرات');

            // Send punishment notice
            if (warningChannel) {
                warningChannel.send({ embeds: [punishEmbed] });
            }

            // Kick the user
            const memberToKick = message.guild.members.cache.get(userId);
            if (memberToKick) {
                memberToKick.kick('وصل الحد الأقصى من التحذيرات')
                    .catch(console.log('cant kick member'));
            }
        }
    }
});

// ALL COMMANDS HERE

// Command: !rules
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === '!rules') {
        if (message.member.roles.cache.some(role => role.id === BotControllerID)) {
            message.channel.send({ embeds: [RulesEmbed] }).then(() => message.delete());
        } else {
            message.channel.send(`ليس لديك صلاحية لستعمال الامر ${message.author}`)
                .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000))
                .then(() => message.delete());
        }
    }
});

// Command: !guilds
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === '!guilds') {
        if (message.member.roles.cache.some(role => role.id === BotControllerID)) {
            message.channel.send({ embeds: [GuildsEmbed] }).then(() => message.delete());
        } else {
            message.channel.send(`ليس لديك صلاحية لستعمال الامر ${message.author}`)
                .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000))
                .then(() => message.delete());
        }
    }
});

// Command FOR ADMIN : !resetwarns
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('!resetwarns')) {
        if (message.member.roles.cache.some(role => role.id === BotControllerID)) {
            const mentionedUser = message.mentions.users.first();
            if (mentionedUser) {
                const userId = mentionedUser.id;
                warnings[userId] = 0;
                message.reply(`تم اعادة تعين التحذيرات الى : ${mentionedUser.displayName}`)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000))
                    .then(() => message.delete());
            } else {
                message.reply('من فضلك قم بمنشن الشخص الذي تريد اعادة تعين تحذيراته')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000));
            }
        } else {
            message.channel.send(`ليس لديك صلاحية لستعمال الامر ${message.author}`)
                .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000))
                .then(() => message.delete());
        }
    }
});

// Command FOR ADMIN : !setwarns
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('!setwarns')) {
        if (message.member.roles.cache.some(role => role.id === BotControllerID)) {
            const mentionedUser = message.mentions.users.first();
            const args = message.content.split(' ');
            const warnCount = parseInt(args[2], 10);

            if (mentionedUser && !isNaN(warnCount)) {
                const userId = mentionedUser.id;
                warnings[userId] = warnCount;
                message.reply(`تم تعين تحذيرات ${mentionedUser.displayName} الى **${warnCount}**`)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000))
                    .then(() => message.delete());
            } else {
                message.reply('من فضلك قم بمنشن الشخص وادخل عدد التحذيرات الصحيح')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000));
            }
        } else {
            message.channel.send(`ليس لديك صلاحية لستعمال الامر ${message.author}`)
                .then(sentMessage => setTimeout(() => sentMessage.delete(), 5000))
                .then(() => message.delete());
        }
    }
});

// Command: !warn
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('!warn')) {
        if (message.member.roles.cache.some(role => role.id === BotControllerID)) {
            const args = message.content.split(' ');
            const mentionedUser = message.mentions.users.first();
            const reason = args.slice(2).join(' ');

            if (mentionedUser && reason) {
                const userId = mentionedUser.id;
                if (!warnings[userId]) warnings[userId] = 0;

                warnings[userId]++;
                const warnCount = warnings[userId];

                const WarnEmbed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle(`**تحذير إلى ${mentionedUser.displayName}**`)
                    .setDescription(
                        `**السبب**  
            ${reason} 
        
            **العقوبة**  
            تايم أوت  
        
            **المدة**  
            10 دقائق  
        
            **التحذيرات المتبقية**  
            ${5 - warnings[userId]}`
                    );

                // تحديد قناة التحذيرات
                const warningChannel = message.guild.channels.cache.get('1316420636075102268');
                
                // إرسال التحذير إلى القناة
                if (warningChannel) {
                    warningChannel.send({ embeds: [WarnEmbed] }).then(() => message.delete());
                } else {
                    console.error('Channel not found');
                }

                // Apply timeout (10 minutes)
                const member = message.guild.members.cache.get(userId);
                if (member) {
                    member.timeout(10 * 60 * 1000, 'استخدام كلمات سيئة') // 10 minutes in milliseconds
                        .catch(async (error) => {
                            console.error(error);
                        });
                }

                // Check if warnings exceed limit and kick the user
                if (warnings[userId] >= 5) {
                    const punishEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle(`**تم طرد ${mentionedUser.displayName}**`)
                        .setDescription('**السبب** : وصول الحد الأقصى من التحذيرات');

                    // Send punishment notice
                    if (warningChannel) {
                        warningChannel.send({ embeds: [punishEmbed] });
                    }

                    // Kick the user
                    const memberToKick = message.guild.members.cache.get(userId);
                    if (memberToKick) {
                        memberToKick.kick('وصل الحد الأقصى من التحذيرات')
                            .catch(console.error);
                    }
                }
            }
        }
    }
});

// Command: !currentwarns
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('!currentwarns')) {
        const mentionedUser = message.mentions.users.first(); // Get the mentioned user, if any
        const userId = mentionedUser ? mentionedUser.id : message.author.id; // Default to the author if no user is mentioned
        const displayName = mentionedUser ? mentionedUser.displayName : message.author.displayName; // Default to the author's username
        const warnCount = warnings[userId] || 0; // Get the warning count, or 0 if none

        const WarnStatusEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`**تحذيرات ${displayName}**`)
            .setDescription(`**التحذيرات المتبقية**
                ${5 - warnCount}
                **التحذيرات الحالية**
                ${warnCount}
                `);

        message.reply({ embeds: [WarnStatusEmbed] })
            .then(() => message.delete())
            .catch(console.error);
    }
});

// Login with bot token
client.login(process.env.TOKEN);
