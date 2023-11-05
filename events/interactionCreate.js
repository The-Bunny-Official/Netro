const client = require("../index");

module.exports = {
    name: "interactionCreate", 
    run: async (interaction) => {
      // Slash Command Handling
      if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) {return interaction.reply({ ephemeral: true, content: "An error has occured " });}

        const args = [];

        for (let option of interaction.options.data) {
          if (option.type === "SUB_COMMAND") {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
              if (x.value) args.push(x.value);
            });
          }
          else if (option.value) {args.push(option.value);}
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args).catch((e) => client.emit("error", e));
      }

      // Context Menu Handling
      if (interaction.isContextMenu()) {
        await interaction.deferReply();
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction).catch(e => client.emit("error", e));
      }
    }
};
