import _ from "lodash";

const configuration = {
  extends: ["github>juancarlosjr97/release-it-configuration"],
};

const fetchFromGitHub = async (pattern) => {
  const regex = /^github>([^\/]+)\/([^#]+)(?::([^#]+))?(?:#(.+))?$/;
  const match = pattern.match(regex);

  if (!match) {
    throw new Error("Invalid GitHub pattern");
  }

  const [, owner, repo, file = ".release-it.json", tag] = match;
  const branchOrTag = tag ? `refs/tags/${tag}` : "HEAD";
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branchOrTag}/${file}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return response.json();
};

const getRemoteConfigurations = async (configurations) => {
  const configs = await Promise.all(configurations.map(fetchFromGitHub));
  return _.merge({}, ...configs);
};

const response = await getRemoteConfigurations(configuration.extends);

console.log({ response });
