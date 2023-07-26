// Don't forget to copy this file as config.ts!

export const bot = {
  token: "The token of the bot",
  beta: false
}

export const sequelize = {
  database: "The database name",
  username: "The username of the mysql database",
  password: "The password of the mysql user",
}

export const logging = {
  error: "Set a channel ID here! Will post logging informating like errors & warnings",
  moderation: "Set a channel ID here: Will post all thing about moderation, ban log, timeout log, warn log, etc..."
}

export const ownersIds = ["Insert user Ids here as", "in", "this way"]

export const keys = {
  pastee: "A key to automatically upload to https://paste.ee (used only in the get command)",
}

export const starboard = {
  enable: false,
}

export const socials = {
  mastodon: {
    enable: false
  }
}
