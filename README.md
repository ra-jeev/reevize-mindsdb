# Reevize

Reevize is a quiz generator application. It uses AI to generate multiple choice or true/false type questions based on the imput text.

For generating the questions, a MindsDB connected OpenAI model is used.

For database, a TiDB serverless instance is used which is connected to MindsDB through a database handler plugin.

The application also uses the Google Cloud Vision APIs to extract text from images. More details can be found [here](https://cloud.google.com/vision/docs/ocr)

The application is built using the Nuxt3 framework.

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## MindsDB setup

We can use a local MindsDB docker instance or the demo cloud instance for using MindsDB.

For connecting to TiDB from MindsDB we need to create a database using the below syntax:

```sql
CREATE DATABASE <MindsDB_DB_name>
WITH ENGINE = "tidb",
PARAMETERS = {
    "user": "<TiDB_user>",
    "password": "<TiDB_password>",
    "host": "<TiDB_host>",
    "port": 4000,
    "database": "<DB_name>"
};
```

Then, we can create a MindsDB project for keeping our models together.

```sql
CREATE PROJECT <Project_Name>
```

Now it is time to create our OpenAIs model. To do this we use the MindsDB prompt template as shown below:

```sql
CREATE MODEL reevize.questions_model
PREDICT questions
USING
    engine = 'openai',
    max_tokens = 1400,
    api_key = '<your_open_ai_key>', -- Not needed if you're using the MindsDB demo cloud
    prompt_template = 'You are a teacher who has to create a quiz for your students. To test their knowledge create {{mcqCount}} MCQs and {{trueCount}} True/False questions using the given text: {{text}}. The questions should be distinct & the answer must match one of the options. Return a RFC8259 compliant JSON array without any newlines/whitespaces and explanation in the following format: [{"text":"The MCQ question","options":["Option 1",...,"Option 4"],"answer":"the correct option"},{"text":"The true/false question","options":["True","False"],"answer":"the correct option"},...].',
    temperature = 0.3;
```

_**Note:** Since we're creating an app, it is better to be explicit about the response structure we need from OpenAI. Even after this template, sometimes we don't get the response in the needed format. Maybe fine tuning the model as mentioned [here](https://docs.mindsdb.com/integrations/ai-engines/openai#fine-tuning-of-openai-models) will help with this._

**Testing the Model**
We can test the model using the below query

```sql
SELECT
    questions
FROM
    reevize.questions_model
WHERE
    text = "Lila was a young girl who loved nothing more than playing in her grandmother's garden. She loved the sweet smell of the flowers and the way the sun shone through the trees. But one day, while playing in the garden, Lila's favorite locket fell off her neck and into the bushes. Lila searched high and low for her locket, but it was nowhere to be found. She was devastated, as the locket had been a gift from her late mother, and it held great sentimental value for her. Days turned into weeks, and still no sign of the locket. Lila had given up hope of ever finding it, until one day, she received a surprise in the mail. It was a package from her grandmother, who had found the locket in the garden. Overjoyed, Lila rushed to her grandmother's house to thank her and retrieve the locket. But when she arrived, her grandmother had a surprise for her. She had also found an old letter inside the locket, written by Lila's mother before she passed away. The letter was filled with words of love and encouragement, and it brought tears to Lila's eyes as she read it. She felt her mother's presence with her, and knew that the locket had been a gift from her mother in more ways than one. From that day forward, Lila wore her locket every day, and felt her mother's love and guidance with her always. And every time she played in her grandmother's garden, she remembered the day she had lost her locket, and how it had brought her an unexpected gift of love and connection with her mother."
AND
    mcqCount = 10
AND
    trueCount = 4;
```

Amd the response received is (Below text is formatted for clarity, the actual response doesn't contain and whitespace / newlines):

```json
[
  {
    "text": "What did Lila love the most about her grandmother's garden?",
    "options": [
      "The sweet smell of the flowers",
      "The way the sun shone through the trees",
      "Playing in the garden",
      "Both A and B"
    ],
    "answer": "Both A and B"
  },
  {
    "text": "Where did Lila's locket fall?",
    "options": [
      "In the bushes",
      "In the garden",
      "In her grandmother's house",
      "In the mailbox"
    ],
    "answer": "In the bushes"
  },
  {
    "text": "How did Lila feel when she lost her locket?",
    "options": ["Devastated", "Happy", "Excited", "Indifferent"],
    "answer": "Devastated"
  },
  {
    "text": "Who found Lila's locket?",
    "options": [
      "Her grandmother",
      "Her mother",
      "Her friend",
      "She found it herself"
    ],
    "answer": "Her grandmother"
  },
  {
    "text": "What did Lila receive in the mail?",
    "options": [
      "A package from her grandmother",
      "A letter from her mother",
      "A surprise gift",
      "A locket"
    ],
    "answer": "A package from her grandmother"
  },
  {
    "text": "What did Lila find inside the locket?",
    "options": [
      "An old letter",
      "A surprise gift",
      "Another locket",
      "A picture of her mother"
    ],
    "answer": "An old letter"
  },
  {
    "text": "How did Lila feel when she read the letter?",
    "options": [
      "Touched and emotional",
      "Angry and upset",
      "Confused and indifferent",
      "Happy and excited"
    ],
    "answer": "Touched and emotional"
  },
  {
    "text": "What did Lila do after finding the locket?",
    "options": [
      "Wore it every day",
      "Returned it to her grandmother",
      "Sold it",
      "Lost it again"
    ],
    "answer": "Wore it every day"
  },
  {
    "text": "What did Lila feel when she played in her grandmother's garden?",
    "options": [
      "A connection with her mother",
      "Bored and uninterested",
      "Lonely and sad",
      "Nothing special"
    ],
    "answer": "A connection with her mother"
  },
  {
    "text": "What gift did Lila receive from her mother through the locket?",
    "options": [
      "Love and guidance",
      "A new locket",
      "A surprise package",
      "A letter"
    ],
    "answer": "Love and guidance"
  },
  {
    "text": "True or False: Lila's mother was still alive when she received the locket.",
    "options": ["True", "False"],
    "answer": "False"
  },
  {
    "text": "True or False: Lila's grandmother found the locket in the garden.",
    "options": ["True", "False"],
    "answer": "True"
  },
  {
    "text": "True or False: Lila's locket was a gift from her mother.",
    "options": ["True", "False"],
    "answer": "True"
  },
  {
    "text": "True or False: Lila lost hope of ever finding her locket.",
    "options": ["True", "False"],
    "answer": "True"
  }
]
```

To extend it further we can use the web crawlers from MindsDB. Use web crawlers to crawl a webpage text, and generate questions using that text. But this requires more fine tuning (read text spliting and handling) as the text can be huge.

**A simple example:**

First create a new web database to use the crawler

```sql
CREATE DATABASE reevize_web
WITH ENGINE = 'web';
```

And then run the below query

```sql
SELECT questions
FROM reevize.questions_model
WHERE text = (SELECT text_content FROM reevize_web.crawler WHERE url = 'https://docs.mindsdb.com/tables_views_files' LIMIT 1)
AND mcqCount = 4
AND trueCount = 2;
```

The response from the query is as:

```json
[
  {
    "text": "What are the two options available on the MindsDB home page?",
    "options": ["Login", "Get Started"],
    "answer": "Login"
  },
  {
    "text": "What are the two options available under the Documentation section?",
    "options": ["Integrations", "Contribute"],
    "answer": "Integrations"
  },
  {
    "text": "What are the two concepts mentioned under the Overview section?",
    "options": ["Automation", "Handlers"],
    "answer": "Handlers"
  },
  {
    "text": "What are the two use cases mentioned under the Use Cases section?",
    "options": ["Chatbots", "Content Generation"],
    "answer": "Chatbots"
  },
  {
    "text": "True or False: MindsDB lets you create tables in connected databases.",
    "options": ["True", "False"],
    "answer": "True"
  },
  {
    "text": "True or False: Views are stored in projects within MindsDB.",
    "options": ["True", "False"],
    "answer": "True"
  }
]
```
