/* eslint-disable */
const chalk = require('chalk');
const inquirer = require('inquirer');
const {fetchMainThemeId} = require('../sync');
const figures = require('figures');
const {argv} = require('yargs');

const question = {
  type: 'confirm',
  name: 'continueWithDeploy',
  message: 'You are about to deploy to the published theme. Continue?',
  default: true,
  prefix: chalk.yellow(`${figures.warning} `),
};

/**
 * Prompt the user to confirm if they are about to deploy to the main theme
 *
 * @return Promise Reason for abort or empty resolve
 * @param  themeID
 */
module.exports = async function continueIfPublishedTheme(themeID) {
  if (argv.skipPrompts) {
    return question.default;
  }

  const publishedThemeId = await fetchMainThemeId();
  const currentThemeId = themeID;

  if (
    currentThemeId !== 'live' &&
    currentThemeId !== publishedThemeId.toString()
  ) {
    return question.default;
  }

  console.log();
  const answer = await inquirer.prompt([question]);

  return answer.continueWithDeploy;
};
