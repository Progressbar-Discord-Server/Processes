import { ButtonStyle, ComponentType } from "discord.js";
import { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { promisify } from 'util';
import { Interaction } from "../../base.js";
const wait = promisify(setTimeout)

const data = new SlashCommandBuilder()
  .setName('progressbar')
  .setDescription('Progressbar, as a discord bot minigame!');

async function execute(interaction: CommandInteraction) {
  class Progressbar extends Array {
    get getNBBlue() {
      let percentage = 0;
      for (const e of this) {
        if (e === "🟦") percentage += 10;
      }

      return percentage
    }

    get getNBOrange() {
      let percentage = 0;
      for (const e of this) {
        if (e === "🟨") percentage += 10;
      }

      return percentage
    }
  }

  const segments = [
    "🟦",
    //"🟩",
    "🟨",
    "🟥",
    "🟪",
    "⬜",
    "<a:DataMash:853137832139161630>",
  ]
  const control = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('catch')
        .setLabel('Catch')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('shy')
        .setLabel('Shy away')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('quit')
        .setLabel('Quit')
        .setStyle(ButtonStyle.Secondary)
    );
  const progressbar = new Progressbar();
  let progress = 0;
  let yellow = 0;
  let blue = 0;
  let theActualSegment = segments[Math.floor(Math.random() * segments.length)]

  const message = await interaction.reply({
    content: `${theActualSegment}\nYour progress:`,
    components: [control],
    fetchReply: true
  });
  //console.log(message)

  function getNextSegment() {
    theActualSegment = segments[Math.floor(Math.random() * segments.length)]
    if (0 === Math.floor(Math.random() * 100)) {
      theActualSegment = "🟩"
    }
    return theActualSegment;
  }
  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 600000
  });

  collector.on('collect', i => {
    if (i.user.id === interaction.user.id) {
      switch (i.customId) {
        case 'catch':
          checkSeg(theActualSegment);
          return;
        case 'shy':
          getNextSegment();
          i.update(`${theActualSegment}\nYour progress: ${progressbar.join('')}`);
          return;
        case 'quit':
          i.update({ content: `${interaction.user.username} quit.\nTheir progress: ${progressbar.join('')}`, components: [] });
          collector.stop();
          return;
      }

    }
    i.reply({ content: `this is someone else's progressbar`, ephemeral: true });

    function blueSegment() {
      progressbar.push('🟦');
      progress += 10;
      blue += 10;
      const tube = [
        '🟦',
        '🟨',
        '🟨',
        '🟨',
        '🟨',
        '🟨',
        '🟨',
        '🟨',
        '🟨',
        '🟦'
      ]
      getNextSegment();
      const isTube = progressbar.length == 10 && progressbar.every((element, index) => element === tube[index]);
      if (progress < 100) {
        i.update(`${theActualSegment}\nYour progress: ${progressbar.join('')}`);
      } else if (progress === 100) {
        if (isTube) {
          i.update({ content: `Tube!\n${progressbar.join('')}`, components: [] });
        } else if (yellow > 0) {
          i.update({ content: `Bravo!\n${progressbar.join('')}`, components: [] });
        } else {
          i.update({ content: `Perfect!\n${progressbar.join('')}`, components: [] });
        }
        collector.stop();
      }
    }
    function greenSegment() {
      progress = 100;
      progressbar.length = 0;
      yellow = 0;
      while (progressbar.length < 10) {
        progressbar.push('🟦');
      }
      wait(500);
      i.update({ content: `Perfect!\n${progressbar.join('')}`, components: [] });
      collector.stop();
    }
    function yellowSegment() {
      progressbar.push('🟨');
      progress += 10;
      yellow += 10;
      const zebra = [
        '🟦',
        '🟨',
        '🟦',
        '🟨',
        '🟦',
        '🟨',
        '🟦',
        '🟨',
        '🟦',
        '🟨'
      ];

      const isZebra = progressbar.length == zebra.length && progressbar.every((element, index) => element === zebra[index]);
      getNextSegment();
      if (progress < 100) {
        i.update(`${theActualSegment}\nYour progress: ${progressbar.join('')}`);
      } else if (progress === 100) {
        // yanderedev moment
        if (yellow === 100) {
          i.update({ content: `Nonconformist!\n${progressbar.join('')}`, components: [] });
        } else if (isZebra) {
          i.update({ content: `Zebra!\n${progressbar.join('')}`, components: [] })
        } else if (blue === 50 && yellow == 50) {
          i.update({ content: `Yin and Yang!\n${progressbar.join('')}`, components: [] })
        } else {
          i.update({ content: `Bravo!\n${progressbar.join('')}`, components: [] })
        }
        collector.stop();
      }
    }
    function redSegment() {
      i.update({ content: `You lost! \nYour Progress: ${progressbar.join('')}`, components: [] });
      collector.stop();
    }
    function pinkSegment() {
      if (progressbar[progressbar.length] == '🟨') {
        yellow -= 10;
      }
      if (progressbar.length !== 0) {
        progress -= 10;
        progressbar.pop();
      }
      getNextSegment();
      i.update(`${theActualSegment}\nYour progress: ${progressbar.join('')}`);
    }
    function greySegment() {
      getNextSegment();
      i.update(`${theActualSegment}\nYour progress: ${progressbar.join('')}`);
    }
    function checkSeg(seg: string) {
      switch (seg) {
        case "🟦":
          blueSegment();
          break;
        case "🟩":
          greenSegment();
          break;
        case "🟨":
          yellowSegment();
          break;
        case "🟥":
          redSegment();
          break;
        case "🟪":
          pinkSegment();
          break;
        case "⬜":
          greySegment();
          break;
        case "<a:DataMash:853137832139161630>": {
          const randomSeg = segments[Math.floor(Math.random() * 4)]
          checkSeg(randomSeg);
          break
        }
      }
    }
  });
}

export default new Interaction(data, execute)