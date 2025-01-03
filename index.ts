const yargs = require("yargs-parser");
import { LinearClient } from "@linear/sdk";

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

const args = yargs(Bun.argv);

const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday
startOfWeek.setHours(0, 0, 0, 0);
const since = args.since || startOfWeek.toISOString();

const today = new Date();
const date = today.toISOString().substring(0, 10);
const outputFile = args.output || `changelog-${date}.txt`;

//  One of "triage", "backlog", "unstarted", "started", "completed", "canceled"
// https://studio.apollographql.com/public/Linear-API/variant/current/schema/visualization?focused=FIELD-WorkflowState-type&showDetails=true
const status = "completed";

async function getCompletedIssues() {
  try {
    const issues = await linearClient.issues({
      filter: {
        completedAt: { gte: since },
        state: { type: { eq: status } },
      },
    });

    console.log(
      "🚚 Number of issues completed this week: ",
      issues.nodes.length
    );

    const list = issues.nodes.map((node) => node.title);

    console.log("🚚 Issues:");
    list.forEach((i) => console.log(i));

    await Bun.write(outputFile, list.join("\n"));

    console.log("🚚 Saved list to", outputFile);

    return list;
  } catch (error) {
    console.error("Error fetching Linear issues:", error);
    throw error;
  }
}

getCompletedIssues();
