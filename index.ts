const yargs = require("yargs-parser");
import { LinearClient } from "@linear/sdk";

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

const args = yargs(Bun.argv);

const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday
startOfWeek.setHours(0, 0, 0, 0);
const since = args.since || startOfWeek.toISOString().substring(0, 10);

const today = new Date();
const date = today.toISOString().substring(0, 10);
const outputFile = args.output || `changelog-${date}.txt`;

//  One of "triage", "backlog", "unstarted", "started", "completed", "canceled"
// https://studio.apollographql.com/public/Linear-API/variant/current/schema/visualization?focused=FIELD-WorkflowState-type&showDetails=true
const status = "completed";

async function getCompletedIssues() {
  try {
    const graphQLClient = linearClient.client;
    const response = await graphQLClient.rawRequest(
      `
      query issues {
        issues(
          filter: {
            state: { type: { eq: "${status}" }}
            ${args.project ? `project: { name: { eq: "${args.project}" }}` : ""}
            completedAt: { gte: "${since}" }
          }
        ) {
          nodes {
            id
            title
            labels {
              nodes {
                name
              }
            }
          }
        }
      }`
    );
    const issues = response.data.issues.nodes;
    const list = issues.map((issue) => ({
      title: issue.title,
      labels: issue.labels.nodes?.map((l) => l.name),
    }));

    console.log("🚚 Number of issues completed this week: ", list.length);

    console.log("🚚 Issues:");
    list.forEach((i) => console.log(i.title));

    const bulletPoints = list.map((i) => {
      const labels = i.labels.length ? `[${i.labels.join(", ")}] ` : "";
      return `- ${labels}${i.title}`;
    });

    await Bun.write(outputFile, bulletPoints.join("\n"));

    console.log("🚚 Saved list to", outputFile);

    return list;
  } catch (error) {
    console.error("Error fetching Linear issues:", error);
    throw error;
  }
}

getCompletedIssues();
