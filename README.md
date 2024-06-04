# Lookout

**Lookout** is an open source AI-powered project management platform that streamlines project planning, execution, and monitoring. Teams can offload cognitive capacity to the AI-powered assistant for a range of tasks, including writing story descriptions, querying requirements, and keeping stakeholders informed.

![image](https://github.com/lookout-team/lookout/assets/7220175/3b56cc58-ac8a-4cff-94a8-e1609973beed)

Lookout was our capstone project for CS 467 at Oregon State University. This repo highlights our collaborative efforts towards building a full-stack web application and implementing an AI copilot. If you're interested, you can check out how we planned our sprints and groomed our stories [here](https://github.com/orgs/lookout-team/projects/1/views/1).

## Quickstart

Requires Node.js 20 or higher. Run the following commands:

```
git clone https://github.com/lookout-team/lookout.git
cd lookout
npm install
npx prisma generate
```

Then, configure your .env file. It should be located in the root directory, `/lookout/.env`.

```python
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="YOUR_API_KEY_HERE"
AUTH_SECRET="UKZDaFpcU2mDTHnjsfbDtGFE3V1LP/YQaB2MQtuorts="
```

To run the app on your local machine, use:

```
npm run dev
```

And navigate to [https://localhost:3000/home](https://localhost:3000/home). Have fun :)

## Tech Stack

1. **Framework:** Next.js
1. **Language:** TypeScript
1. **UI:** NextUI, Tailwind CSS
1. **Database ORM:** Prisma
1. **LLM:** OpenAI GPT-4o
1. **Authentication:** Auth.js
1. **Testing:** Jest

## Next Steps?

1. **Enhance UX of components rendered in conversations with the Assistant.** With a tight deadline of only 3 development sprints, we had to opt for basic key-value rendering in the end. However, components such as the sprint board or task card could have easily been reused, providing a much richer user experience! Additionally, we might allow the user to edit the data within the component and compose the message to the Assistant ourselves during the iteration process.
2. **Integrate AI-assisted completions in sprint planning and task drafting.** It could save the user a lot of time to have a first draft ready for you instead of starting from scratch.
3. **Implement LLMs from other AI Assistant providers.** Gives users the freedom to choose which provider they'd like to pay for.
4. **Integrations.** Allow users to sign in and import projects from GitHub, Bitbucket, GitLab, etc.
5. **Productionize and deploy!**

## Screenshots

### Home
![image](https://github.com/lookout-team/lookout/assets/7220175/7b4d0781-db0d-4c03-bf30-66200790a5de)

### Project Sprints
![image](https://github.com/lookout-team/lookout/assets/7220175/19d7105b-026a-4063-b663-0c5e560d6f59)
![image](https://github.com/lookout-team/lookout/assets/7220175/410b2d9e-631b-4632-a5c6-a9a3cba1d3c4)

### Task Details
![image](https://github.com/lookout-team/lookout/assets/7220175/e7ebf7e6-c51e-483b-beff-ff868dfa1e36)

### AI Assistant
![image](https://github.com/lookout-team/lookout/assets/7220175/8063c3f8-842c-4c77-8b0b-202381ab9efb)
