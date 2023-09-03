import MindsDB from "mindsdb-js-sdk";
import { createId } from "@paralleldrive/cuid2";

export type QuestionsRequest = {
  text: string;
  mcqCount: number;
  trueCount: number;
  result?: string;
};

export type Question = {
  text: string;
  options: string[];
  answer: string;
};

let _mindsDb: any;

const connectMindsDb = async () => {
  if (!_mindsDb) {
    console.log("MindsDB not connected: connecting");
    try {
      //@ts-ignore
      await MindsDB.default.connect({
        user: "",
        password: "",
        host: "http://localhost:47334",
      });

      console.log("connected");

      // @ts-ignore
      _mindsDb = MindsDB.default;
    } catch (error) {
      // Failed to connect to local instance
      console.log("Failed to connect to MindsDB", error);
    }
  } else {
    console.log("MindsDB already connected: bail out");
  }
};

const saveQuestionsRequest = async (request: QuestionsRequest) => {
  try {
    const id = createId();

    const sqlRes = await _mindsDb.SQL
      .runQuery(`INSERT INTO reevizeDB.Content (id, text, mcqCount, trueCount, result) \
        VALUES ('${id}', '${request.text}', ${request.mcqCount}, ${request.trueCount}, '${request.result}')`);

    console.log("sqlRes", sqlRes);

    return {
      id,
      value: request.result,
    };
  } catch (error) {
    console.error("Failed to save the request", error);
  }
};

export const generateQuestions = async (request: QuestionsRequest) => {
  await connectMindsDb();

  if (_mindsDb) {
    const questionsModel = await _mindsDb.Models.getModel(
      "questions_model",
      "reevize"
    );

    if (questionsModel) {
      try {
        const prediction = await questionsModel.query({
          where: [
            `text = '${request.text}'`,
            `mcqCount = ${request.mcqCount}`,
            `trueCount = ${request.trueCount}`,
          ],
        });

        console.log("prediction", prediction);

        request.result = JSON.stringify(JSON.parse(prediction.value));
      } catch (error) {
        console.log("failed to generate questions", error);
      }
    }

    return saveQuestionsRequest(request);
  }
};
