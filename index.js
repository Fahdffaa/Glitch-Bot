const dotenv = require('dotenv');
dotenv.config();

const keep_alive = require('./keep_alive');

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

const BadWordsRegex = [
    // Arabic Bad Words
    /\bنيق?ا\b/i,         // نيقا or نيق
    /\bنق?ا\b/i,          // نقا
    /\bنيق?ر\b/i,         // نيقر or نقر
    /\bبتش\b/i,           // بتش
    /\bبيتش\b/i,          // بييتش
    /\bدك\b/i,            // دك
    /\bنيق?ا?ز\b/i,       // نيقاز or نقاز
    /\bقاي\b/i,           // قاي
    /\bقي\b/i,            // قي
    /\bزوط\b/i,           // زوط
    /\bأمك\b/i,           // أمك
    /\bف?ك\b/i,           // فك or ف
    /\bمنيوك\b/i,         // منيوك
    /\bقحبته\b/i,         // قحبته
    /\bقاندو\b/i,         // قاندو
    /\bزنجى\b/i,          // زنجى
    /\bط?ي?ز\b/i,          // طيز
    /\bزفت\b/i,           // زفت
    
    // English Bad Words
    /\b(your[\W_]*mom|you[\W_]*mom)\b/i,    // "your mom", "you mom"
    /\b(f[\W_]*u[\W_]*c[\W_]*k)\b/i,          // "fuck"
    /\b(b[\W_]*i[\W_]*t[\W_]*c[\W_]*h)\b/i,    // "bitch"
    /\b(d[\W_]*i[\W_]*c[\W_]*k)\b/i,           // "dick"
    /\b(c[\W_]*u[\W_]*n[\W_]*t)\b/i,           // "cunt"
    /\b(s[\W_]*h[\W_]*i[\W_]*t)\b/i,           // "shit"
    /\b(a[\W_]*s[\W_]*s)\b/i,                  // "ass"
    /\b(m[\W_]*o[\W_]*t[\W_]*h[\W_]*e[\W_]*r)\b/i, // "mother"
    /\b(p[\W_]*r[\W_]*i[\W_]*ck)\b/i,          // "prick"
    /\b(n[\W_]*i[\W_]*g[\W_]*g[\W_]*a)\b/i,    // "nigga"
    /\b(s[\W_]*l[\W_]*u[\W_]*t)\b/i,           // "slut"
    /\b(w[\W_]*h[\W_]*o[\W_]*r[\W_]*e)\b/i,    // "whore"
    /\b(b[\W_]*a[\W_]*s[\W_]*t[\W_]*a[\W_]*r[\W_]*d)\b/i // "bastard"
];

const warnings = {}; // This will store warnings for each user

// Handle messages
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const messageContent = message.content.toLowerCase();

    // Check if any bad word exists in the message content
    const BadWordsFound = BadWordsRegex.some(regex => regex.test(messageContent));

    // Debug: log the result of the regex test
    console.log('Message content:', messageContent);
    console.log('Bad words found:', BadWordsFound);

    if (BadWordsFound) {
        console.log('Detected bad word! Applying warning...');
        
        // Increment the user's warning count
        let userWarnings = warnings[message.author.id] || 0;
        userWarnings += 1;
        warnings[message.author.id] = userWarnings;

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
        ${5 - userWarnings}`
            );

        // Send the warning to the designated channel
        const warningChannel = message.guild.channels.cache.get('1316420636075102268');
        if (warningChannel) {
            warningChannel.send({ embeds: [WarnEmbed] })
                .then(() => message.delete())
                .catch(() => console.log('Warning: Failed to send warning embed or delete message'));
        }

        // Apply timeout (10 minutes)
        const member = message.guild.members.cache.get(message.author.id);
        if (member) {
            try {
                await member.timeout(10 * 60 * 1000, 'استخدام كلمات سيئة');
            } catch (error) {
                console.warn(`Failed to apply timeout to ${message.author.tag}. Error: ${error}`);
            }
        }

        // Check if warnings exceed limit and kick the user
        if (userWarnings >= 5) {
            const punishEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`**تم طرد ${message.author.displayName}**`)
                .setDescription('**السبب** : وصول الحد الأقصى من التحذيرات');

            // Send punishment notice
            if (warningChannel) {
                warningChannel.send({ embeds: [punishEmbed] })
                    .catch(() => console.log('Warning: Failed to send punishment embed'));
            }

            // Kick the user
            const memberToKick = message.guild.members.cache.get(message.author.id);
            if (memberToKick) {
                try {
                    await memberToKick.kick('وصل الحد الأقصى من التحذيرات');
                } catch (error) {
                    console.warn(`Failed to kick ${message.author.tag}. Error: ${error}`);
                }
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